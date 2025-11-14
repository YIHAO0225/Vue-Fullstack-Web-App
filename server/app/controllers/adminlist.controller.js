import db from '../models/index.js'
import adminModel from '../models/adminlist.model.js'
import {Types} from 'mongoose'
const adminlist = db.adminlist;

//Find a single adminlist with an id
export const findOne = (req, res) => {
    const id = req.params.id;
    // adminlist.findOne({ _id: id})
    adminlist.findOne({_id:id})
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

//Add a user to adminlist   
export const appendOne = (req,res) =>{
    const id = new Types.ObjectId(req.params.id)
    adminlist.findOne({_id:req.params.id})
    .then(data => {
        if(data){
            res.status(206).json({message:"The user is an administrator"})
        }else{
            const Administrator = new adminModel(
                {
                    _id:id
                }
            )
            Administrator.save()
            res.status(200).json({message:"Add user to adminlist successfull!"})
        }
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
}

//Delete a user to adminlist   
export const DeleteOne = (req,res) =>{
    adminlist.deleteOne({_id:req.params.id})
    .then(data => {
        if(data.deletedCount != 0){
            res.status(200).json({message:"Delete adminstrator successfull!"})
        }else{
            res.status(206).json({message:"The user is an user"})
        }
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
}