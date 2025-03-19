const Letter = require('../../models/letter.model');
const sendMailHelper = require('../../helpers/sendMail');
const fillterStatusHelper = require('../../helpers/fillterStatus');
const Account = require('../../models/account.model');
// [GET]/admin/letters
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    let fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Chưa xử lý",
            status: "unprocessed",
            class: ""
        },
        {
            name: "Đang xử lý",
            status: "processing",
            class: ""
        },
        {
            name: "Đã xử lý",
            status: "processed",
            class: ""
        }
    ];
    if(req.query.status){
        const index = fillterStatus.findIndex(item => item.status == req.query.status);
        fillterStatus[index].class="active";
    } else {
        const index = fillterStatus.findIndex(item => item.status == "");
        fillterStatus[index].class="active";
    }
    const keyword = req.query.keyword || "";
    if (keyword) {
        find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    };
    if (req.query.status) {
        find.status = req.query.status;}
    const letters = await Letter.find(find);
    res.render('admin/pages/letters/index', {
        pageTitle: "Danh sách liên hệ",
        letters: letters,
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        } ,
        keywords: req.query.keyword,
        fillterStatus: fillterStatus
    });
}
// [GET]/admin/letters/detail/:id
module.exports.detail = async (req, res) => {
    
    const id = req.params.id;
    var letter = await Letter.findOne({_id: id});
    if (letter.status === "unprocessed") {
        await Letter.updateOne({_id: id}, { status: "processing"});
    };
    letter = await Letter.findOne({_id: id});
    res.render('admin/pages/letters/detail', {
        pageTitle: "Chi tiết liên hệ",
        letter: letter,
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        } 
    });
}
// [POST]/admin/letters/detail/:id
module.exports.reply = async (req, res) => {
    const id = req.params.id;
    const reply = req.body.reply;

    if (!reply) {
        req.flash('error', 'Vui lòng nhập nội dung trả lời');
        return res.redirect(`back`);
    }
    else {
        await Letter.updateOne({_id: id}, { reply: {content: reply, createdAt: Date.now()}, status: "processed"});
        const letter = await Letter.findOne({_id: id});
        const subject = "Cảm ơn quý khách đã liên hệ với chúng tôi!";
        const html = `<p>Kính gửi ${letter.fullname},</p> 
        <p>Chúng tôi rất vui khi nhận được thông tin liên hệ từ quý khách 
        và xin cảm ơn quý khách đã quan tâm đến các sản phẩm của Mỹ Phẩm DHT.</p>
        <p>${letter.reply.content}</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ Mỹ Phẩm DHT</p>
        `;
        sendMailHelper.sendMail(letter.email,subject,html)
        req.flash('success', 'Trả lời liên hệ thành công');
        return res.redirect(`back`);
    }
    
}
// [DELETE]/admin/letters/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Letter.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date.now()
        }
    });
    req.flash('success', 'Xóa liên hệ thành công');
    return res.redirect('back');
}
// [GET]/admin/letters/trash
module.exports.trash = async (req, res) => {
    let find = {
        deleted: true
    }
    const keyword = req.query.keyword || "";
    if (keyword) {
        find.email = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    };
    const letters = await Letter.find(find);
    for (const letter of letters) {
        const account = await Account.findOne({ _id: letter.deletedBy.account_id });
        if (account) {
            letter.accountName = account.fullname;
        }
    }
    res.render('admin/pages/letters/trash', {
        pageTitle: "Thùng rác liên hệ",
        letters: letters,
        expressFlash: {
            success: req.flash('success'),
            error: req.flash('error')
        } ,
        keywords: req.query.keyword
    });
}
// [PATCH]/admin/letters/trash/restore/:id
module.exports.restore = async (req, res) => {
    const id = req.params.id;
    await Letter.updateOne({_id: id},{deleted: false, deletedBy: {account_id: null, deletedAt: null}});
    req.flash('success', 'Khôi phục liên hệ thành công');
    return res.redirect('back');
};
// [DELETE]/admin/letters/trash/delete/:id
module.exports.trashDelete = async (req, res) => {
    const id = req.params.id;
    await Letter.deleteOne({_id: id});
    req.flash('success', 'Xóa liên hệ vĩnh viễn thành công');
    return res.redirect('back');
};

