"use strict";

const router = require("express").Router();

router.use((req, res, next) => {

    const error = new Error();
    error.status = 404;

    next(error)
});

router.use((error, req, res) => {

    if (error.status === 404) {

        return res.json({ error: 404 });
    }

    res.status(error.status || 500);
    res.json({ error });
});

module.exports = router;
