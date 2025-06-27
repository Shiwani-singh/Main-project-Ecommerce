export const errorFunction = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404", // No active link in the navigation for 404
    // isAuthenticated: req.session.isLoggedIn
    isAuthenticated: !!req.session?.isLoggedIn,
  });
};

export const errorFunction500 = (error, req, res, next) => {
  console.log("Error occurred: New console"); // Log the error for debugging
  console.error("Error occurred:", error); // Log the error for debugging
  return res.status(500).render("500", {
    pageTitle: "Error-500",
    path: "/500",
    //  isAuthenticated: req.session.isLoggedIn,
    isAuthenticated: !!req.session?.isLoggedIn,
    //  csrfToken: req.body._csrf,
  });
};
