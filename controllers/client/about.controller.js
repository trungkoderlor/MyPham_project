//[GET] /about

module.exports.index =async (req, res) => {
    res.render('client/pages/about/index', {
        pageTitle: "Giới thiệu",
        expressFlash:{
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}