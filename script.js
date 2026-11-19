/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

const selectedProductsList = document.getElementById(
  "selectedProductsList"
);

// Store our product catalog and selected IDs
let allProducts = [];
let selectedProductIds = [];

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  const data = await response.json();

  allProducts = data.products;
  return allProducts;
}

/* Create HTML for displaying interactive product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map((product) => {
      const isSelected = selectedProductIds.includes(product.id);

      return `
        <button
          type="button"
          class="product-card ${isSelected ? "selected" : ""}"
          data-id="${product.id}"
          aria-pressed="${isSelected}"
        >
          <img src="${product.image}" alt="">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.brand}</p>
          </div>
        </button>
      `;
    })
    .join("");
}
/* Add or remove a product from our selection */
function toggleProduct(productId) {
  if (selectedProductIds.includes(productId)) {
    selectedProductIds = selectedProductIds.filter(
      (id) => id !== productId
    );
  } else {
    selectedProductIds.push(productId);
  }
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;

  const filteredProducts = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});
 

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

loadProducts().catch((error) => {
  console.error("Product loading failed:", error);

  productsContainer.textContent =
    "Sorry, we couldn't load the products. Please refresh.";
});
