document.addEventListener("DOMContentLoaded", function () {
  //search form
  const formSearch = document.querySelector("#form-search");
  if (formSearch) {
    formSearch.addEventListener("submit", function (e) {
      const keyword = e.target.elements.keyword.value;
      if (!keyword) {
        e.preventDefault();
      }
    });
  }
  //end search form
  //product detail increase decrease
  const inputQuantity = document.querySelector("#quantity");
  if (inputQuantity) {
    const btnDecrease = document.querySelector("#decrease");
    const btnIncrease = document.querySelector("#increase");

    btnDecrease.addEventListener("click", () => {
      if (inputQuantity.value > 1) {
        inputQuantity.value = parseInt(inputQuantity.value) - 1;
      }
    });
    btnIncrease.addEventListener("click", () => {
      inputQuantity.value = parseInt(inputQuantity.value) + 1;
    });
  }

  // Hiển thị form đánh giá
  const reviewButtons = document.querySelectorAll('.btn-review');

  if (reviewButtons.length > 0) {
    reviewButtons.forEach(button => {

      button.addEventListener('click', () => {
        const orderId = button.getAttribute('order-id');
        const productId = button.getAttribute('product-id');
        const formId = `review-form-${orderId}-${productId}`;

        const formContainer = document.getElementById(formId);
        if (formContainer) {
          formContainer.classList.toggle('hidden');
          // Chèn form vào container
          formContainer.innerHTML = `
            <form action="/user/history-orders/review/${orderId}" method="POST" enctype="multipart/form-data">
              <div class="rating-stars">
                <i class="star" data-value="1" style="font-style:normal">★</i>
                <i class="star" data-value="2" style="font-style:normal">★</i>
                <i class="star" data-value="3" style="font-style:normal">★</i>
                <i class="star" data-value="4" style="font-style:normal">★</i>
                <i class="star" data-value="5" style="font-style:normal">★</i>
                <input type="hidden" name="rating" id="rating-input" value="0" />
              </div>
              <input type="hidden" name="product_id"  value=${productId} />
              <textarea name="comment" id="comment" placeholder="Nhập đánh giá của bạn..." required></textarea>
              <div class="form-group" upload-image>
              <input type="file" name="image" accept="image/*" upload-image-input/>
              <img
                    src=""
                    upload-image-preview
                    class="image-preview"
                />
                <button
                    type="button"
                    class = 'btn btn-danger btn-sm cancel-image-button-d'
                    cancel-image-button
                    style = "margin-top: 32px;margin-left: 10px;"
                > Hủy</button>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">Gửi đánh giá</button>
            </form>
          `;

          // Thêm sự kiện cho sao đánh giá
          const stars = formContainer.querySelectorAll('.star');
          stars.forEach(star => {
            star.addEventListener('click', () => {
              const value = star.getAttribute('data-value');
              document.getElementById('rating-input').value = value;
              stars.forEach(s => s.classList.remove('active'));
              for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
              }
            });
          });
          //upload image
          const uploadImage = document.querySelector("[upload-image]");

          if (uploadImage) {
            const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
            const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

            uploadImageInput.addEventListener("change", (e) => {
              const cancelImageButton = uploadImage.querySelector("[cancel-image-button]");
              cancelImageButton.classList.remove("cancel-image-button-d");
              const file = uploadImageInput.files[0];
              if (file) {
                uploadImagePreview.src = URL.createObjectURL(file);
              }
            });
          }
          //end upload image
          //cancel image
          const cancelImageButton = document.querySelector("[cancel-image-button]");
          if (cancelImageButton) {
            cancelImageButton.addEventListener("click", () => {
              const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
              uploadImagePreview.src = "";
              const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
              uploadImageInput.value = "";
              cancelImageButton.classList.add("cancel-image-button-d");
            })
          }

        }
      });
    });

  }
  //otp input
  const inputFields = document.querySelectorAll("input.field");

  inputFields.forEach((field) => {
    field.addEventListener("input", handleInput);
  });

  function handleInput(e) {
    let inputField = e.target;
    if (inputField.value.length >= 1) {
      let nextField = inputField.nextElementSibling;
      return nextField && nextField.focus();
    }
  }
  //end otp input
  //account dropdown
  const accountDropdown = document.querySelector(".account-dropdown");
  if (accountDropdown){
    const dropdownMenu = accountDropdown.querySelector(".dropdown-menu");

  accountDropdown.addEventListener("mouseover", () => {
    dropdownMenu.style.display = "block";
  });

  accountDropdown.addEventListener("mouseout", () => {
    dropdownMenu.style.display = "none";
  });
  } 
  
  //end account dropdown
  // detail account
  const navLinks = document.querySelectorAll(".account-detail .nav-link");
  const tabPanes = document.querySelectorAll(".account-detail .tab-pane");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Bỏ qua xử lý nếu link dẫn đến trang khác
      if (link.getAttribute("href").startsWith("/")) return;

      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((nav) => nav.classList.remove("active"));
      // Add active class to clicked link
      link.classList.add("active");

      // Hide all tab panes
      tabPanes.forEach((pane) => pane.classList.remove("show", "active"));
      // Show the selected tab
      const target = document.querySelector(link.getAttribute("href"));
      target.classList.add("show", "active");
    });
  });
  //end detail account
  //jump to review
  // Kiểm tra điều kiện

  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('highlight-review');
    }
  }
  //end jump to review
  const avatarInput = document.getElementById('avatar');
  const avatarPreview = document.getElementById('avatar-preview');
  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.src = e.target.result; // Gán ảnh mới vào thẻ img
        };
        reader.readAsDataURL(file); // Đọc file dưới dạng URL
      }
    });
  }
  //end avatar
  // Xác nhận mật khẩu
  const form = document.getElementById('change-password-form');
  const formRegister = document.querySelector('.form-register');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const errorMessage = document.getElementById('password-error');
  function CheckConfirmPassword(e) {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      // Hiển thị thông báo lỗi
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Mật khẩu mới và mật khẩu xác nhận không khớp.';

      // Thêm class để làm nổi bật trường bị lỗi
      newPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.add('is-invalid');

      // Ngăn không cho form được gửi
      e.preventDefault();
    } else {
      // Ẩn thông báo lỗi nếu mọi thứ ổn
      errorMessage.style.display = 'none';
      newPasswordInput.classList.remove('is-invalid');
      confirmPasswordInput.classList.remove('is-invalid');
    }
  }
  // Lắng nghe sự kiện 'submit' cho cả hai form
  if (form)  form.addEventListener('submit', CheckConfirmPassword);
 
 if (formRegister) formRegister.addEventListener('submit', CheckConfirmPassword);
  if (newPasswordInput && confirmPasswordInput) {
    // Xóa lỗi ngay khi người dùng bắt đầu nhập lại
    [newPasswordInput, confirmPasswordInput].forEach(input => {
      input.addEventListener('input', function () {
        errorMessage.style.display = 'none';
        newPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.remove('is-invalid');
      });
    });
  }
  const alerts = document.querySelectorAll(".alert-popup[show-alert]");
  if (alerts.length>0){
    alerts.forEach((alert) => {
      const closeButton = alert.querySelector(".alert-close-btn");
      const displayTime = parseInt(alert.getAttribute("data-time"), 10) || 5000;
  
      // Automatically hide alert after specified time
      const timer = setTimeout(() => {
        //xóa atribut show-alert
        alert.removeAttribute("show-alert");
        
      }, displayTime);
  
      // Handle manual close
      closeButton.addEventListener("click", () => {
        clearTimeout(timer);
        alert.removeAttribute("show-alert");
      });
    });
  }
  const resendButton = document.getElementById("resendButton");
  const timerText = document.getElementById("timerText");
  let countdown = 60; // Thời gian chờ (60 giây)

  const updateTimer = () => {
    if (countdown > 0) {
      timerText.textContent = `Vui lòng đợi ${countdown} giây để gửi lại mã OTP.`;
      countdown--;
    } else {
      timerText.textContent = ""; // Xóa văn bản sau khi hết thời gian
      resendButton.disabled = false; // Kích hoạt nút
    }
  };

  // Ẩn nút gửi lại OTP ban đầu
  if (resendButton)
  resendButton.disabled = true;

  // Bắt đầu đếm ngược
  const timerInterval = setInterval(() => {
    updateTimer();

    // Dừng đếm ngược khi hết thời gian
    if (countdown < 0) {
      clearInterval(timerInterval);
    }
  }, 1000); // Cập nhật mỗi giây
  //end resend otp
  //payment options
  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  const transferInfo = document.getElementById("transfer-info");
  if (paymentOptions.length> 0  ) {
    paymentOptions.forEach(option => {
      option.addEventListener("change", function () {
        if (this.value === "transfer") {
          transferInfo.style.display = "block"; // Hiển thị thông tin chuyển khoản
        } else {
          transferInfo.style.display = "none"; // Ẩn thông tin chuyển khoản
        }
      });
    });
  }
  //end payment options
});
