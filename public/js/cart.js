document.addEventListener("DOMContentLoaded", () => {
  const inputsQuantity = document.querySelectorAll("input[name='quantity']");
  if (inputsQuantity) {
    inputsQuantity.forEach(input => {
      input.addEventListener("change", async (e) => {
        const quantity = input.value;
        const productId = input.getAttribute("data-id");
        window.location.href = `/cart/update/${productId}/${quantity}`;
      });
    });
  }
});