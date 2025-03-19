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
const authMiddleware = require("../../middlewares/client/auth.middleware");
const guessMiddleware = require("../../middlewares/client/guess.middleware");
const UrlMiddleware = require("../../middlewares/client/url.middleware");
module.exports= (app)=>{
    app.use(UrlMiddleware.storeReturnUrl);
    app.use(CategoryMiddleware.category);
    app.use(BrandMiddleware.brand);
    app.use(CartMiddleware.cartId);
    app.use(SettingMiddleware.settingGeneral);
    app.use(UserMiddleware.infoUser);
    app.use('/',guessMiddleware.Guess,RouteHome );
    app.use('/products',guessMiddleware.Guess,RouteProducts);
    app.use('/about',guessMiddleware.Guess, RouteAbout);
    app.use('/contact',guessMiddleware.Guess, RouteContact);
    app.use('/brand',guessMiddleware.Guess, RouteBrand);
    app.use('/cart',authMiddleware.requireAuth, RouteCart);
    app.use('/checkout',authMiddleware.requireAuth, RouteCheckout);
    app.use('/user', RouteUser);
};

