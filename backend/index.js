const express = require('express');
const cors = require('cors');

const db = require('./db');
const detectFakeReview = require('./ai');

const app = express();

app.use(cors());
app.use(express.json());


/* =========================================
   DEFAULT ROUTE
========================================= */

app.get('/', (req, res) => {

    res.send("Backend running successfully");

});


/* =========================================
   USER LOGIN
========================================= */

app.post('/user/login', (req, res) => {

    const { email, password } = req.body;

    const query = `

        SELECT *
        FROM User

        WHERE email = ?
        AND password = ?

    `;

    db.query(

        query,

        [email, password],

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Database error"
                );

            }

            if (result.length === 0) {

                return res.status(401).json({

                    message:
                    "Invalid credentials"

                });

            }

            res.json({

                message:
                "Login successful",

                user: result[0]

            });

        }

    );

});


/* =========================================
   ADMIN LOGIN
========================================= */

app.post('/admin/login', (req, res) => {

    const { email, password } = req.body;

    const query = `

        SELECT *
        FROM Admin

        WHERE email = ?
        AND password = ?

    `;

    db.query(

        query,

        [email, password],

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Database error"
                );

            }

            if (result.length === 0) {

                return res.status(401).json({

                    message:
                    "Invalid credentials"

                });

            }

            res.json({

                message:
                "Login successful",

                admin: result[0]

            });

        }

    );

});


/* =========================================
   GET PRODUCTS
========================================= */

app.get('/products', (req, res) => {

    const query = `

        SELECT *
        FROM Product

        LIMIT 20

    `;

    db.query(query, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).send(
                "Error fetching products"
            );

        }

        res.json(result);

    });

});


/* =========================================
   PLACE ORDER
========================================= */

app.post('/order', (req, res) => {

    const {

        user_id,
        product_id

    } = req.body;


    const query = `

        INSERT INTO Orders
        (
            user_id,
            product_id,
            order_date
        )

        VALUES
        (
            ?, ?, CURDATE()
        )

    `;


    db.query(

        query,

        [
            user_id,
            product_id
        ],

        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Error placing order"
                );

            }

            res.json({

                message:
                "Order placed successfully"

            });

        }

    );

});


/* =========================================
   SUBMIT REVIEW
========================================= */

app.post('/review', (req, res) => {

    const {

        user_id,
        product_id,
        summary,
        review_text

    } = req.body;


    /* -------------------------------------
       CHECK IF USER ORDERED PRODUCT
    ------------------------------------- */

    const orderCheck = `

        SELECT *
        FROM Orders

        WHERE user_id = ?
        AND product_id = ?

    `;


    db.query(

        orderCheck,

        [
            user_id,
            product_id
        ],

        (err, orderResult) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Database error"
                );

            }


            if (orderResult.length === 0) {

                return res.status(403).json({

                    message:
                    "User has not ordered this product"

                });

            }


            /* ---------------------------------
               INSERT REVIEW
            --------------------------------- */

            const reviewQuery = `

                INSERT INTO Review
                (
                    user_id,
                    product_id,
                    summary,
                    review_text,
                    review_time
                )

                VALUES
                (
                    ?, ?, ?, ?, CURDATE()
                )

            `;


            db.query(

                reviewQuery,

                [

                    user_id,
                    product_id,
                    summary,
                    review_text

                ],

                (err2, result) => {

                    if (err2) {

                        console.error(err2);

                        return res.status(500).send(
                            "Error inserting review"
                        );

                    }


                    const review_id =
                        result.insertId;


                    /* -----------------------------
                       AI DETECTION
                    ----------------------------- */

                    const ai =
                        detectFakeReview(
                            review_text
                        );


                    /* -----------------------------
                       INSERT AI RESULT
                    ----------------------------- */

                    const aiQuery = `

                        INSERT INTO AI_Result
                        (
                            review_id,
                            fake_probability,
                            label
                        )

                        VALUES
                        (
                            ?, ?, ?
                        )

                    `;


                    db.query(

                        aiQuery,

                        [

                            review_id,
                            ai.score,
                            ai.label

                        ],

                        (err3) => {

                            if (err3) {

                                console.error(err3);

                                return res.status(500).send(
                                    "Error saving AI result"
                                );

                            }


                            res.json({

                                message:
                                "Review submitted successfully",

                                ai_result: ai

                            });

                        }

                    );

                }

            );

        }

    );

});


/* =========================================
   ADMIN DASHBOARD REVIEWS
========================================= */

app.get('/admin/reviews/:company_id', (req, res) => {

    const company_id =
        req.params.company_id;


    const query = `

        SELECT

            p.product_name,

            r.summary,
            r.review_text,
            r.review_time,

            a.fake_probability,
            a.label,

            u.reviewerName

        FROM Product p

        JOIN Review r
        ON p.product_id =
           r.product_id

        JOIN AI_Result a
        ON r.review_id =
           a.review_id

        JOIN User u
        ON r.user_id =
           u.user_id

        WHERE p.company_id = ?

        ORDER BY r.review_id DESC

    `;


    db.query(

        query,

        [company_id],

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Error fetching admin reviews"
                );

            }

            res.json(result);

        }

    );

});


/* =========================================
   START SERVER
========================================= */

app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});
