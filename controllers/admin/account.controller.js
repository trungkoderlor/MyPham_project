// [GET] /admin/accounts
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const fillterStatusHelper = require("../../helpers/fillterStatus");
const systemConfig = require('../../config/system');
const md5 = require('md5');
const express = require("express");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const fillterStatus = fillterStatusHelper(req.query);
  const keyword = req.query.keyword || "";
  if (keyword) {
    find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id
    })

    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang Danh Sách Tài Khoản",
    records: records,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    },
    keywords: req.query.keyword,
    fillterStatus: fillterStatus

  })
}
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };
  const roles = await Role.find(find);
  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang Tạo Mới",
    roles: roles,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  })
}
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const eamilExist = await Account.findOne({ email: req.body.email, deleted: false });
  if (eamilExist) {
    req.flash("error", `Email đã tồn tại !`);
    res.redirect('back');
    return;
  }
  req.body.password = md5(req.body.password);
  if (req.file) {
    req.body.avatar = `/uploads/${req.file.filename}`;
  }
  else {
    req.body.avatar = `/images/default-avatar.jpg`;
  }
  const record = new Account(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}
// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

  const status = req.params.status;
  const id = req.params.id;
  await Account.updateOne({ _id: id }, {
    status: status
  });
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect('back');


}
// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne({ _id: id }, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  });
  req.flash("success", "Xóa thành công");
  res.redirect('back');
}
// [GET] /admin/accounts/trash
module.exports.trash = async (req, res) => {
  let find = {
    deleted: true
  };

  const fillterStatus = fillterStatusHelper(req.query);
  const keyword = req.query.keyword || "";
  if (keyword) {
    find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id
    })

    record.role = role;
    const account = await Account.findOne({
      _id: record.deletedBy.account_id
    })
    if (account) {
      record.accountName = account.fullname;
    }
  }
  res.render("admin/pages/accounts/trash", {
    pageTitle: "Trang Danh Sách Tài Khoản",
    records: records,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    },
    keywords: req.query.keyword,
    fillterStatus: fillterStatus

  })
}
//[DELETE] /admin/accounts/trash/delete/:id
module.exports.trashDelete = async (req, res) => {
  const id = req.params.id;
  await Account.deleteOne({ _id: id });
  req.flash("success", "Xóa vĩnh viễn thành công");
  res.redirect('back');
}
//[PATCH] /admin/accounts/trash/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne({ _id: id }, {
    deleted: false, deletedBy: {
      account_id: null,
      deletedAt: null
    }
  });
  req.flash("success", "Khôi phục thành công");
  res.redirect('back');
}
//[GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const record = await Account.findOne({ _id: id }).select("-password -token");
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id
    })
    record.role = role;
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Trang Chi Tiết Tài Khoản Quản Trị",
      account: record,
      expressFlash:
      {
        success: req.flash('success'),
        error: req.flash('error')

      }
    });
  }
  catch (error) {
    req.flash('error', 'Không tìm thấy tài khoản');
    res.redirect('/admin/accounts')
  }


}
//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const record = await Account.findOne({ _id: id });
  let find = {
    deleted: false
  };
  const roles = await Role.find(find);
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Trang Chỉnh Sửa Tài Khoản",
    account: record,
    roles: roles,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
}
//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Account.findOne({ _id: id });
    const eamilExist = await Account.findOne({ email: req.body.email, deleted: false });
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }
    if (eamilExist && eamilExist.email != record.email) {
      req.flash("error", `Email đã tồn tại !`);
      res.redirect('back');
      return;
    }
    else {
      await Account.updateOne({ _id: id }, req.body);
      req.flash('error', 'Cập nhật thành công');
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

  }
  catch (error) {
    req.flash('error', 'Cập nhật thất bại');
    res.redirect('back');
  }

}


