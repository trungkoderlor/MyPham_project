const Category = require('../models/category.model');
module.exports.getSubCategory = async (parentId) =>{
  const getCategory = async (parentId) => {
    const subs = await Category.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
  
    let allSub = [...subs];
  
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs);
    }
  
    return allSub;
  };
  const result = await getCategory(parentId);
  return result;
}
//tìm hết tất cả các danh mục con và cháu của danh mục cha dùng đệ quy
module.exports.getCategory = async (CategoryId) => {
  const getCategory = async (CategoryId) => {
    const subs = await Category.find({
      parent_id: CategoryId,
      status: "active",
      deleted: false,
    });
    const subIds = subs.map((sub) => sub.id);
  
    let allSubId = [...subIds];
  
    for (const subId of subIds) {
      const childs = await getCategory(subId);
      allSubId = allSubId.concat(childs);
    }
    return allSubId;
  };
  const result = await getCategory(CategoryId);
  return result;
}