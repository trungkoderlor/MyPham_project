document.addEventListener("DOMContentLoaded", function () {
  //search form
  const formSearch = document.querySelector("#form-search");
  if (formSearch){
    formSearch.addEventListener("submit",function(e){
      const keyword = e.target.elements.keyword.value;
      if (!keyword){
        e.preventDefault();
      } 
    });
  }
  //end search form
  //product detail increase decrease
  const inputQuantity = document.querySelector("#quantity");
  if(inputQuantity){
    const btnDecrease = document.querySelector("#decrease");
    const btnIncrease = document.querySelector("#increase");
    console.log(btnDecrease);
    btnDecrease.addEventListener("click",()=>{
      if(inputQuantity.value>1){
        inputQuantity.value = parseInt(inputQuantity.value)-1;
      }
    });
    btnIncrease.addEventListener("click",()=>{
      inputQuantity.value = parseInt(inputQuantity.value)+1;
    });
  }
});
