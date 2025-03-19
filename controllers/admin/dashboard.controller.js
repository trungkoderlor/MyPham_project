// [GET] /admin/dashboard
const Category = require('../../models/category.model');
const Product = require('../../models/product.model');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');
const Order = require('../../models/order.model');
const Letter = require('../../models/letter.model');

const { Socket } = require('socket.io');
module.exports.dashboard = async (req, res) => {
    
    const statistics = {
        categories: {
            total: 0,
            active: 0,
            inactive: 0
        },
        products: {
            total: 0,
            active: 0,
            inactive: 0
        },
        accounts: {
            total: 0,
            active: 0,
            inactive: 0
        },
        users: {
            total: 0,
            active: 0,
            inactive: 0
        },
        orders: {
            total: 0,
            revenue: 0,
            quantity: 0,
            canceled : 0
        },
        letters:{
            total:0,
            unprocessed:0,
            processed:0,
            processing:0
        }
    }
    await Category.find()
        .then(categories => {
            statistics.categories.total = categories.length;
            statistics.categories.active = categories.filter(category => category.status === "active").length;
            statistics.categories.inactive = categories.filter(category => category.status === "inactive").length;
        })
    await Product.find()
        .then(products => {
            statistics.products.total = products.length;
            statistics.products.active = products.filter(product => product.status === "active").length;
            statistics.products.inactive = products.filter(product => product.status === "inactive").length;
        })
    await Account.find()
        .then(accounts => {
            statistics.accounts.total = accounts.length;
            statistics.accounts.active = accounts.filter(account => account.status === "active").length;
            statistics.accounts.inactive = accounts.filter(account => account.status === "inactive").length;
        })   
    await User.find()
        .then(users => {
            statistics.users.total = users.length;
            statistics.users.active = users.filter(user => user.status === "active").length;
            statistics.users.inactive = users.filter(user => user.status === "inactive").length;})
    await Letter.find()
        .then(letters => {
            statistics.letters.total = letters.length;
            statistics.letters.unprocessed = letters.filter(letter => letter.status === "unprocessed").length;
            statistics.letters.processed = letters.filter(letter => letter.status === "processed").length;
            statistics.letters.processing = letters.filter(letter => letter.status === "processing").length;
        })
    
    try {
        // Lấy ngày đầu tiên và ngày cuối cùng của tháng hiện tại
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // Truy vấn các đơn hàng trong tháng hiện tại
        const orders = await Order.find({
            createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        });

        // Tính tổng doanh thu
        const totalRevenue = orders.reduce((total, order) => {
            const orderTotal = order.products.reduce((orderSum, product) => {
                const productTotal = product.price * product.quantity * (1 - product.discountPercentage / 100);
                return orderSum + productTotal;
            }, 0);
            return total + orderTotal;
        }, 0);
        statistics.orders.revenue = totalRevenue.toFixed(3);  ; 

        statistics.orders.total = orders.length;
        statistics.orders.quantity = orders.reduce((total, order) => total + order.products.length, 0);
        statistics.orders.canceled = orders.filter(order => order.status === "canceled").length;
        
        const orderCountsByDay = Array.from({ length: endOfMonth.getDate() }, () => 0);
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).getDate(); // Lấy ngày trong tháng (1 -> 30/31)
            orderCountsByDay[orderDate - 1] += 1; // Tăng số lượng đơn hàng của ngày đó
        });

        const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => `Ngày ${i + 1}`);
        res.render("admin/pages/dashboard/index", {
            pageTitle: "Trang Tổng Quan",
            statistics: statistics,
            data: {
                labels: daysInMonth, 
                values: orderCountsByDay
            },
            expressFlash:
        {
          success: req.flash('success'),
          error: req.flash('error')
    
        }
    
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}