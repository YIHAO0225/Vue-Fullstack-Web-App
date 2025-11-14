import mongoose from 'mongoose';

const charactersSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: { type: String, required: true },
  active: { type: Boolean, default: true },
  name: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image_url: { type: String },
  strength: { type: Number },
  speed: { type: Number },
  skill: { type: Number },
  fear_factor: { type: Number },
  power: { type: Number },
  intelligence: { type: Number },
  wealth: { type: Number }
  },{versionKey: false});

const characters = mongoose.model('Characters',charactersSchema,'characters');
export default characters;