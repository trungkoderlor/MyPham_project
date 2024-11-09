const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const categorySchema = new mongoose.Schema({
    title: String,
    description: String,
    parent_id: {
        type: String,
        default: ""
    },
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title",unique:true },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
},{
    timestamps: true
});
const Category = mongoose.model('Category', categorySchema, 'categories');
module.exports = Category;