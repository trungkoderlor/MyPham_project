module.exports.createPost = async (req, res,next)=>{
    if(!req.body.title){
        req.flash("error", `vui lòng nhập tiêu đề !`);
        res.redirect('back');
        return;
    }
    if (!req.body.price) {
        req.flash("error", `vui lòng nhập giá sản phẩm !`);
        res.redirect('back');
        return;
    }
    next();
}