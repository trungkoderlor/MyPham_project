const RouteProducts = require("./product.route");
const RouteHome = require("./home.route");
const RouteAbout = require("./about.route");
const RouteContact = require("./contact.route");
module.exports= (app)=>{
    app.use('/',RouteHome );
    app.use('/products', RouteProducts);
    app.use('/about', RouteAbout);
    app.use('/contact', RouteContact);
};

