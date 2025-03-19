import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

document.addEventListener("DOMContentLoaded", () => {
 
  const user_id = document.querySelector("[my-id]").getAttribute("my-id");
  const socket = io('http://localhost:3000', {
    query: {
      userId: user_id,
    },
  });
  // Hàm xử lý khi khách hàng chọn kết nối
  const buttonConnect = document.querySelector(".connection-prompt .btn-connect");
  if (buttonConnect) {
    buttonConnect.addEventListener("click", () => {
      const id = buttonConnect.getAttribute('my-id');
      socket.emit("CLIENT_SENT_CONNECT", id);
      document.querySelector(".connection-prompt").style.display = "none";
      const connectionStatus = document.createElement("div");
      connectionStatus.className = "connection-status";
      connectionStatus.textContent = "Đang chờ kết nối với tư vấn viên...";
      document.querySelector(".container.my-3 .row .col-12").prepend(connectionStatus);
    });

  }
  var roomchat = null;
  socket.on('SERVER_ACCEPT_CHAT', async (room) => {
    const connectionStatus = document.querySelector(".connection-status");
    if (connectionStatus) {
      connectionStatus.style.display = "none";
    }
    roomchat = room;
    document.querySelector(".chat").style.display = "block";
  });
  socket.on('NO_ADMIN_AVAILABLE' , async()  => {
    const connectionStatus = document.querySelector(".connection-status");
    if (connectionStatus) {
      connectionStatus.innerHTML = "";
      const p = document.createElement("p");

      p.textContent = "Hiện không có tư vấn viên nào trực tuyến. Vui lòng thử lại sau hoặc gửi thư liên hệ cho chúng tôi, chúng tôi sẽ phản hồi trong thời gian sớm nhất.";
      connectionStatus.append(p);
    }
    // Hiển thị nút "Thử lại"
    const buttonRetry = document.createElement("button");
    buttonRetry.className = "btn btn-primary btn-retry";
    buttonRetry.textContent = "Thử lại";
    buttonRetry.addEventListener("click", () => {
      location.reload();
    });
    connectionStatus.append(buttonRetry);
    //hiển thị nút "Liên hệ"
    const buttonContact = document.createElement("button");
    buttonContact.className = "btn btn-primary btn-contact";
    buttonContact.textContent = "Liên hệ";
    buttonContact.addEventListener("click", () => {
      window.location.href = "/contact";
    });
    connectionStatus.append(buttonContact);
  });
  
  
  const formSendData = document.querySelector(".chat .inner-form");
  if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
      e.preventDefault();
      const content = e.target.elements.content.value;
      if (content) {
        socket.emit("CLIENT_SENT_MESSAGE", { content: content, roomchat: roomchat, user_id: user_id });
        e.target.elements.content.value = "";
      }

    });
  }
  socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    const bodyTyping = document.querySelector(".chat .inner-list-tying");

    let htmlName = ""
    if (data.user_id === user_id) {
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
  const buttonEndChat = document.querySelector(".chat .inner-header .btn-end-chat");
    if (buttonEndChat) {
      buttonEndChat.addEventListener("click", () => {
        socket.emit("CLIENT_END_CHAT", roomchat);
        
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
  //END SERVER_RETURN_MESSAGE
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
      socket.emit("CLIENT_SENT_TYPING", {type:"show",roomId: roomchat._id});
    });
    //unfocus
    input.addEventListener("focusout", () => {
      socket.emit("CLIENT_SENT_TYPING",  {type:"hide",roomId: roomchat._id});
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
      });
    });
    
  
});