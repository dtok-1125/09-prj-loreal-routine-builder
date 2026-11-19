/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

const selectedProductsList = document.getElementById(
  "selectedProductsList"
);
// Product details modal elements
const productDetailsModal = document.getElementById("productDetailsModal");
const closeProductModal = document.getElementById("closeProductModal");
const modalProductName = document.getElementById("modalProductName");
const modalProductBrand = document.getElementById("modalProductBrand");
const modalProductDescription = document.getElementById("modalProductDescription");

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
/* Open the product details modal */
function showProductDetails(productId) {
  const product = allProducts.find(
    (item) => item.id === productId
  );

  if (!product) return;

  modalProductName.textContent = product.name;
  modalProductBrand.textContent = product.brand;
  modalProductDescription.textContent = product.description;

  productDetailsModal.showModal();
}
/* Close the product details modal */
closeProductModal.addEventListener("click", () => {
  productDetailsModal.close();
});

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

/* Listen for clicks on product cards */
productsContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");

  if (!card) return;

  const productId = Number(card.dataset.id);

  toggleProduct(productId);
  updateSelectedProducts();

  // Update the clicked card's appearance and accessibility state
  const isSelected = selectedProductIds.includes(productId);

  card.classList.toggle("selected", isSelected);
  card.setAttribute("aria-pressed", String(isSelected));
});

/* Display the user's selected beauty products */
function updateSelectedProducts() {
  selectedProductsList.innerHTML = "";

  if (selectedProductIds.length === 0) {
    selectedProductsList.textContent =
      "Your beauty collection starts here. Select a product to begin!";
    return;
  }

  selectedProductIds.forEach((id) => {
    const product = allProducts.find(
      (item) => item.id === id
    );

    if (!product) return;

    const item = document.createElement("div");
    item.className = "selected-item";

    const name = document.createElement("span");
    name.textContent = `${product.brand} — ${product.name}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-product";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
      "aria-label",
      `Remove ${product.name}`
    );

    removeButton.addEventListener("click", () => {
      toggleProduct(id);
      updateSelectedProducts();

      // Keep the product grid's selection state in sync
      const card = productsContainer.querySelector(
        `.product-card[data-id="${id}"]`
      );

      if (card) {
        card.classList.remove("selected");
        card.setAttribute("aria-pressed", "false");
      }
    });

    item.append(name, removeButton);
    selectedProductsList.appendChild(item);
  });
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
