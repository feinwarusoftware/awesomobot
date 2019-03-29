"use strict";

const router = require("express").Router();

// 404 handler
router.use((req, res, next) => {

    const error = new Error("Not Found");
    error.status = 404;

    next(error)
});

// error handler
router.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({ error });
});

module.exports = router;
