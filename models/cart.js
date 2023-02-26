const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json'); 

module.exports = class Cart{

        static addProduct(id, productPrice){
            //Fetch the previous cart
            fs.readFile(p, (err, fileContent) => {
                //if there is error(err), means we have no cart yet
                let cart = {products: [], totalPrice: 0};
                if(!err){
                    cart = JSON.parse(fileContent);
                }

                //(Since we are sure of the existence of cart now so we Analyze the cart => Find existing product i.e we find if the product been passed already exist
                const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
                const existingProduct = cart.products[existingProductIndex];
 
                // Add new product/ increase quantity 
                let updatedProduct;
                if(existingProduct){
                    //if the product is existing, then we need to increase the quantity
                    updatedProduct = {...existingProduct}; //taking all the properties of the existing product using spread  operator
                    
                    updatedProduct.qty = updatedProduct.qty + 1;

                    cart.products = [...cart.products,]
                    cart.products[existingProductIndex] = updatedProduct;
                }else{
                    updatedProduct = {id: id, qty: 1}
                    cart.products = [...cart.products, updatedProduct]
                }

                //Now we inrese the value of the total price by the price of the product passed in  the second + before the productPrice is to change it from string to int
                cart.totalPrice = cart.totalPrice + +productPrice;

                //Now I add the cart back into the file   
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err);
                })
            }) 
        }

        static deleteProducct(id, productPrice){
            fs.readFile(p, (err, fileContent) => {
                if(err){
                    return;
                }
                const updatedCart = {...JSON.parse(fileContent)};
                const product = updatedCart.products.find(prod => prod.id === id);
                
                if(!product){
                    return;
                }

                const prodQty = product.qty;

                updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);

                updatedCart.totalPrice = updatedCart.totalPrice - productPrice * prodQty; 

                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    console.log(err);
                });
            })
        }
        
        static getCarts(cb) {
            fs.readFile(p, (err, fileContent) => {
                const cart = JSON.parse(fileContent);
                if(err){
                    cb(null);
                }else{
                    cb(cart);
                }
            });
        }
}