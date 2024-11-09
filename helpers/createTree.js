let count =0;
const createTree =(arr, parent = "") => {
  const tree = [];
  arr.forEach(item => {

    if (item.parent_id === parent) {
      const newItem = item;
      newItem.index = count++;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }

  });
  return tree;
}

module.exports.Tree =(arr, parent = "") => {
    count = 1;
    const tree = createTree(arr, parent="");
    return tree;
  }
