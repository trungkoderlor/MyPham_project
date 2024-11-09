module.exports.newPrice = (products)=>{
    return products.map(item =>{
        item.priceNew= (item.price*(100-item.discountPercentage)/100).toFixed(2);
        return item;
    });
}
module.exports.newPriceOne = (product)=>{
    
     const priceNew= (product.price*(100-product.discountPercentage)/100).toFixed(2);
    return parseInt(priceNew); 
}