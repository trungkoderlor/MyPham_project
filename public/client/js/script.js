document.addEventListener("DOMContentLoaded", function () {
  const formSearch = document.querySelector("#form-search");
  if (formSearch){
    formSearch.addEventListener("submit",function(e){
      const keyword = e.target.elements.keyword.value;
      if (!keyword){
        e.preventDefault();
      } 
    });
  }
});
