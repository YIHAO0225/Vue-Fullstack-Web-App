import favouritesmodel from '../models/favourites.model.js';
import db from '../models/index.js'
const favourites = db.favourites;
import { Types } from 'mongoose';

//Find a single favourites with an id
export const findOne = (req, res) => {
    const id = req.params.id;
    // favourites.findOne({ _id: id})
    favourites.findOne({ _id: id })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving favourites."
            });
        });
};

//update favourites with user id
export const updateFavouriteById = (req, res) => {
    //需要实现从req中获取userid
    let { user_id, id } = req.body;
    user_id = new Types.ObjectId(user_id)
    try {
        //Query the user's favorite list
        favourites.findOne({ 'user_id._id' : user_id}).then(data => {
            console.log(data)
            if (data && data.characters.includes(id)) {
                return res.status(200).json({ message: 'Character already exists in favourites' });
            } else if (!data) {
                const charecter = new favouritesmodel(
                    {
                        user_id: {
                            '_id':user_id,
                        },
                        'characters': [id]
                    }
                )
                charecter.save()
                return res.status(201).json({ message: "Create new Favourite to document" });
            }
            //add new charater and save
            favourites.updateOne({ 'user_id._id': user_id }, { '$push': { characters: id } }).then((data) => {
                console.log("moogose update successful")
            }).catch((error) => {
                console.log(error)
            })
            return res.status(200).json({ message: 'Succesfull add Character' });
        })


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}