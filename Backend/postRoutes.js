const express = require('express');
const database = require('./connect');

const objectID = require('mongodb').ObjectId; // convert string to object ID

let postRoutes = express.Router();

postRoutes.route('/posts')
    .get( async (req, res) => {
        let db = database.getDB();
        let data = await db.collection('posts')
            .find({}) // having an empty object returns everything
            .toArray()
    
        if (data.length > 0) {
            res.json(data);
        } else {
            // res.json({ message: "No posts found" }); // for prod
            throw new Error("No posts found");
        }
    })
    ;
    
postRoutes.route('/posts/:id')
    .get( async (req, res) => {
        let db = database.getDB();
        let data = await db.collection('posts')
            .findOne({ _id: new objectID(req.params.id) }) // find is for multiple things
    
        if (data) {
            res.json(data);
        } else {
            // res.json({ message: "No post found" }); // for prod
            throw new Error("No post found");
        }
    })
    ;

postRoutes.route('/posts')
    .post( async (req, res) => {
        let db = database.getDB();
        let mongoObject = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.author,
            date: req.body.date
        };
        let data = await db.collection('posts')
            .insertOne(mongoObject)
    
        res.json(data);

       
    })
    ;

postRoutes.route('/posts/:id')
    .put( async (req, res) => {
        let db = database.getDB();
        let mongoObject = {
            $set: { // set is for updating the database with new data
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                author: req.body.author,
                date: req.body.date
            }
        };
        let data = await db.collection('posts')
            .updateOne({ _id: new objectID(req.params.id) }, mongoObject)
    
        res.json(data);

       
    })
    ;

postRoutes.route('/posts/:id')
    .delete( async (req, res) => {
        let db = database.getDB();
        let data = await db.collection('posts')
            .deleteOne({ _id: new objectID(req.params.id) }) // find is for multiple things
    
        res.json(data);
})

module.exports = postRoutes;