// import { path } from "express/lib/application.js";
import path from "path";
import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

export const getProducts = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("Error in fetching data", err);
    });
};

export const getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findAll({ where: { id: productId } })
    .then((products) => {
      // console.log(product);
      res.render("shop/product-details", {
        product: products[0], ////product on the right side of colon is the product we are retrieving & left side is the key by which  we will be able to access it in view.
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("Error fetching the product by Id", err);
    });

  // Product.findByPk(productId) //we can do this where query also like above
  //   .then(product => {
  //     // console.log(product);
  //     res.render("shop/product-details", {
  //       product: product, ////product on the right side of colon is the product we are retrieving & left side is the key by which  we will be able to access it in view.
  //       pageTitle: product.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log("Error getting data by Id", err));
};

export const getIndex = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("Error in fetching data", err);
    });
};

export const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log("err getting products from cart", err));
    })
    .catch((err) => console.log("error getting the cart", err));

  // Cart.getCart((cart) => {
  //   //This fetches the cart data and passes it to the callback function as cart.
  //   console.log("Cart data fetched:", cart); // Log the cart data
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (let product of products) {
  //       //The loop matches products in the cart (cartProductData) and adds them to the cartProducts array.
  //       const cartProductData = cart.products.find((p) => p.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({
  //           productData: product,
  //           quantity: cartProductData.qty,
  //         });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

//add new products to the cart
export const postCart = (req, res, next) => {
  const prodId = req.body.productId; // productId is the name of the input field in the form
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart() //fetches the cart associated with the logged-in user.
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } }); //looks for a product in the cart matching prodId.
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("err adding product in cart", err));

  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // console.log("prodId", prodId);
  // res.redirect("/cart");
};

export const postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("error deleting cart item", err));
};

export const getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}).then(
    orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders   //stores all retrived orders
      });
    }
  ).catch(err => {
    'error fetching orders', err
  })
};

export const postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart(). //retrieves the user's cart from the database.
    then((cart) => {
      fetchedCart = cart
      return cart.getProducts();  // retrieves all the products currently in the cart.
    })
      .then(products => {
        req.user
          .createOrder()  //this creates a new order associated with the user.
          .then(order => {
            return order.addProducts(  //Once the order is created, the products are added to it.
              products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            )
          })
          .catch((err) => console.log("err fetching order", err));
      })
      .then(result => {
        return fetchedCart.setProducts(null);
      })
      .then(result => {
        res.redirect('/orders');
      })
      .catch((err) => console.log("error in post order func:", err));
};



