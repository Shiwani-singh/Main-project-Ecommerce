const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name="productId"]').value;
  const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;

  const productElement = btn.closest("article");

  // fetch('/admin/product/' + prodId, {   //fetch() is for fetching and sending data to the server
  //     method: 'DELETE',
  //     headers: {
  //         'csrf-token': csrf
  //     }
  // }) .then(result => {
  //     return result.json(); // Convert the response to JSON
  // })
  // .then(data => {
  //     console.log(data)
  //     productElement.parentNode.removeChild(productElement); // Remove the product element from the DOM
  // })
  // .catch(err => {
  //     console.error('Error deleting product:', err);
  // })

  const deleteProductHandler = async (prodId, csrf, productElement) => {
        try {
            const response = await fetch("/admin/product/" + prodId, {
                method: "DELETE",
                headers: {
                "csrf-token": csrf,
                },
            });

            const data = await response.json(); // Convert the response to JSON
            console.log(data);
            productElement.parentNode.removeChild(productElement); // Remove the product element from the DOM
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };
    
    deleteProductHandler(prodId, csrf, productElement);

};
