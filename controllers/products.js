const products = [];

exports.getAddProduct = (req, res, next) =>{
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product', productCSS: true})
}

exports.postAddProduct = (req, res, next) =>{
    products.push({title: req.body.title});
    res.redirect('/')
}

exports.getProducts = (req, res, next) =>{
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/', hasProduct: products.length > 0});
}

