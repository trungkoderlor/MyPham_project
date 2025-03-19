const Brand = require('../../models/brand.model');
const systemConfig = require('../../config/system');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const fillterStatusHelper = require('../../helpers/fillterStatus');
// [GET] /brands
module.exports.index = async (req, res) => {
  const fillterStatus = fillterStatusHelper(req.query);
    const objSearch = searchHelper(req.query);
    let find = {
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
    const countDocuments = await Brand.countDocuments(find);

    let objectPanigation = paginationHelper(
      {
        limit: 4,
        currentPage: 1
      }
      , req.query, countDocuments);
    const records = await Brand
      .find(find)
      .sort(sort)
    res.render('admin/pages/brand/index', {
        pageTitle: "Thương Hiệu",
        records: records,
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
// [GET] /brands/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/brand/create', {
        pageTitle: "Thêm Thương Hiệu",
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}

// [POST] /brands/create
module.exports.createPost = async (req, res) => {
  if (!req.body.title) {
    req.flash("error", `vui lòng nhập tiêu đề !`);
    res.redirect('back');
    return;
  }
  if (req.body.position == "") {
    const count = await Brand.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const brand = new Brand(req.body);
  await brand.save();
    req.flash('success', 'Thêm thương hiệu thành công');
    res.redirect(`${systemConfig.prefixAdmin}/brands`);
}
// [GET] /brands/edit/:id
module.exports.edit = async (req, res) => {
    const brand = await Brand.findOne({ _id: req.params.id });
    res.render('admin/pages/brand/edit', {
        pageTitle: "Chỉnh Sửa Thương Hiệu",
        brand: brand,
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}
// [PATCH] /brands/edit/:id
module.exports.editPatch = async (req, res) => {
    await Brand.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Cập nhật thương hiệu thành công');
    res.redirect(`${systemConfig.prefixAdmin}/brands`);
}
// [DELETE] /brands/delete/:id
module.exports.delete = async (req, res) => {
    await Brand.deleteOne({ _id: req.params.id });
    req.flash('success', 'Xóa thương hiệu thành công');
    res.redirect(`${systemConfig.prefixAdmin}/brands`);
}
// [GET] /brands/detail/:id
module.exports.detail = async (req, res) => {
    const brand = await Brand.findOne({ _id: req.params.id });
    res.render('admin/pages/brand/detail', {
        pageTitle: brand.title,
        brand: brand,
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        }
      });
}
//[PATCH] /admin/brands/change-multi 
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ");
  const type = req.body.type;
  switch (type) {
    case "active":
      await Brand.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `${ids.length} Thương hiệu cập nhật trạng thái thành công`);
      break;
    case "inactive":
      await Brand.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `${ids.length} Thương hiệu cập nhật trạng thái thành công`);
      break;
    case "delete-all":
      await Brand.deleteMany({ _id: { $in: ids } });
      req.flash("success", `${ids.length} Thương hiệu xóa thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Brand.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `${ids.length} Thương hiệu đổi vị trí thành công`);
      break;
    default:
      break;
  }
  res.redirect('back');
}
//[PATCH] /admin/brands/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await Brand.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect('back');
}