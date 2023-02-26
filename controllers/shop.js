const Product = require('../models/product');
const Cart = require('../models/cart')



exports.getProducts =  (req, res, next) => {
    Product.fetchAll().then((result) => {
        res.render('shop/product-list', 
        {prods : result[0], 
        pageTitle: 'All Products',
        path: '/products'
    })
    }).catch(err => console.log(err));
}



exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(([product]) => {
        console.log(product);
        res.render('shop/product-detail', {
            product:product[0], 
            pageTitle:product.title,
            path:'/products'
        });
    }).catch(err => console.log(err));
}

exports.getIndex =  (req, res, next) => {
    //using destructuring to get the nested array data from database i.e[rows, fieldData] in then, can just be [rows] since we dont need the second array
    Product.fetchAll().then(([rows]) => {
        res.render('shop/index', 
        {prods : rows, 
        pageTitle: 'Shop',
        path: '/',
    })  
    }).catch(err => console.log(err));
}

exports.getCarts = (req, res, next) => {
    Cart.getCarts(cart => {
        Product.fetchAll(prod => {
            const cartProducts = [];
            for(product of prod){
                //if the product from product object is also in the cart
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if(cartProductData){
                    cartProducts.push({productData : product, qty : cartProductData.qty});
                }
            }
            res.render("shop/cart", {
                path : '/cart',
                pageTitle : 'Your Cart',
                products: cartProducts
            })
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    //Now first I need to get the product from database inorder to get the ProductPrice from it
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProducct(prodId, product.price);
        res.redirect('/cart');
    })
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path : '/orders',
        pageTitle : 'Your Orders'
    })
}

exports.getCheckOut = (req, res, next) => {
    res.render("shop/checkout", {
        path : '/chekout',
        pageTitle : 'Chekout'
    })
}