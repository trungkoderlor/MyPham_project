document.addEventListener('DOMContentLoaded', function() {
  // Lấy dữ liệu từ server
  const data = JSON.parse(document.getElementById('myChart').getAttribute('data-chart'));


  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar', // Loại biểu đồ chính là bar
    data: {
      labels: data.labels, // Mỗi cột là 1 ngày
      datasets: [
        {
          label: 'Số đơn hàng (cột)',
          type: 'bar', // Biểu đồ cột
          data: data.values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Xu hướng (đường line)',
          type: 'line', // Biểu đồ đường
          data: data.values,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          tension: 0.3 // Tạo hiệu ứng cong cho đường line
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Số lượng đơn hàng'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ngày trong tháng'
          }
        }
      }
    }
  });
});