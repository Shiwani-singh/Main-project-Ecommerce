import mongodb from "mongodb";
import { ValidationError } from "sequelize";
import Product from "../models/product.js";
import { validationResult } from "express-validator";
import { mongo } from "mongoose";
import path from "path";
import csurf from "csurf";

// const objectId = mongodb.ObjectId;

export const getAddProduct = (req, res, next) => {
  let validationErrors = req.flash("validationErrors");
  if (validationErrors.length > 0) {
    try {
      validationErrors = JSON.parse(validationErrors[0]);
    } catch (e) {
      validationErrors = [];
    }
  } else {
    validationErrors = [];
  }

  let oldInput = req.flash("oldInput");
  if (oldInput.length > 0) {
    try {
      oldInput = JSON.parse(oldInput[0]);
    } catch (e) {
      oldInput = {
        title: "",
        imageUrl: "",
        price: "",
        description: "",
      };
    }
  } else {
    oldInput = {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    };
  }

  let message = req.flash("error");
  // console.log("Retrieved Flash Message:", message); // Debugging

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.locals.csrfToken = req.csrfToken();

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    csurfToken: req.csrfToken(),
    oldInput: oldInput,
    validationErrors: validationErrors,
    message: message,
  });
};

export const postAddProduct = (req, res, next) => {
  console.log("Request body", req.body); // Debugging
  console.log("Request file", req.file); // Debugging
  try{
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    console.log(image);
    if (!image) {
      console.log("⚠️ No image uploaded or invalid file type");
      req.flash("error", "No image uploaded or invalid file type");
      return res.status(422).render("/admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: true,
        oldInput: {
          title: title,
          description: description,
          price: price,
        },
        errorMessage: "Image file mus be png or jpg or jpeg",
        validationErrors: [],
      });
    }

    const errors = validationResult(req); //express validator method to check for errors in the request body

    if (!errors.isEmpty()) {
      console.log("Validation errors", errors.array());
      // If there are validation errors, flash them and redirect
      req.flash("validationErrors", JSON.stringify(errors.array()));
      req.flash("oldInput", JSON.stringify({ title, description, price }));
      return res.status(422).render("/admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: true,
        oldInput: {
          title: title,
          image: image,
          description: description,
          price: price,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    
    }

    const imageUrl = image.path.replace('images\\','' ); 

    const product = new Product({
      title: title, //part on the left side of the colon refers to the keys defined in product schema, while the part on the right side refers to the values you're passing in.
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user, //req.user is the user object that we get from the session and mongoose will automatically pick the id from it.
    });

    product
      .save()
      .then((result) => {
        // console.log("Product added successfully to DB", result);
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log("error in adding product to db", err);
        // res.redirect('/500');
    })
  } catch (err) {
    console.log("🔥 Runtime error in postAddProduct:", err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getEditProduct = (req, res, next) => {
  let validationErrors = req.flash("validationErrors");
  if (validationErrors.length > 0) {
    try {
      validationErrors = JSON.parse(validationErrors[0]);
    } catch (e) {
      validationErrors = [];
    }
  } else {
    validationErrors = [];
  }

  let message = req.flash("error");
  // console.log("Retrieved Flash Message:", message); // Debugging

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const editMode = req.query.edit;
  const prodId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }

  // req.user.getProducts({where: {id: prodId}}) sequelize method
  // Product.findByPk(prodId) //sequelize method
  // Product.fetchById(prodId) mongo method
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        // console.log("Product not found"); // Debug log
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true, // Indicates edit mode to the template true,
        product: product,
        validationErrors: validationErrors,
        message: message,
      });
    })
    .catch((err) => {
      console.log("Error editing the product in admin", err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postEditProduct = async(req, res, next) => {
  const errors = validationResult(req); //express validator method to check for errors in the request body

  const prodId = req.body.productId;
  const {
    title: updatedTitle,
    description: updatedDescription,
    price: updatedPrice,
  } = req.body;
  const image = req.file;

  // const product = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDescription,
  //   updatedImageUrl,
  //   prodId
  // );
  console.log("Request body", req.body); // Debugging
   if (!errors.isEmpty()) {
    // If there are validation errors, flash them and redirect
    req.flash("validationErrors", JSON.stringify(errors.array()));
    req.flash("oldInput", JSON.stringify({ title, description, price }));
    return res.redirect("/admin/add-product");
  }

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/products");
    }

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/admin/products");
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;

    // Only update imageUrl if new image is uploaded
    if (image) {
      product.imageUrl = image.path.replace("images\\", ''); 
    }
    await product.save();
    return res.redirect("/admin/products");
  } catch (err) {
    console.error("Error updating product:", err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
export const getProducts = (req, res, next) => {
  // Product.fetchAll() mongo method
  Product.find({ userId: req.user._id }) // adding userId to the query to fetch only the products created by the logged-in user (authorized user)
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("Error fetching admin products", err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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

export const deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.deleteById(prodId) mongodb method
  // .then((product) => { sequlize method
  //   // return Product.destroy({ where: { id: prodId } });
  // })
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      // console.log("Product deleted");
      // res.redirect("/admin/products");
      res.status(200).json({message: "Product deleted successfully"} );
    })
    .catch((err) => {
      // console.log("error deleting the product", err);
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      res.status(500).json({message: "Failed to delete product" });
    });
};
