import db from '../models/index.js'
import mongoose from "mongoose";
const characters = db.characters;

//Find a single characters with an id
export const findOne = (req, res) => {
    const id = req.params.id;
    characters.findOne({ _id: id})
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

//Find all characters
export const find = (req, res) => {
    characters.find({})
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

//Delete character By id
export const deleteOneByid = (req, res) => {
    const id = req.params.id;
    characters.findOneAndUpdate({ _id: id }, { active: false })
    .then(data => {
        if (data) {
            res.status(200).json({message:"succesfull delete"});
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err.message || "Error updating document"
        });
    });
};

//Restore  character By id
export const RestoreOneByid = (req, res) => {
    const id = req.params.id;
    characters.findOneAndUpdate({_id:id}, req.body)
    .then(data => {
        return res.status(200).json({ message: 'Successful edit character!', data: data })
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error updating document"
        });
    });
};

// Append a new element
export const appendOne = (req, res) => {
    try {
        // Extract contribution data from the request body
        let { id, 
            active, 
            name,
            subtitle,
            description,
            image_url,
            strength,
            speed,
            skill,
            fear_factor,
            power,
            intelligence,
            wealth} = req.body;

        if(!id || active == null || !name) {
            return res.status(400).json({success: false, message: "Please fill in all information"});
        }

        //Detect if there are duplicate character
        characters.findOne({ id: id})
        .then(data => {
            if(data){
                res.status(200).json({message:"character already exists"})
            }else{
                const character = new characters({
                    _id: new mongoose.Types.ObjectId(),
                    id: id, 
                    active: active, 
                    name: name,
                    subtitle: subtitle,
                    description: description,
                    image_url: image_url,
                    strength: strength,
                    speed: speed,
                    skill: skill,
                    fear_factor: fear_factor,
                    power: power,
                    intelligence: intelligence,
                    wealth: wealth,
                });
                character.save();
                console.log("==Add new char to the Characters collection successfully==")
                res.status(200).json({message:"character creat sucessfull"})
            }
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving documents."
            });
        });

    } catch (error) {
        console.error("error while appending new element to Contributions collection: ", error);
        res.status(500).json({success: false, message: "Error during appending the new character"});
    }
}