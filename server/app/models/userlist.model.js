import mongoose from 'mongoose';

const userlistSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
  },{versionKey: false});


const userlist = mongoose.model('Userlist',userlistSchema,'userlist');
export default userlist;