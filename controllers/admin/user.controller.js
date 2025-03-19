const User = require('../../models/user.model');
const fillterStatusHelper = require('../../helpers/fillterStatus');
const systemConfig = require('../../config/system');
const md5 = require('md5');
const Account = require('../../models/account.model');
const Chat = require('../../models/chat.model');

//[GET] /admin/users
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const fillterStatus = fillterStatusHelper(req.query);
    const keyword = req.query.keyword || "";
    if (keyword) {
        find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const users = await User.find(find).select('-password -tokenUser');
    res.render('admin/pages/users/index', {
        records: users,
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')
        },
        keywords: req.query.keyword,
        fillterStatus: fillterStatus

    });

}
// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;
    await User.updateOne({ _id: id }, {
        status: status
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect('back');

}
// [DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await User.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date.now()
        }
    });
    req.flash("success", "Xóa thành công");
    res.redirect('back');
}
// [GET] /admin/users/trash
module.exports.trash = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query);
    const keyword = req.query.keyword || "";
    let find = {
        deleted: true
    }
    if (keyword) {
        find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const users = await User.find(find).select('-password -tokenUser');
    for (const user of users) {
        const account = await Account.findOne({ _id: user.deletedBy.account_id });
        if (account) {
            user.accountName = account.fullname;
        }
    }
    res.render('admin/pages/users/trash', {
        pageTitle: "Thùng rác người dùng",
        records: users,
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')
        },
        keywords: req.query.keyword,
        fillterStatus: fillterStatus

    });
}
// [PATCH] /admin/users/restore/:id
module.exports.restore = async (req, res) => {
    const id = req.params.id;
    await User.updateOne({ _id: id }, {
        deleted: false,
        deletedBy: {
            account_id: null,
            deletedAt: null
        }
    });
    req.flash("success", "Khôi phục thành công");
    res.redirect('back');
}
// [DELETE] /admin/users/trash/delete/:id
module.exports.trashDelete = async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    req.flash("success", "Xóa vĩnh viễn thành công");
    res.redirect('back');
}
//[GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id }).select('-password -tokenUser');
        res.render('admin/pages/users/detail', {
            a_user: user,
            expressFlash:
            {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
    catch (error) {
        req.flash('error', 'Không tìm thấy người dùng');
        res.redirect('/admin/users');
    }

}
//[GET] /admin/users/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/users/create', {
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}
//[POST] /admin/users/create
module.exports.createPost = async (req, res) => {
    try {
        const existEmail = await User.findOne({email: req.body.email});
        if(existEmail){
            req.flash('error', 'Email đã tồn tại');
            res.redirect('back');
            return;
            }
        req.body.password = md5(req.body.password);
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }
        const user = new User(req.body);
        await user.save();
        req.flash('success', 'Tạo mới thành công');
        res.redirect('/admin/users');
    }
    catch (error) {
        req.flash('error', 'Có lỗi xảy ra');
        res.redirect('back');
    }
    
}
//[GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id }).select('-password -tokenUser');
        res.render('admin/pages/users/edit', {
            a_user: user,
            expressFlash:
            {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
    catch (error) {
        req.flash('error', 'Không tìm thấy người dùng');
        res.redirect('/admin/users');
    }
}
//[PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        const existEmail = await User.findOne({ email: req.body.email });
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }
        if (existEmail && existEmail.email != user.email) {
            req.flash('error', 'Email đã tồn tại');
            res.redirect('back');
            return;
        }
        await User.updateOne({ _id: id }, req.body );
        req.flash('success', 'Cập nhật thành công');
        res.redirect('/admin/users');
    }
    catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect('back');
    }   
}
