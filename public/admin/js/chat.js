import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
document.addEventListener("DOMContentLoaded", () => {
  const storedRoom = JSON.parse(sessionStorage.getItem('currentChatRoom'));
  const AdminId = document.querySelector("[admin-id]").getAttribute("admin-id");
  const roomIdinPage = document.querySelector("[room-id]").getAttribute("room-id");
  if (storedRoom && storedRoom._id === roomIdinPage) {
    // Kết nối lại vào phòng
    socket.emit('CLIENT_RECONNECT', storedRoom._id);
    //CLIENT_SENT_MESSAGE
    const formSendData = document.querySelector(".chat .inner-form");
    if (formSendData) {
      formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
          socket.emit("CLIENT_SENT_MESSAGE", { content: content, roomchat: storedRoom, user_id: AdminId });
          e.target.elements.content.value = "";
        }

      });
    }
    //END CLIENT_SENT_MESSAGE
    //SERVER_RETURN_MESSAGE
    socket.on("SERVER_RETURN_MESSAGE", (data) => {
      const body = document.querySelector(".chat .inner-body");
      const div = document.createElement("div");
      const bodyTyping = document.querySelector(".chat .inner-list-tying");
      let htmlName = ""
      if (data.user_id === AdminId) {
        div.classList.add("inner-outgoing");
      }
      else {
        div.classList.add("inner-incoming");
      }
      div.innerHTML = `
    ${htmlName}
    <div class="inner-content">
      ${data.content}
    `
      body.insertBefore(div, bodyTyping);
      body.scrollTop = body.scrollHeight;
    });
    //END SERVER_RETURN_MESSAGE
    const buttonEndChat = document.querySelector(".chat .inner-header .btn-end-chat");
    if (buttonEndChat) {
      buttonEndChat.addEventListener("click", () => {
        socket.emit("CLIENT_END_CHAT", storedRoom );
      });
    }
    socket.on("SERVER_END_CHAT", async () => {
      const body = document.querySelector(".chat .inner-body");
      const div = document.createElement("div");
      div.classList.add("noti-end-chat");
      div.innerHTML = `
      <p>Đã kết thúc cuộc trò chuyện</p>
      `;
      body.appendChild(div);
      const innerFoot = document.querySelector(".chat .inner-foot");
      innerFoot.style.display = "none";
      body.scrollTop = body.scrollHeight;
    });
    //scroll to bottom
    const body = document.querySelector(".chat .inner-body");
    body.scrollTop = body.scrollHeight;
    //end scroll to bottom
    //emoji
    const ButtonIcon = document.querySelector(".chat .inner-form .icon-button");
    if (ButtonIcon) {
      const tooltip = document.querySelector('.tooltip')
      Popper.createPopper(ButtonIcon, tooltip)
      ButtonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("show");
      });
    }
    const emojiPicker = document.querySelector('emoji-picker')
    if (emojiPicker) {
      const input = document.querySelector(".chat .inner-form input[name='content']");
      emojiPicker.addEventListener('emoji-click', e => {
        input.value += e.detail.unicode;
        let end = input.value.length;
        input.focus();
        input.setSelectionRange(end, end);
      });
      //typing
      //keyUp
      input.addEventListener("keyup", () => {
        socket.emit("CLIENT_SENT_TYPING", { type: "show", roomId: storedRoom._id });
      });
      //unfocus
      input.addEventListener("focusout", () => {
        socket.emit("CLIENT_SENT_TYPING", { type: "hide", roomId: storedRoom._id });
      });
    }

    //end emoji
    //SERVER_RETURN_TYPING
    socket.on("SERVER_RETURN_TYPING", (data) => {
      const type = data.type;
      const listTying = document.querySelector(".chat .inner-list-tying");

      if (listTying) {
        if (type === "show") {

          listTying.innerHTML = `
        <div class="box-typing">
        <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
            </div>
            </div>`
            ;
          const body = document.querySelector(".chat .inner-body");
          body.scrollTop = body.scrollHeight;
        }
        else if (type === "hide") {
          listTying.innerHTML = "";
        }
      }

    });
    // end SERVER_RETURN_TYPING
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      window.addEventListener('unload', () => {
        sessionStorage.removeItem('currentChatRoom');
      });
    });
    
  } else {
    const body = document.querySelector(".body");
    //không ở trong room này
    body.innerHTML = `
    <div class="not-in-room">
      <h2 class="not-in-room-title">Không thể truy cập</h2>
      <p class="not-in-room-message">Bạn không có quyền truy cập vào phòng chat này. Vui lòng kiểm tra lại mã phòng hoặc liên hệ quản trị viên để được hỗ trợ.</p>
      <p class="not-in-room-message">Trở về trang quản trị sau : <span id="countdown"></span></p>
      <button class="not-in-room-button">Trở Lại</button>
    </div>
  `;
    let timeLeft = 10; // 10 giây
    const countdownElement = document.getElementById('countdown');
    function updateCountdown() {
      if (timeLeft > 0) {
        countdownElement.textContent = timeLeft + ' giây';
        timeLeft--;
      } else {
        clearInterval(timer); // Dừng đồng hồ đếm ngược
        window.location.href = "/admin/dashboard";
      }
    }
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    const goBackButton = document.querySelector(".not-in-room-button");
    goBackButton.addEventListener("click", () => {
      window.history.back();
    });
  }
});
