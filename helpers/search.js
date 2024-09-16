module.exports =(query) => {
    let objSearch ={
        keyword: ""
    }
    if (query.keyword) {
        objSearch.keyword = query.keyword;
        objSearch.regex = { $regex: new RegExp(query.keyword, "i") };
    }
    return objSearch;
}