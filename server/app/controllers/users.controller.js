import db from '../models/index.js'
import {ObjectId} from "mongodb";
const userlist = db.userlist;
const favourites = db.favourites;
const contributions = db.contributions;

//Find a single userlist with an id
export const findOne = (req, res) => {
    const id = req.params.id;
    // userlist.findOne({ _id: id})
    userlist.findOne({_id:id})
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
    });
};

// Get one user's favourites
export const findFavourites = (req, res) => {
    const user_id = req.params.user_id;
    console.log("user_id:",user_id)
    favourites.find({ 'user_id._id': new ObjectId(user_id) })
        .then(data => {
            let arr = []
            data.forEach((item) => {
                arr = arr.concat(item.characters)
            })
            res.json(arr)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

//  Get one user's all changes and contributions
export const findContributions = (req, res) => {
    const user_id = req.params.user_id;
    contributions.find({ 'user_id._id': new ObjectId(user_id) }).sort({date: -1})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

//Find all userinfo
export const findall = (req, res) => {
    userlist.find({})
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
    });
};