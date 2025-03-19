const express = require('express');
const path = require('path');
const moment = require('moment');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const system = require('./config/system');
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const app = express();
const database = require('./config/database');
const favicon = require('serve-favicon');
const http = require('http');
const { Server } = require("socket.io");
//pug
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
//end pug
// tinymce 
app.use(
    '/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end tinymce
require('dotenv').config();
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method')); //override method
app.use(bodyParser.urlencoded({ extended: false })); //dung du lieu cua form, req.body
const port = process.env.PORT;  
database.connect();
//flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());
//end flash
//pug
app.set("views" , "./views");
app.set("views" , `${__dirname}/views`);
app.set("view engine", "pug");
//end pug
//public
app.use(express.static("public"));
app.use(express.static(`${__dirname}/public`));
//end public
//favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use((req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end();
    } else {
      next();
    }
  });
//end favicon
//socket io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

require('./config/socket')(io);

//end socket io
//route
route(app);
routeAdmin(app);

//end route
//404
app.get("*", (req, res)=>{
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found"
    })
})
//end 404
//app locatiom var
app.locals.prefixAdmin = system.prefixAdmin;
app.locals.moment = moment;
route(app);
routeAdmin(app);
//end app location var

server.listen(port, ()=>{
  console.log(`Server is running at http://localhost:${port}`);
})