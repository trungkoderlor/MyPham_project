const Role = require("../../models/role.model");
const systemConfig = require('../../config/system');
//[GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm Quyền",
    records: records,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
};
//[GET] /admin/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
};
//[POST] /admin/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();
    req.flash('success', 'Tạo mới thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
  catch (err) {
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('back');
  }
};
//[GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id
    }
    const record = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record,
      expressFlash:
      {
        success: req.flash('success'),
        error: req.flash('error')

      }
    });
  }
  catch (err) {
    req.flash('error', 'Không tìm thấy nhóm quyền');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
//[PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
  catch (err) {
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('back');
  }
};
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }
  try {
    const records = await Role.find(find);
    res.render("admin/pages/roles/permission", {
      pageTitle: "Phân quyền",
      records: records,
      expressFlash:
      {
        success: req.flash('success'),
        error: req.flash('error')

      }
    });
  }
  catch (err) {
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('back');
  }

};
//[PACTH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const permission of permissions) {
      await Role.updateOne({ _id: permission.id }, { permissions: permission.permissions });
       
    }
    req.flash('success', 'Cập nhật thành công'); 
    res.redirect('back');
  } catch (err) {
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('back');
  }

};
