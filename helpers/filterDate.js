module.exports.filterByDate = (query, startDate, endDate) => {
  if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    if (!query.createdAt) {
      query.createdAt = {};
    } 
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    query.createdAt.$lte = endDateObj;
   
  }
  return query;
};