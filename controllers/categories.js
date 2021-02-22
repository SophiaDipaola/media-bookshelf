const express = require('express');
const router = express.Router();
const unirest = require('unirest');
require('dotenv').config();

// import database
const db = require('../models');
const category = require('../models/category');

//GET routes
router.get('/', async (req, res) => {
    try {
        // console.log(req)
        var listenNotesUrl = 'https://listen-api.listennotes.com/api/v2';
        let response = await unirest.get(`https://listen-api.listennotes.com/api/v2/search?q=${req.query.search}`)
            .header('X-ListenAPI-Key', process.env.APIKEY)
        response = await response.toJSON();
        let podcastResults = response.body.results;
        // use the passport helper to pass a user to render
        if (req.user) {
            db.category.findAll({
                where: {
                    userId: req.user.id
                }
            }).then(response => {
                res.render('categories', {
                    podcastResults,
                    categories: response
                })
            })
        }
        else {
            console.log('must be signed in to access this page');
            res.redirect('auth/login')
        }
        //console.log(podcastResults[0])
    } catch (e) {
        console.log(e)
    }
});

//POST routes

router.post('/', (req, res) => {
    //console.log(req.body);
    // req.body.userId is undefined
    db.category.create({
        name: req.body.category,
        userId: req.user.id
    }).then(response => {
        console.log('this is the response')
        console.log(response);
        res.redirect('/categories');
    })
})

//PUT routes
router.put('/:id', (req, res) => {
    db.category.update({ name: req.body.name }, {
        where: {
            id: req.params.id
        }
    }).then((updatedCategory) => {
        console.log('Updated Category = ', updatedCategory);
        res.redirect('/category')
    })
})

router.get('/:id', (req, res) => {
    db.category.findOne({
        where: { id: req.params.id }
    })
        .then((currentCat) => {
            console.log("media=", currentCat.media);
            console.log("media=", currentCat.media);
            console.log("medium=", currentCat.medium);
            console.log("mediums=", currentCat.mediums);
            res.render('categories/show', { currentCat });
        })
})


//DELETE routes
router.delete('/:id', (req, res) => {
    db.category.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((deleted) => {
            console.log('Deleted Category = ', deleted);
            res.redirect('/categories');
        })
})


module.exports = router;