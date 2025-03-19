const Order = require('../../models/order.model')
const Product = require('../../models/product.model')
const ProductHelper = require('../../helpers/product')
const FilterDate = require('../../helpers/filterDate')
const sendMailHelper = require('../../helpers/sendMail');
const User = require('../../models/user.model');
const { ObjectId } = require('mongoose').Types;
// [GET] /admin/orders
module.exports.index = async (req, res) => {
    let find = {};
    let fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Chờ xác nhận",
            status: "pending",
            class: ""
        },
        {
            name: "Đang giao",
            status: "shipping",
            class: ""
        },
        {
            name: "Đã Giao",
            status: "shipped",
            class: ""
        },
        {
            name: "Chưa Nhận Được Hàng",
            status: "unreceived",
            class: ""
        },
        {
            name: "Đã Hoàn Thành",
            status: "completed",
            class: ""
        },
        {
            name: "Đã hủy",
            status: "canceled",
            class: ""
        }
    ];
    if (req.query.status) {
        const index = fillterStatus.findIndex(item => item.status == req.query.status);
        fillterStatus[index].class = "active";
    } else {
        const index = fillterStatus.findIndex(item => item.status == "");
        fillterStatus[index].class = "active";
    }
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    find = FilterDate.filterByDate(find, startDate, endDate);
    const keyword = req.query.keyword || "";
    if (keyword) {
        if (ObjectId.isValid(keyword)) {
          find._id = new ObjectId(keyword);
        } else {
          find.$or = [
            { 'userInfo.name': { $regex: keyword, $options: 'i' } },
            { 'userInfo.phone': { $regex: keyword, $options: 'i' } },
            { 'userInfo.email': { $regex: keyword, $options: 'i' } },
            { 'userInfo.address': { $regex: keyword, $options: 'i' } },
          ];
        }
      }
    if (req.query.status) {
        find.status = req.query.status;
    }
    try {
        const orders = await Order.find(find);
        for (const order of orders) {
            for (const product of order.products) {
                const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail stock");
                product.productInfo = productInfo;
                product.priceNew = ProductHelper.newPriceOne(product);
                product.totalPrice = product.priceNew * product.quantity;
                await Product.updateOne({ _id: product.product_id }, { stock: productInfo.stock - product.quantity });
            }
            order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);
        }

        res.render('admin/pages/orders/index', {
            pageTitle: "Trang Danh Sách Đơn Hàng",
            orders: orders,
            keywords: keyword,
            fillterStatus: fillterStatus,
            startDate: startDate,
            endDate: endDate,
            expressFlash:
            {
                success: req.flash('success'),
                error: req.flash('error')

            }
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back');
    }

}
// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        for (const product of order.products) {
            const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail stock");
            product.productInfo = productInfo;
            product.priceNew = ProductHelper.newPriceOne(product);
            product.totalPrice = product.priceNew * product.quantity;
        }
        order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);
        res.render('admin/pages/orders/detail', {
            pageTitle: "Trang Chi Tiết Đơn Hàng",
            order: order,
            expressFlash:
            {
                success: req.flash('success'),
                error: req.flash('error')

            }
        })
    }
    catch (err) {
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
        console.log(err);
    }

}
// [POST] /admin/orders/detail/:id/confirm
module.exports.ConfirmStatus = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        order.status = 'shipping';
        const user = await User.findOne({ _id: order.user_id });
        await order.save();
        const subject = "Cảm ơn quý khách đã đặt hàng tại Mỹ Phẩm DHT";
        const html = `
                <p>Kính gửi ${order.userInfo.name},</p>
                <p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được xác nhận và đang trong quá trình xử lý.</p>
                
                <h3>Thông tin đơn hàng</h3>
                <ul>
                  <li><strong>Mã đơn hàng:</strong> ${order._id}</li>
                  <li><strong>Ngày đặt hàng:</strong> ${order.createdAt.toLocaleString()}</li>
                  <li><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</li>
                </ul>
              
              
                <h3>Thông tin giao hàng</h3>
                <ul>
                  <li><strong>Họ tên:</strong> ${order.userInfo.name}</li>
                  <li><strong>Địa chỉ:</strong> ${order.userInfo.address}</li>
                  <li><strong>Số điện thoại:</strong> ${order.userInfo.phone}</li>
                </ul>
              
                <p>Đơn hàng sẽ được giao đến địa chỉ của quý khách trong vòng 3-5 ngày làm việc. Vui lòng kiểm tra kỹ khi nhận hàng.</p>
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline:</p>
                <ul>
                  <li><strong>Email:</strong> support@dht.com</li>
                  <li><strong>Hotline:</strong> 0768517629 </li>
                </ul>
                <p>Trân trọng,<br/>Đội ngũ Mỹ Phẩm DHT</p>`;
        sendMailHelper.sendMail(user.email, subject, html)
        req.flash('success', 'Xác nhận đơn hàng thành công');
        res.redirect('back');
    }
    catch (err) {
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
        console.log(err);
    }
};
// [POST] /admin/orders/detail/:id/confirmShipped
module.exports.ConfirmShipped = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        order.status = 'shipped';
        const user = await User.findOne({ _id: order.user_id });
        await order.save();
        const subject = "Đơn hàng của bạn đã được giao thành công";
        const html = `
                <p>Kính gửi ${order.userInfo.name},</p>
                <p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được đơn vị vận chuyển giao thành công.</p>
                  <h3>Thông tin đơn hàng</h3>
                <ul>
                  <li><strong>Mã đơn hàng:</strong> ${order._id}</li>
                  <li><strong>Ngày đặt hàng:</strong> ${order.createdAt.toLocaleString()}</li>
                  <li><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</li>
                </ul>
              
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline:</p>
                <ul>
                  <li><strong>Email:</strong> support@dht.com</li>
                  <li><strong>Hotline:</strong> 0768517629 </li>
                </ul>
                <p>Trân trọng,<br/>Đội ngũ Mỹ Phẩm DHT</p>
                `;
        sendMailHelper.sendMail(user.email, subject, html)
        req.flash('success', 'Xác nhận giao hàng thành công');
        res.redirect('back');
    }
    catch (err) {
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
        console.log(err);
    }
}
// [POST] /admin/orders/detail/:id/processed
module.exports.Processed = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        order.status = 'completed';
        const user = await User.findOne({ _id: order.user_id });
        await order.save();
        const subject = "Đơn hàng của đã được xử lý";
        const html = `
                <p>Kính gửi ${order.userInfo.name},</p>
                <p>Chúng tôi rất xin lỗi vì sự nhầm lần trước đó, đơn hàng của bạn đã được kiểm tra và xử lý hoàn tất.</p>
                  <h3>Thông tin đơn hàng</h3>
                <ul>
                  <li><strong>Mã đơn hàng:</strong> ${order._id}</li>
                  <li><strong>Ngày đặt hàng:</strong> ${order.createdAt.toLocaleString()}</li>
                  <li><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</li>
                </ul>
              
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline:</p>
                <ul>
                  <li><strong>Email:</strong> support@dht.com</li>
                  <li><strong>Hotline:</strong> 0768517629 </li>
                </ul>
                <p>Trân trọng,<br/>Đội ngũ Mỹ Phẩm DHT</p>
                `;
        sendMailHelper.sendMail(user.email, subject, html)
        req.flash('success', 'Xác nhận xử lý đơn hàng thành công');
        res.redirect('back');
    }
    catch (err) {
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
        console.log(err);
    }
}