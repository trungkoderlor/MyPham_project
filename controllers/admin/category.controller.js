const systemConfig = require('../../config/system');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const fillterStatusHelper = require('../../helpers/fillterStatus');
const createTreeHelper = require('../../helpers/createTree');
const Category = require('../../models/category.model');
const Account = require('../../models/account.model');
// [GET] /admin/categories
module.exports.index = async (req, res) => {
  const fillterStatus = fillterStatusHelper(req.query);
  const objSearch = searchHelper(req.query);
  let find = {
    deleted: false
  };
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else sort.position = "desc";
  if (objSearch.keyword) {
    find.title = objSearch.regex;
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  const countDocuments = await Category.countDocuments(find);

  let objectPanigation = paginationHelper(
    {
      limit: 4,
      currentPage: 1
    }
    , req.query, countDocuments);
  const records = await Category
    .find(find)
    .sort(sort)
  const newRecords = createTreeHelper.Tree(records);
  res.render("admin/pages/categories/index", {
    pageTitle: "Trang Danh Mục Sản Phẩm",
    records: newRecords,
    fillterStatus: fillterStatus,
    keywords: objSearch.keyword,
    objectPanigation: objectPanigation,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  }
  );
};

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };


  const records = await Category.find(find);
  const newRecords = createTreeHelper.Tree(records);
  res.render("admin/pages/categories/create", {
    pageTitle: "Tạo Danh Mục Sản Phẩm",
    records: newRecords,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
  }}
  );
};
//[POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes('category_create')) {
    if (!req.body.title) {
      req.flash("error", `vui lòng nhập tiêu đề !`);
      res.redirect('back');
      return;
    }
    if (req.body.position == "") {
      const count = await Category.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
    const record = new Category(req.body);
    await record.save();
    req.flash("success", "Tạo mới thành công");
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
  else{
    return;
  }
}
//[PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ");
  const type = req.body.type;
  switch (type) {
    case "active":
      await Category.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `${ids.length} Danh mục sản phẩm cập nhật trạng thái thành công`);
      break;
    case "inactive":
      await Category.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `${ids.length}Danh mục   sản phẩm cập nhật trạng thái thành công`);
      break;
    case "delete-all-forever":
      await Category.deleteMany({ _id: { $in: ids } });
      req.flash("success", `${ids.length}Danh mục sản phẩm được xóa vĩnh viễn`);
      break;
    case "delete-all":
      await Category.updateMany({ _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date()
        });
      req.flash("success", `${ids.length} Danh mục sản phẩm xóa thành công`);
      break;
    case "restore":
      await Category.updateMany({ _id: { $in: ids } },
        {
          deleted: false,
          deletedAt: null
        }
      );
      req.flash("success", `${ids.length} Danh mục sản phẩm được khôi phục thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        console.log(id);
        console.log(position);
        await Category.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `${ids.length} Danh mục đổi vị trí thành công`);
    default:
      break;
  }
  res.redirect('back');
}
//[PATCH] /admin/categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await Category.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");
  const currentPage = req.query.page;

  res.redirect('back');
}
//[GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false
    };
    const records = await Category.find({
      deleted: false
    });
    const newRecords = createTreeHelper.Tree(records);
    const record = await Category.findOne(find);
    res.render("admin/pages/categories/edit", {
      pageTitle: "Chỉnh Sửa Danh Mục Sản Phẩm",
      record: record,
      records: newRecords,
      expressFlash:
      {
        success: req.flash('success'),
        error: req.flash('error')}
        
    }
    );
  }
  catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }

};
//[PATCH] /admin/categories/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
}
  await Category.updateOne({ _id: id }, req.body);
  res.redirect('back');
};
//[DELETE] /admin/categories/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Category.updateOne({ _id:id}, { 
    deleted: true,
    deletedBy:{
        account_id: res.locals.user.id,
        deletedAt: new Date()
    }});
  req.flash("success", "Xóa thành công");
  res.redirect('back');
};
//[GET] /admin/categories/trash
module.exports.trash = async (req, res) => {
  const fillterStatus = fillterStatusHelper(req.query);
  const objSearch = searchHelper(req.query);
  let find = {
    deleted: true
  };
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else sort.position = "desc";
  if (objSearch.keyword) {
    find.title = objSearch.regex;
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  const countDocuments = await Category.countDocuments(find);

  let objectPanigation = paginationHelper(
    {
      limit: 4,
      currentPage: 1
    }
    , req.query, countDocuments);
  const records = await Category
    .find(find)
    .sort(sort)
    for (const record of records) {
      const account = await Account.findOne({ _id: record.deletedBy.account_id });
      if(account){
          record.accountName = account.fullname;
      }
  }
  res.render("admin/pages/categories/trash", {
    pageTitle: "Thùng Rác Danh Mục Sản Phẩm",
    records: records,
    fillterStatus: fillterStatus,
    keywords: objSearch.keyword,
    objectPanigation: objectPanigation,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  }
  );
};
//[DELETE] /admin/categories/trash/delete/:id
module.exports.deleteTrash = async (req, res) => {
  const id = req.params.id;
  await Category.deleteOne({ _id: id });
  req.flash("success", "Xóa vĩnh viễn thành công");
  res.redirect('back');
};
// [PATCH] /admin/categories/trash/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Category.updateOne({ _id: id }, { deleted: false, deletedAt: null });
  req.flash("success", "Khôi phục thành công");
  res.redirect('back');}


