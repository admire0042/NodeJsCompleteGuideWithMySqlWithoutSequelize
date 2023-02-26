const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{pageTitle : 'Add Product', 
    path: 'adminPathActive',
    editing:false,
})}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title, imageUrl, description, price);
    product.save()
           .then(() =>{
            res.redirect('/');
           })
           .catch(err => console.log(err));
    
}

exports.getEditProduct = (req, res, next) => {
    const editmode = req.query.edit;
    if(!editmode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product',{pageTitle : 'Edit Product', 
        path: 'adminPathActive',
        editing:editmode,
        product: product
        })
    });
 }

 exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const updatedProduct = new Product(productId,title,imageUrl,description,price);
    updatedProduct.save();
    res.redirect('/admin/products')
 }

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', 
            {prods : products, 
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    });
}

exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}