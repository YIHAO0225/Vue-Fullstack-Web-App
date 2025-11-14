import mongoose from 'mongoose';

const favouritesSchema = new mongoose.Schema({
  user_id: {
    _id: String
  },
  characters: [{ type: String }]
  },{versionKey: false});
const favourites = mongoose.model('Favourites',favouritesSchema,'favourites');
export default favourites;
