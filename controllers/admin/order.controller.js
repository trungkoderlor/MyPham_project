const Order = require('../../models/order.model')
const Product = require('../../models/product.model')
const ProductHelper = require('../../helpers/product')
const FilterDate = require('../../helpers/filterDate')

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
            name: "Đã giao",
            status: "completed",
            class: ""
        },
        {
            name: "Đã hủy",
            status: "canceled",
            class: ""
        }
    ];
    if(req.query.status){
        const index = fillterStatus.findIndex(item => item.status == req.query.status);
        fillterStatus[index].class="active";
    } else {
        const index = fillterStatus.findIndex(item => item.status == "");
        fillterStatus[index].class="active";
    }
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    find = FilterDate.filterByDate(find, startDate, endDate);
    const keyword = req.query.keyword || "";
    if (keyword) {
        find['userInfo.name'] = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }
    if (req.query.status) {
        find.status = req.query.status;}
    try{
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
        orders: orders,
        keywords: keyword,
        fillterStatus:fillterStatus,
        startDate: startDate,
        endDate: endDate,
        expressFlash:
        {
          success: req.flash('success'),
          error: req.flash('error')
    
        }
    })
    }
    catch(err){
        console.log(err);
        res.redirect('back');
    }
    
}
// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const order = await Order.findOne({ _id: req.params.id });
        for (const product of order.products) {
            const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail stock");
            product.productInfo = productInfo;
            product.priceNew = ProductHelper.newPriceOne(product);
            product.totalPrice = product.priceNew * product.quantity;
        }
        order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);
        res.render('admin/pages/orders/detail', {
            order: order,
            expressFlash:
            {
              success: req.flash('success'),
              error: req.flash('error')
        
            }
        })
    }
    catch(err){
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
        console.log(err);
    }
   
}