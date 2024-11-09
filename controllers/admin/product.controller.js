
const Product = require('../../models/product.model');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const fillterStatusHelper = require('../../helpers/fillterStatus');
const systemConfig = require('../../config/system');
const createTreeHelper = require('../../helpers/createTree');
const Category = require('../../models/category.model');
const Account = require('../../models/account.model');
// [GET] /admin/products
module.exports.index = async (req, res) => {

    const fillterStatus = fillterStatusHelper(req.query);
    const objSearch = searchHelper(req.query);
    
    let find = {
        deleted: false
    }
    let sort={};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]=req.query.sortValue;
    } else sort.position="desc";
    if (objSearch.keyword) {
        find.title = objSearch.regex;
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    const countDocuments = await Product.countDocuments(find);
    let objectPanigation = paginationHelper(
        {
            limit: 8,
            currentPage: 1
        }
        , req.query, countDocuments);
    
    const products = await Product
        .find(find)
        .sort(sort)
        .limit(objectPanigation.limit)
        .skip(objectPanigation.skip);
    for (const product of products) {
        const account = await Account.findOne({ _id: product.createdBy.account_id });
        if(account){
            product.accountName = account.fullname;
            
        }
        
        if (product.updatedBy.length>0){
            const accountUpdate = await Account.findOne({ _id: product.updatedBy[product.updatedBy.length-1].account_id });
            if(accountUpdate){
                product.accountUpdateName = accountUpdate.fullname;
            }
        }
    }
    res.render("admin/pages/products/index", {
        pageTitle: "Trang Danh Sách Sản Phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keywords: objSearch.keyword,
        objectPanigation: objectPanigation,
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }



    });
}
//[GET] /admin/products/trash
module.exports.trash = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query);
    const objSearch = searchHelper(req.query);
    let find = {
        deleted: true
    }
    if (objSearch.keyword) {
        find.title = objSearch.regex;
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    countDocuments = await Product.countDocuments(find);
    objectPanigation = paginationHelper(
        {
            limit: 8,
            currentPage: 1
        }
        , req.query, countDocuments);
    const products = await Product
        .find(find)
        .sort({ position: "desc" })
        .limit(objectPanigation.limit)
        .skip(objectPanigation.skip);
    for (const product of products) {
        const account = await Account.findOne({ _id: product.deletedBy.account_id });
        if(account){
            product.accountName = account.fullname;
        }
    }
    res.render("admin/pages/products/trash", {
        pageTitle: "Trang Thùng Rác Sản Phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keywords: objSearch.keyword,
        objectPanigation: objectPanigation,
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }
    })
}
// [PATH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const updatedBy={
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { 
        status: status,
       $push : {updatedBy: updatedBy}});
    req.flash("success", "Cập nhật trạng thái thành công");
    const currentPage = req.query.page;

    res.redirect('back');


}
// [PATH] /admin/products/trash/restore/:id
module.exports.restore = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted:false,deletedAt:null });
    req.flash("success", "Khôi phục sản phẩm thành công");
    const currentPage = req.query.page;
    res.redirect('back');


}
// [PATH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    const updatedBy={
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" ,$push : {updatedBy: updatedBy}});
            req.flash("success", `${ids.length} sản phẩm cập nhật trạng thái thành công`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive",$push : {updatedBy: updatedBy} });
            req.flash("success", `${ids.length} sản phẩm cập nhật trạng thái thành công`);
            break;
        case "delete-all-forever":
            await Product.deleteMany({ _id: { $in: ids } });
            req.flash("success", `${ids.length} sản phẩm được xóa vĩnh viễn`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: true,
                    deletedBy: { 
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    } 
                });
            req.flash("success", `${ids.length} sản phẩm xóa thành công`);
            break;
        case "restore":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: false,
                    deletedAt: null
                }
            );
            req.flash("success", `${ids.length} sản phẩm được khôi phục thành công`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                console.log(id);
                console.log(position);
                await Product.updateOne({ _id: id }, { position: position,$push : {updatedBy: updatedBy} });
            }
            req.flash("success", `${ids.length} sản phẩm đổi vị trí thành công`);
        default:
            break;
    }

    res.redirect('back');
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash("success", `sản phẩm xóa thành công`);
    res.redirect('back');
}
//[DELETE] /admin/products/trash/delete/:id
module.exports.deleteTrash = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({ _id: id });
    req.flash("success", `sản phẩm xóa thành công`);
    res.redirect('back');
}
//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    const records = await Category.find({
        deleted: false
      });
    const newRecords = createTreeHelper.Tree(records);
    res.render("admin/pages/products/create", {
        pageTitle: "Trang Tạo Sản Phẩm",
        expressFlash:{
            success: req.flash('success'),
            error: req.flash('error')
        },
        records: newRecords
    });
}
//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", `vui lòng nhập tiêu đề !`);
        res.redirect('back');
        return;
    }
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    };
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}
//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id
        }
        const records = await Category.find({
            deleted: false
          });
        const newRecords = createTreeHelper.Tree(records);
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Trang Sửa Sản Phẩm",
            expressFlash: {
                success: req.flash('success'),
                error: req.flash('error')
            },
            product: product,
            records: newRecords
        });
    }
    catch (error) {
        req.flash("error", `không tìm thấy sản phẩm`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}
//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    if (!req.body.title) {
        req.flash("error", `vui lòng nhập tiêu đề !`);
        res.redirect('back');
        return;
    }
    console.log(req.body);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const updatedBy={
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
     try {
        await Product.updateOne({ _id: id }, 
            {
                ...req.body,
               $push : {updatedBy: updatedBy}
            }
        );
        req.flash("success", 'sửa sản phẩm thành công');
        res.redirect(`back`);
    }
    catch (error) {
        req.flash("success", 'sửa sản phẩm không thành công');
        res.redirect(`back`);
    }
    
}
//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id
        }
            
        
        const product = await Product.findOne(find);
        const account = await Account.findOne({ _id: product.createdBy.account_id });
            if(account){
                product.accountName = account.fullname;
                
            }
            if (product.updatedBy.length>0){
                const accountUpdate = await Account.findOne({ _id: product.updatedBy[product.updatedBy.length-1].account_id });
                if(accountUpdate){
                    product.accountUpdateName = accountUpdate.fullname;
                }
            }
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            expressFlash: {
                success: req.flash('success'),
                error: req.flash('error')
            },
            product: product
        });

    }
    catch (error) {
        req.flash("error", `không tìm thấy sản phẩm`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}