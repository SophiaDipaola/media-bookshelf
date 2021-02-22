const express = require('express');
const router = express.Router();
const unirest = require('unirest');
require('dotenv').config();

// import database
const db = require('../models');
const category = require('../models/category');

//GET routes
router.get('/', (req, res) => {
    if (req.user) {
        db.medium.findAll({
            where: {
                userId: req.user.id
            }
        }).then(mediaResponse => {
            console.log("mediaResponse",mediaResponse)
            db.category.findAll({
                where: {
                    userId: req.user.id
                }
            }).then((categoryResponse) => {
                console.log("categoryResponse",categoryResponse)
                res.render('media', {
                    medium: mediaResponse,
                    categories: categoryResponse,
                })
            })
        })
    }
    else {
        console.log('must be signed in to access this page');
        res.redirect('auth/login')
    }


})

//POST routes - posting new media to database
router.post('/', (req, res) => {
    console.log(req.body);
    db.medium.create({
        mediaName: req.body.mediaName,
        mediaUrl: req.body.mediaUrl,
        userId: req.user.id,
    }).then((response) =>
        res.redirect('/media')
    )
})


//PUT routes - changing/updating media name
router.put('/:id', (req, res) => {
    db.medium.update({ mediaName: req.body.name }, {
        where: {
            id: req.params.id
        }
    }).then((updatedMedia) => {
        console.log('Updated Media = ', updatedMedia);
        res.redirect('/media');
    })
})


//DELETE routes
router.delete('/:id', (req, res) => {
    db.medium.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((deleted) => {
            console.log('Deleted Media = ', deleted);
            res.redirect('/media');
        })
})


module.exports = router;
