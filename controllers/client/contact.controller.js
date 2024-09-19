//[GET]/conact
module.exports.index = (req, res) => {
    res.render('client/pages/contact/index', {
        pageTitle: "Liên hệ"
    });
}