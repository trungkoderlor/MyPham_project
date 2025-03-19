const mongoose = require('mongoose');

const settingGeneralchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    s_desc: String,
    desc: String,
    phone: String,
    email: String,
    address: String,
    facebook: String,
    twitter: String,
    instagram: String,
    coppyright: String
    

},{
    timestamps: true
});
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralchema, 'settings-general');
module.exports = SettingGeneral;