import db from '../models/index.js'
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userlist = db.userlist;
const adminlist = db.adminlist;


export const login = (req, res) => {
    try {
        const {email, password} = req.body;
        if (!req.body || !email || !password) {
            return res.status(400).json({success: false, message: "Please fill in all information"});
        } else {
            const email = req.body.email;
            userlist.findOne({email: email})
                .then(user => {
                    if (!user) {
                        return res.status(400).json({success: false, message: "Email not found"});
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            adminlist.findOne({_id: user._id}).then( data => {
                                let isAdmin = false
                                if (data) isAdmin = true
                                res.json({
                                    success: true,
                                    user: {
                                        _id: user._id,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        isAdmin: isAdmin,
                                    },message: " login successful!"
                                });
                            })
                        } else {
                            res.status(404).json({success: false, message: "wrong password"});
                        }
                    });
                })
        }
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({success: false, message: "Error during registration"});
    }
};

export const signup = (req, res) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({success: false, message: "Please fill in all information"});
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
            return res.status(400).json({ success: false, message: "Names must not contain numbers" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        userlist.findOne({email: email})
            .then(data => {
                if (data) {
                    return res.status(409).json({success: false, message: "User already exists"});
                }
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({success: false, message: "Error hashing password"});
                    }
                    const newUser = new userlist({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hashedPassword,
                    });
                    newUser.save();
                    res.status(201).json({success: true, message: "User registered successfully!"});
                })
            });

    } catch (error) {
        console.error("Signup Error: ", error);
        res.status(500).json({success: false, message: "Error during registration"});
    }
};