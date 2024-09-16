const RouteProducts = require("./product.route");
const HomeProducts = require("./home.route");
module.exports= (app)=>{
    app.use('/',HomeProducts );
    app.use('/products', RouteProducts);
};

