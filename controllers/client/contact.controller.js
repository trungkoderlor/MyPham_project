

//[GET]/conact
const Letter = require('../../models/letter.model');
const Notification = require('../../models/notification.model');
const User = require('../../models/user.model');
module.exports.index = async (req, res) => {

    res.render('client/pages/contact/index', {
        pageTitle: "Liên hệ",
        expressFlash:{
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}
//[POST]/contact
module.exports.PostLetter = async (req, res) => {
    if (req.body.email == null || req.body.email == '' ||  req.body.message == ''||  req.body.message == null) { 
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin');
        res.redirect('/contact');
    }
    const letter = new Letter(req.body);
   const user = await User.findOne({tokenUser: req.cookies.tokenUser});
   if (user) {
       req.body.userId = user._id;}
    else req.body.userId = null;

    const notification = new Notification({
        userId: req.body.userId, 
        content: `Khách hàng ${req.body.email} đã gửi tin nhắn liên hệ mới`,
        type: 'letters',
        title: 'Liên hệ mới',
        relatedId: letter._id,
        detailLink: `/admin/letters/detail/${letter._id}`
    });
    await notification.save();
    try{
        await letter.save();
        req.flash('success', 'Gửi thành công');
        _io.emit('NEW_NOTIFICATION', notification);
        res.redirect('/');
    }
    catch(err){
        req.flash('error', 'Gửi thất bại');
        res.redirect('/contact');
    }
    
}