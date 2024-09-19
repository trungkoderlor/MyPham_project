//[GET] /about
module.exports.index = (req, res) => {
    res.render('client/pages/about/index', {
        pageTitle: "Giới thiệu"
    });
}