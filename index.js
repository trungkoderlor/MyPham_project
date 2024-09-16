const express = require('express');
const route = require('./routes/client/index.route');
const app = express();
const database = require('./config/database');
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
require('dotenv').config();
app.use(express.static(`${__dirname}/public`));
const port = process.env.PORT;  
database.connect();

route(app);
app.listen(port, ()=>{
  console.log(`Server is running at http://localhost:${port}`);
})