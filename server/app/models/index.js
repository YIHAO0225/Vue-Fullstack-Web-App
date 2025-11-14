import url from "../config/db.config.js"
import mongoose from 'mongoose';
import adminlist from "./adminlist.model.js";
import characters from "./characters.model.js";
import contributions from "./contributions.model.js";
import favourites from "./favourites.model.js";
import userlist from "./userlist.model.js";

mongoose.Promise = global.Promise;

const db = {}
db.mongoose = mongoose;
db.url = url;
db.adminlist = adminlist;
db.characters = characters;
db.contributions = contributions;
db.favourites = favourites;
db.userlist = userlist;
export default db;
