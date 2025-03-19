
document.addEventListener("DOMContentLoaded", () => {

  const unreadNotificationsCount = document.querySelector('.notification-count');
  
  // Nhận thông báo realtime
  socket.on('NEW_NOTIFICATION', (notification) => {
    // Cập nhật giao diện
    const noti = document.querySelector('#notification-toast');
    noti.innerHTML = `
      <a href=${notification.detailLink}>
      <div class="notification-icon" >
        <i class="fa-solid fa-envelope"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.content}</div>
      </div> 
      </a> `;
      noti.addEventListener('click', () => {
        socket.emit('MARK_AS_READ', notification._id);
      });
    if (noti) {
      noti.classList.remove('hide');
      setTimeout(() => {
        noti.classList.add('hide');
      }, 10000);
    }
    
    const notificationList = document.querySelector('.notification-list');
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item');
    notificationItem.setAttribute('data-id', notification._id);
    notificationItem.classList.add(notification.isRead ? '' : 'unread');
    notificationItem.innerHTML = `
    <a href="${notification.detailLink}">
      <div class="notification-content">
          ${notification.content}
      </div>
      <div class="notification-meta">
          <span class="notification-type type-${notification.type}">${notification.type}</span>
          <span class="notification-time ml-2">${new Date(notification.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
      </div>
    </a>
  `;
    notificationList.prepend(notificationItem);
    notificationItem.addEventListener('click', function () {
      item.classList.remove('unread');
      unreadNotificationsCount.innerText = parseInt(unreadNotificationsCount.innerText) - 1;
      const id = item.getAttribute('data-id');
      socket.emit('MARK_AS_READ', id);
    });
    if (unreadNotificationsCount) {
      unreadNotificationsCount.innerText = parseInt(unreadNotificationsCount.innerText) + 1;
    }
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
      item.addEventListener('click', function () {
        item.classList.remove('unread');
        unreadNotificationsCount.innerText = parseInt(unreadNotificationsCount.innerText) - 1;
        const id = item.getAttribute('data-id');
        socket.emit('MARK_AS_READ', id);
        // Thực hiện call API để đánh dấu thông báo đã đọc (cần thêm API)
      });
    });
  });
  //end socket
  //close notification
  const closeButtons = document.querySelector('.notification-close');

  if (closeButtons) {
    closeButtons.addEventListener('click', (e) => {
      const notification = document.querySelector('#notification-toast');
      if (notification) {
        notification.classList.add('hide');
      }
    });
  }
  //end close notification
  //notification in header
  const notificationIcon = document.querySelector('.notification-wrapper .notification-icon');
  const notificationList = document.querySelector('.notification-list');

  // Ẩn / Hiện danh sách thông báo khi nhấn vào icon
  notificationIcon.addEventListener('click', () => {
    notificationList.classList.toggle('hide');
  });

  // Ẩn thông báo khi nhấn ra ngoài
  document.addEventListener('click', function (e) {
    if (!notificationIcon.contains(e.target) && !notificationList.contains(e.target)) {
      notificationList.classList.add('hide');
    }
  });

  // Đánh dấu thông báo là đã đọc khi nhấn vào
  const notificationItems = document.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function () {
      item.classList.remove('unread');
      unreadNotificationsCount.innerText = parseInt(unreadNotificationsCount.innerText) - 1;
      const id = item.getAttribute('data-id');
      socket.emit('MARK_AS_READ', id);

    });
  });
});