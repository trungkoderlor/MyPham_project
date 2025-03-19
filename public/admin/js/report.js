document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#filterButton');
  button.addEventListener('click', function () {
    const startDate = document.getElementById('dateStart').value;
    const endDate = document.getElementById('dateEnd').value;
    if (startDate && endDate) {
      window.location.href = `/admin/report?dateStart=${startDate}&dateEnd=${endDate}`;
    } else {
      alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc.');
    }
  });
  // doanh thu theo phương thức
  const chartData = JSON.parse(document.getElementById('revenueChart').getAttribute('data-chart'));
  const totalRevenue = chartData.values.reduce((sum, value) => sum + value, 0);
  const ctx = document.getElementById('revenueChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Doanh Thu',
        data: chartData.values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1
      }]
    },
    
    options: { // Chuyển responsive vào đây
      responsive: true,
      plugins: {
        legend: {
          position: 'left'
        },
        title: {
          display: true,
          text: `Tổng Doanh Thu: ${totalRevenue} $`
        }
      }
    }
});
});