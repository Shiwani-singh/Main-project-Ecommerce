import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price
  })
    .then((result) => {
      console.log("product added succesfully to db", result);
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log("error in adding product to db", err);
    });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        console.log("Product not found"); // Debug log
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true, // Indicates edit mode to the template
        product: product,
      });
    })
    .catch((err) => {
      console.log("Error editing the product in admin", err);
    });
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const {
    title: updatedTitle,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
    price: updatedPrice,
  } = req.body;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;
      return product.save();
    })
    .then((result) => {
      console.log("Product Updated");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error saving the updated data", err);
    });
};

export const getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("Error fetching admin products", err);
    });
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product => {
    return Product.destroy({ where: { id: prodId }});
  })
  .then(result => {
    console.log('Product deleted');
    res.redirect("/admin/products");
  })
  .catch((err) => console.log("error deleting the product", err));
};
