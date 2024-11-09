//[GET]/conact
const Letter = require('../../models/letter.model');
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
    
    const letter = new Letter(req.body);
    try{
        await letter.save();
        req.flash('success', 'Gửi thành công');
        res.redirect('/');
    }
    catch(err){
        req.flash('error', 'Gửi thất bại');
        res.redirect('/contact');
    }
    
}