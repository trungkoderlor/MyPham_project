document.addEventListener("DOMContentLoaded", () => {
    // Button status
    const buttonsStatus = document.querySelectorAll("[button-status]");
    if (buttonsStatus.length > 0) {
        let url = new URL(window.location.href);
        buttonsStatus.forEach(button => {
            button.addEventListener("click", () => {
                const status = button.getAttribute("button-status");
                if (status) {
                    url.searchParams.set("status", status);

                } else {
                    url.searchParams.delete("status");
                }
                window.location.href = url.href;
            })
        });
        //end Button status

        // Button search
        formSearch = document.querySelector("#form-search");
        if (formSearch) {
            formSearch.addEventListener("submit", (e) => {
                e.preventDefault();
                const keyword = e.target.elements.keyword.value;
                if (keyword) {
                    url.searchParams.set("keyword", keyword);
                } else {
                    url.searchParams.delete("keyword");
                }
                window.location.href = url.href;
            });
        }
    }
    //end Button search

    // Button pagination
    const buttonsPagination = document.querySelectorAll("[button-pagination]");
    if (buttonsPagination.length > 0) {
        buttonsPagination.forEach(button => {
            button.addEventListener("click", () => {
                const page = button.getAttribute("button-pagination");
                let url = new URL(window.location.href);
                url.searchParams.set("page", page);
                window.location.href = url.href;
            })
        });
    }
    //end Button pagination
    //checkbox multi
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    if (checkboxMulti) {
        const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
        const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
        inputCheckAll.addEventListener("click", () => {
            if (inputCheckAll.checked) {
                inputsId.forEach(input => {
                    input.checked = true;
                });
            } else {
                inputsId.forEach(input => {
                    input.checked = false;
                });
            }

        });
        inputsId.forEach(input=>{
            input.addEventListener("click",()=>{
                const countInputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
                if(countInputChecked === inputsId.length){
                    inputCheckAll.checked = true;
                }else{
                    inputCheckAll.checked= false;
                }
            });
        });
    }
    //end checkbox multi
    //form change multi
    const formChangeMulti = document.querySelector("[form-change-multi]");
    if(formChangeMulti){
        
        formChangeMulti.addEventListener("submit",(e)=>{
            e.preventDefault();
            const checkboxMulti = document.querySelector("[checkbox-multi]");
            const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
            const typeChange= e.target.elements.type.value;
            if (typeChange =="delete-all")
            {
                const isConfirm = confirm("Bạn muốn xóa những sản phẩm này?");
                if (!isConfirm)
                {
                    return;
                }
            }
            if(inputsChecked.length >0){
                let ids = [];
                const inputIds=formChangeMulti.querySelector("input[name='ids']");
                inputsChecked.forEach(input=>{
                    const id = input.value;
                    if(typeChange=="change-position"){
                        const position=input
                        .closest("tr")
                        .querySelector("input[name='position']").value;
                        ids.push(`${id}-${position}`);
                        console.log(ids);
                    }else ids.push(id);
                   
                }) ;
                inputIds.value = ids.join(", ");
                formChangeMulti.submit();
            }else{
                alert("Vui lòng chọn ít nhất 1 sản phẩm");
            }
        })
    }
    //end form change multi
     
    //show alert
    const showAlert = document.querySelector("[show-alert]");
    if (showAlert)
    {
        const closeAlert = showAlert.querySelector("[close-alert]");
        const time= parseInt(showAlert.getAttribute("data-time"));
        setTimeout(()=>{
            showAlert.classList.add("alert-hidden");
        },time);
        closeAlert.addEventListener("click",()=>{
            showAlert.classList.add("alert-hidden");
        });
    }
    //end show alert
//upload image
const uploadImage=document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput=uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview=uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change",(e)=>{
        const cancelImageButton= uploadImage.querySelector("[cancel-image-button]");
        cancelImageButton.classList.remove("cancel-image-button-d");
        const file=uploadImageInput.files[0];
        if(file){
            uploadImagePreview.src=URL.createObjectURL(file);
        }
    });
}
//end upload image
//cancel image
const cancelImageButton=document.querySelector("[cancel-image-button]");
if(cancelImageButton){
    cancelImageButton.addEventListener("click",()=>{
        const uploadImagePreview=uploadImage.querySelector("[upload-image-preview]");
        uploadImagePreview.src="";
        const uploadImageInput=uploadImage.querySelector("[upload-image-input]");
        uploadImageInput.value="";
        cancelImageButton.classList.add("cancel-image-button-d");
    })
}
//sort
const sort = document.querySelector("[sort]");

if(sort){
    const selectorSort = sort.querySelector("[selector-sort]");
    const clearSort = sort.querySelector("[clear-sort]");
    const url = new URL(window.location.href);
    selectorSort.addEventListener("change",(e)=>{
        const value = e.target.value;
        if(value){
            const [sortKey,sortValue]=value.split("-");
            url.searchParams.set("sortKey",sortKey);
            url.searchParams.set("sortValue",sortValue);
            window.location.href=url.href;
        }
    })
    clearSort.addEventListener("click",()=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href=url.href;
    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if(sortKey && sortValue){
        const stringSelected = `${sortKey}-${sortValue}`;
        const optionSelected = selectorSort.querySelector(`option[value='${stringSelected}']`);
        if(optionSelected){
            optionSelected.selected=true;
        }
    }
}
//end sort


});
function toggleSidebar() {
    const sider = document.querySelector('.sider'); // Lấy sidebar
    sider.classList.toggle('active'); // Toggle class 'active' để ẩn/hiện
}

