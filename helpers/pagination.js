module.exports = (objectPanigation,query,countDocuments) =>{
    if (query.page) {
        objectPanigation.currentPage = parseInt(query.page);
    }
    objectPanigation.skip = (objectPanigation.currentPage - 1) * objectPanigation.limit;
    
    objectPanigation.total = Math.ceil(countDocuments / objectPanigation.limit);
    return objectPanigation;
}