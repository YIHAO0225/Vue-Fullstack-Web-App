import express from 'express';
import db from './app/models/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './app/routers/mainrouter.js';
const app = express()



// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//cross-domain
app.use(cors());

//router
app.use(router)



db.mongoose.connect(db.url,{
  }).then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Fail to connect database', err));

app.listen(3001,() => {
    console.log('http://localhost:3001/')
})