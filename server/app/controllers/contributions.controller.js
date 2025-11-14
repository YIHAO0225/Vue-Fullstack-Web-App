import db from '../models/index.js'
import mongoose, {Types} from "mongoose";
import characters from "../models/characters.model.js";
import contributions from "../models/contributions.model.js";
import userlist from "../models/userlist.model.js"
import {appendOne as characterAppendOne} from "./characters.controller.js";

//Find a single contributions with an id
export const findOne = (req, res) => {
    const id = req.params.id;
    // contributions.findOne({ _id: id})
    contributions.findOne({_id: id})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving documents."
            });
        });
};


export const appendOne = (req, res) => {
    try {
        // Extract contribution data from the request body
        let {contribution_id, user_id, action, status, reviewed_by, date, data} = req.body;
        if (!contribution_id || !user_id || !action || !status || !date || !data || !data.id) {
            return res.status(403).json({success: false, message: "Please fill in all information"});
        }

        if (action === 'AddCharacter') {
            //inspect is there same character name
            characters.findOne({id: data.id}).then(characterData => {
                if (characterData) {
                    return res.status(403).send({message: 'Already have this character!'})
                }

                contributions.findOne({'status': 'Pending', 'data.id': data.id}).then(contributionData => {
                    if (contributionData) {
                        return res.status(403).send({message: 'Someone have a pending request about this character!'})
                    }
                    // Create a new Contribution instance with the extracted data
                    contributions.findOne().sort({_id: -1}) // Sort by _id in descending order
                        .then(lastEntry => {
                            if (!lastEntry) {
                                return res.status(404).send({message: 'No entries found in the collection'});
                            }
                            contribution_id = parseInt(lastEntry.contribution_id) + 1

                            const contribution = new contributions({
                                _id: new mongoose.Types.ObjectId(),
                                contribution_id: contribution_id,
                                user_id: user_id,
                                action: action,
                                status: status,
                                reviewed_by: reviewed_by,
                                date: date,
                                data: data,
                            });

                            // Save the new contribution to the database
                            contribution.save()
                            res.json({message: 'Record has been saved successfully!'})
                        }).catch(err => {
                        console.error('Error retrieving last entry:', err);
                        res.status(500).send({message: 'Internal server error'});
                    });
                }).catch(err => {
                    console.error('Error retrieving last entry:', err);
                    res.status(500).send({message: 'Internal server error'});
                })
            }).catch(err => {
                console.error('Error retrieving last entry:', err);
                res.status(500).send({message: 'Internal server error'});
            })
        } else if (action === 'EditCharacter' || action === 'DeleteCharacter') {
            contributions.findOne({'status': 'Pending', 'data.id': data.id}).then(contributionData => {
                if (contributionData) {
                    return res.status(403).send({message: 'Someone have a pending request about this character!'})
                }
                // Create a new Contribution instance with the extracted data
                contributions.findOne().sort({_id: -1}) // Sort by _id in descending order
                    .then(lastEntry => {
                        if (!lastEntry) {
                            return res.status(404).send({message: 'No entries found in the collection'});
                        }
                        contribution_id = parseInt(lastEntry.contribution_id) + 1

                        const contribution = new contributions({
                            _id: new mongoose.Types.ObjectId(),
                            contribution_id: contribution_id,
                            user_id: user_id,
                            action: action,
                            status: status,
                            reviewed_by: reviewed_by,
                            date: date,
                            data: data,
                        });

                        // Save the new contribution to the database
                        contribution.save()
                        res.json({message: 'success'})
                    }).catch(err => {
                    console.error('Error retrieving last entry:', err);
                    res.status(500).send({message: 'Internal server error'});
                })
            }).catch(err => {
                console.error('Error retrieving last entry:', err);
                res.status(500).send({message: 'Internal server error'});
            })
        }
    } catch (error) {
        console.error("error while appending new element to Contributions collection: ", error);
        res.status(500).json({success: false, message: "Error during appending the new character"});
    }
};

export const deleteOne = (req, res) => {
    const id = req.params.id;
    // contributions.findOne({ _id: id})
    contributions.deleteOne({_id: id})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving documents."
            });
        });
}


//Find all contributions
export const findAll = (req, res) => {
    /** !important!  there will return data with users' info!!!   */
    contributions.find().sort({date: -1}).populate('user_id._id').populate('reviewed_by._id').then(contributionsData => {
        res.json(contributionsData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents."
        });
    });
};

//Get Addcharacter conotribution by user_id
export const findAddCharacterByUser = (req, res) => {
    const id = req.params.id;
    contributions.findOne({action: "AddCharacter", 'data.id': id}).populate('user_id._id').then(data => {
        res.json(data);
    }).catch(error => {
        res.status(500).json({message: error})
    })
}

export const editOne = (req, res) => {
    let contribution_id = req.params.id
    let status = req.body.status

    if (!contribution_id || !status || !req.body.reviewed_by || !req.body.reviewed_by._id) {
        res.status(403).json({msg: 'Wrong Data'})
    }

    let reviewed_id = req.body.reviewed_by._id

    contributions.findByIdAndUpdate({_id: contribution_id}, {
        status: status,
        "reviewed_by": {
            _id: new Types.ObjectId(reviewed_id)
        }
    }).then(contribution_data => {
        if (status === 'Rejected') {
            res.json({message: 'The action has been Rejected successfully!'})
        } else if (status === 'Approved') {

            // Add, edit, or delete character
            if (contribution_data.action === 'AddCharacter') {
                req.body = contribution_data.data
                req.body.active = true
                characterAppendOne(req, res)
            } else if (contribution_data.action === 'EditCharacter') {
                let data = contribution_data.data
                let id = contribution_data.data.id

                characters.findOneAndUpdate({id: id}, data)
                    .then(data => {
                        res.status(200).json({message: 'Successful restore character', data: data})
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Error updating document"
                        });
                    });
            } else if (contribution_data.action === 'DeleteCharacter') {
                let id = contribution_data.data.id
                characters.findOneAndUpdate({id: id}, {active: false})
                    .then(data => {
                        if (data) {
                            res.status(200).json({message: "succesfull delete"});
                        } else {
                            res.status(404).json({message: "Document not found"});
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message || "Error updating document"
                        });
                    });
            } else {
                res.status(403).json({msg: 'Wrong Data'})
            }
        } else {
            res.status(403).json({msg: 'Wrong Data'})
        }
    }).catch(error => {
        res.status(500).json({message: error})
    })
};

export const history = (req, res) => {
    var query = contributions.aggregate([
        { $match: { status: "Approved" } },
        { $sort : {'data.id':1,date:-1}}
    ]).then(data =>{
        // console.log(data.toJSON())
        res.status(200).json(data)
    })
    // res.status(200).json({message:"dsdfsf"})
}