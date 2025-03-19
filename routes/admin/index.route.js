const dashboardRoutes = require('./dashboard.route');
const systemconfig = require('../../config/system');
const productRoutes = require('./product.route');
const categoryRoutes = require('./category.route');
const brandRoutes = require('./brand.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myaccountRoutes = require('./my-account.route');
const settingRoutes = require('./setting.route');
const orderRoutes = require('./order.route');
const userRoutes = require('./user.route');
const letterRoutes = require('./letter.route');
const reviewRoutes = require('./review.route');
const chatRoutes = require('./chat.route');
const reportRoutes = require('./report.route');
const authMiddleware = require('../../middlewares/admin/auth.middleware');
const notificationMiddleware = require('../../middlewares/admin/notification.middleware');

module.exports= (app)=>{
    
    PATH_ADMIN = systemconfig.prefixAdmin;
    app.use(notificationMiddleware.notification);
    app.use(PATH_ADMIN+ '/dashboard',
        authMiddleware.requireAuth,
        dashboardRoutes);
    app.use(PATH_ADMIN+ '/products',authMiddleware.requireAuth, productRoutes);
    app.use(PATH_ADMIN+ '/categories',authMiddleware.requireAuth, categoryRoutes);
    app.use(PATH_ADMIN+ '/brands',authMiddleware.requireAuth, brandRoutes);
    app.use(PATH_ADMIN+ '/roles',authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN+ '/accounts',authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN+ '/auth', authRoutes);
    app.use(PATH_ADMIN+ '/my-account',authMiddleware.requireAuth, myaccountRoutes);
    app.use(PATH_ADMIN+ '/settings',authMiddleware.requireAuth, settingRoutes);
    app.use(PATH_ADMIN+ '/orders',authMiddleware.requireAuth, orderRoutes);
    app.use(PATH_ADMIN+ '/users',authMiddleware.requireAuth, userRoutes);
    app.use(PATH_ADMIN+ '/letters',authMiddleware.requireAuth, letterRoutes);
    app.use(PATH_ADMIN+ '/reviews',authMiddleware.requireAuth, reviewRoutes);
    app.use(PATH_ADMIN+ '/chats',authMiddleware.requireAuth, chatRoutes);
    app.use(PATH_ADMIN+ '/report',authMiddleware.requireAuth, reportRoutes);
};

