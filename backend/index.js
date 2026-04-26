const express = require('express');
const cors = require('cors');

const db = require('./db');
const detectFakeReview = require('./ai');

const app = express();

app.use(cors());
app.use(express.json());


/* =====================================================
   DEFAULT ROUTE
===================================================== */

app.get('/', (req, res) => {

    res.send("Backend running successfully");

});


/* =====================================================
   GET USERS
===================================================== */

app.get('/users', (req, res) => {

    const query = `
        SELECT *
        FROM User
        LIMIT 10
    `;

    db.query(query, (err, result) => {

        if (err) {

            console.error(err);
            return res.status(500).send(
                "Error fetching users"
            );

        }

        res.json(result);

    });

});


/* =====================================================
   SUBMIT REVIEW + AI DETECTION
===================================================== */

app.post('/review', (req, res) => {

    const {

        user_id,
        product_id,
        summary,
        review_text

    } = req.body;


    if (
        !user_id ||
        !product_id ||
        !review_text
    ) {

        return res.status(400).json({

            message:
            "Missing required fields"

        });

    }


    /* ---------------------------------------------
       INSERT REVIEW
    --------------------------------------------- */

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

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).send(
                    "Error inserting review"
                );

            }


            const review_id =
                result.insertId;


            /* -----------------------------------------
               AI DETECTION
            ----------------------------------------- */

            const ai =
                detectFakeReview(
                    review_text,
                    5
                );


            /* -----------------------------------------
               INSERT AI RESULT
            ----------------------------------------- */

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

                (err2) => {

                    if (err2) {

                        console.error(err2);

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

});


/* =====================================================
   GET REVIEWS + AI RESULTS
===================================================== */

app.get('/reviews', (req, res) => {

    const query = `

        SELECT

            r.review_id,
            r.summary,
            r.review_text,
            r.review_time,

            a.fake_probability,
            a.label

        FROM Review r

        JOIN AI_Result a

        ON r.review_id =
           a.review_id

        ORDER BY r.review_id DESC

        LIMIT 10

    `;


    db.query(query, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).send(
                "Error fetching reviews"
            );

        }

        res.json(result);

    });

});


/* =====================================================
   START SERVER
===================================================== */

app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});
