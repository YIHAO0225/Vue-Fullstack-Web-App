import mongoose from 'mongoose';

const adminListSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId
  },{versionKey: false});

const adminlist = mongoose.model('Adminlist',adminListSchema,'adminlist');
export default adminlist;