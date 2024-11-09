document.addEventListener("DOMContentLoaded", () => {
    //change status
    const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
    if (buttonChangeStatus.length > 0) {
        const formChangeStatus = document.querySelector("#formChangeStatus");

        buttonChangeStatus.forEach(button => {
            button.addEventListener("click", () => {
                const currentstatus = button.getAttribute("data-status");
                const id = button.getAttribute("data-id");

                let changeStatus = currentstatus == "active" ? "inactive" : "active";

                const path = formChangeStatus.getAttribute("path");
                const action = `${path}/${changeStatus}/${id}?_method=PATCH`;
                formChangeStatus.action = action;
                formChangeStatus.submit();
            });
        });
    }
    //end change status

    //delete product
    const buttonDelete = document.querySelectorAll("[button-delete]");

    if (buttonDelete.length > 0) {
        const formDeleteItem = document.querySelector("#formDeleteItem");
        const path = formDeleteItem.getAttribute("path");

        buttonDelete.forEach(button => {

            button.addEventListener("click", () => {

                const isConfirm = confirm("Bạn có chắc chắn muốn xóa dữ liệu này không ?");
                if (isConfirm) {
                    id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=delete`
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                }

            });
        });
    }
    //end delete product
    //restore product
    const buttonRestore = document.querySelectorAll("[button-restore]");
    if(buttonRestore.length>0){
        const formRestoreItem = document.querySelector("#formRestoreItem");
        const path = formRestoreItem.getAttribute("path");
        buttonRestore.forEach(button =>{
            button.addEventListener("click",()=>{
                const isConfirm = confirm("Bạn có chắc chắn muốn khôi phục dữ liệu này không ?");
                if(isConfirm){
                    id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=PATCH`;
                    formRestoreItem.action = action;
                    formRestoreItem.submit();
                }
            });
        });
    }
});