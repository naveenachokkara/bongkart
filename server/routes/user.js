/**
 * Created by SESA435400 on 5/1/2017.
 */
'use strict';
const express = require('express');
const router = express.Router();
const user = require('../models/user');

router.post('/create', (req, res, next) => {
    console.log(req.body);
    let newUser = new user(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json(user);
        }
    });
});


router.get('/list', (req, res, next) => {
    user.find({}, (err, users) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(users);
        }
    });
});

router.get('/:id', (req, res, next) => {
    user.find({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(user);
        }
    });
});


router.delete('/:id', (req, res, next) => {
    user.remove({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(user);
        }
    });
});

router.put('/update/:id', (req, res, next) => {
    user.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }, (err, user) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(user);
        }
    });
});

module.exports = router;

