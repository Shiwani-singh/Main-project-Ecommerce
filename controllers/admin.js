import mongodb from "mongodb";
import { Product } from "../models/product.js";

const objectId = mongodb.ObjectId;

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
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      console.log("Product added successfully to DB", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("error in adding product to db", err);
    });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }

  // req.user.getProducts({where: {id: prodId}}) sequelize method
  // Product.findByPk(prodId)
  Product.fetchById(prodId)
    .then((product) => {
      if (!product) {
        console.log("Product not found"); // Debug log
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true, // Indicates edit mode to the template true,
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

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDescription,
    prodId
  );
  product
    .save()
    .then((result) => {
      console.log("Product Updated", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error saving the updated data", err);
    });
};

export const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("Error fetching admin products", err);
      /*sequelize method
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
    });*/
    });
  /*sequelize method
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
    });*/
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    // .then((product) => { sequlize method
    //   // return Product.destroy({ where: { id: prodId } });
    // })
    .then((result) => {
      console.log("Product deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("error deleting the product", err));
};
