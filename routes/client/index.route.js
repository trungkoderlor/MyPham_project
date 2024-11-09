const RouteProducts = require("./product.route");
const RouteHome = require("./home.route");
const RouteAbout = require("./about.route");
const RouteContact = require("./contact.route");
const RouteBrand = require("./brand.route");
const RouteCart = require("./cart.route");
const RouteCheckout = require("./checkout.route");
const RouteUser = require("./user.route");
// Middleware
const CategoryMiddleware = require("../../middlewares/client/category.middleware");
const BrandMiddleware = require("../../middlewares/client/brand.middleware");
const CartMiddleware = require("../../middlewares/client/cart.middleware");
const SettingMiddleware = require("../../middlewares/client/setting.middleware");
const UserMiddleware = require("../../middlewares/client/user.middleware");
module.exports= (app)=>{
    app.use(CategoryMiddleware.category);
    app.use(BrandMiddleware.brand);
    app.use(CartMiddleware.cartId);
    app.use(SettingMiddleware.settingGeneral);
    app.use(UserMiddleware.infoUser);
    app.use('/',RouteHome );
    app.use('/products', RouteProducts);
    app.use('/about', RouteAbout);
    app.use('/contact', RouteContact);
    app.use('/brand', RouteBrand);
    app.use('/cart', RouteCart);
    app.use('/checkout', RouteCheckout);
    app.use('/user', RouteUser);
};

