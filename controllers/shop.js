// import { path } from "express/lib/application.js";
import path from "path";
// import { Product } from "../models/product.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
// import { Cart } from "../models/cart.js";

export const getTest = ((req, res) => {
  console.log("Session in getTest:", req.session);
  res.json(req.session);  // Return session data as JSON
});

export const getProducts = (req, res, next) => {
  // Product.fetchAll() mongo method
  Product.find()
    .then((products) => {
      // console.log("products fetched successfully", products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("Error in fetching data", err);
    });
};
// get a single product
export const getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId) // findById is a mongoose method
    // Product.fetchById(productId) // ({ where: { id: productId } }) it is for sequelize
    .then((product) => {
     
      // console.log(product);
      res.render("shop/product-details", {
        product: product, //product on the right side of colon is the product we are retrieving & left side is the key by which  we will be able to access it in view.
        pageTitle: product.title,
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
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch((err) => {
      console.log("Error in fetching data", err);
    });
};

// export const getCart = (req, res, next) => {
//   if (!req.user || !req.user.cart) {
//     return res.render("shop/cart", {
//       path: "/cart",
//       pageTitle: "Your Cart",
//       products: [], // Empty cart if user has no cart
//     });
//   }

//   const cartItems = req.user.cart.items || []; // Get cart items

//   res.render("shop/cart", {
//     path: "/cart",
//     pageTitle: "Your Cart",
//     products: cartItems, // Pass items to template
//   });
// };

export const getCart = (req, res, next) => {
  // console.log(req.user, "user in getCart");
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items, "cart items");
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        
      });
    })
    .catch((err) => console.log("error getting the cart", err));
};
/*sequelize method
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
    })
    .catch((err) => console.log("error getting the cart", err)); */

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
// };

//add new products to the cart
export const postCart = (req, res, next) => {
  console.log("from postCart", req.body);
  const prodId = req.body.productId; // productId is the name of the input field in the form
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product).then((result) => {
        // console.log("product added to cart", result);
        res.redirect("/cart");
      });
    })
    .catch((err) => console.log("error fetching product in cart", err));
};

/*sequelize method
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
  // res.redirect("/cart");*/
// };

export const postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("error deleting cart item", err));
};

export const getOrders = (req, res, next) => {
  Order.find({ "user.userId" : req.user._id}) //it gives all orders that belongs to that user
  .then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    }); //stores all retrived orders
  })
  .catch((err) => {
    console.log("error fetching orders", err);
  });
  // req.user //mongodb method
  //   .populate('order.items.productId')
  //   .then((orders) => {
  //     res.render("shop/orders", {
  //       path: "/orders",
  //       pageTitle: "Your Orders",
  //       orders: orders,
  //     }); //stores all retrived orders
  //   })
  //   .catch((err) => {
  //     console.log("error fetching orders", err);
  //   });
};

/*sequelize method
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders, //stores all retrived orders
      });
    })
    .catch((err) => {
      "error fetching orders", err;
    });
};*/

export const postOrder = (req, res, next) => {
  console.log("Received CSRF Token:", req.body._csrf);  // ✅ Check if token is received
  console.log("Session ID:", req.sessionID);  // ✅ Check if session exists

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items, "cart items from post order");
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user, //mongoose will pick the id from the user object
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {  //clear the cart after order is placed
      return req.user.clearCart();
    }).then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("error in post order func:", err));

  // req.user mongodb method
  //   .addOrder()
  //   .then((result) => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => console.log("error in post order func:", err));
};

/*let fetchedCart;
  req.user
    .getCart() //retrieves the user's cart from the database.
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts(); // retrieves all the products currently in the cart.
    })
    .then((products) => {
      req.user
        .createOrder() //this creates a new order associated with the user.
        .then((order) => {
          return order.addProducts(
            //Once the order is created, the products are added to it.
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log("err fetching order", err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("error in post order func:", err));
};*/
