//[GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        titlePage: "My Account",
        expressFlash:
        {
          success: req.flash('success'),
          error: req.flash('error')
    
        }
    });
};