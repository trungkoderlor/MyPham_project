//[GET]/admin/reports
const Order = require('../../models/order.model');
module.exports.index = async (req, res) => {
  var startDate = req.query.dateStart;
  var endDate = req.query.dateEnd;
  // Chuyển đổi startDate và endDate thành kiểu Date
  if (!startDate || !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ bắt đầu của ngày hôm nay
      startDate = today.toISOString();
      endDate = today.toISOString();
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Đặt giờ kết thúc của ngày endDate

  // Truy vấn các đơn hàng trong khoảng thời gian đã chọn
  const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    
  });

  // Tính doanh thu cho từng phương thức thanh toán
  const revenueByPaymentMethod = orders.reduce((acc, order) => {
      const paymentMethod = order.paymentMethod || 'cod'; // Mặc định là 'cod' nếu không có paymentMethod
      const orderTotal = order.products.reduce((total, product) => {
          const productTotal = product.price * product.quantity * (1 - (product.discountPercentage / 100));
          return total + productTotal;
      }, 0);
      acc[paymentMethod] = (acc[paymentMethod] || 0) + orderTotal;
      return acc;
  }, {});

  // Định dạng dữ liệu để đưa vào giao diện biểu đồ
  const chartData = {
      labels: Object.keys(revenueByPaymentMethod),
      values: Object.values(revenueByPaymentMethod).map(value => parseFloat(value.toFixed(2)))
  };

  res.render("admin/pages/report/index", {
    pageTitle: "Báo cáo",
    revenueChartData: chartData,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
