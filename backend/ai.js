function detectFakeReview(text, rating) {
    let score = 0;

    if (text.includes("buy now")) score += 0.5;
    if (text.length < 10) score += 0.3;
    if (rating === 5 && text.includes("best")) score += 0.2;

    return {
        score: score,
        label: score > 0.5 ? "Fake" : "Genuine"
    };
}

module.exports = detectFakeReview;
