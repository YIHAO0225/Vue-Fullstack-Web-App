import mongoose from 'mongoose';

const contributionsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  contribution_id: { type: String, required: true },
  user_id: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Userlist'
    },
  },
  action: { type: String, required: true },
  status: { type: String, required: true },
  reviewed_by: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Userlist' },
  },
  // date: { type: Date, required: true },
  date: { type: String, required: true },
  data: {
    id: { type: String, required: true },
    name: { type: String},
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

  }
  },{versionKey: false});
const contributions = mongoose.model('Contributions',contributionsSchema,'contributions');
export default contributions;