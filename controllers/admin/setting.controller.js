//[GET] /admin/settings/general
const SettingGeneral = require("../../models/settings-general.model");
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral,
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
}
//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    if (req.file) {
        req.body.logo = `/uploads/${req.file.filename}`;
    }
    if (settingGeneral)
    {
        await SettingGeneral.updateOne({}, req.body);
    }
    else
    {
        const settingGeneral = new SettingGeneral(req.body);
        await settingGeneral.save();
    }
    req.flash('success', 'Cập nhật thành công');
    res.redirect('/admin/settings/general');
}