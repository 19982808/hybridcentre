/* ================= GLOBAL STATE ================= */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
  { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
  { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
  { name: "Engine Components", price: 350, icon: "fa-engine" },
  { name: "Cooling Systems", price: 200, icon: "fa-fan" },
  { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
  { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
  { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" }
];

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== SPA NAVIGATION ===== */
  const sections = document.querySelectorAll("section");
  function showSection(id) {
    sections.forEach(sec => sec.classList.add("hidden-section"));
    const target = document.querySelector(id);
    if (target) target.classList.remove("hidden-section");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showSection(link.getAttribute("href"));
    });
  });

  showSection("#home");

  /* ===== HERO SLIDER ===== */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    currentSlide = index;
  }
  setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  showSlide(0);

  /* ===== PRODUCTS ===== */
  const productList = document.getElementById("product-list");
  function renderProducts() {
    if (!productList) return;
    productList.innerHTML = "";
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <i class="fa-solid ${p.icon} product-icon"></i>
        <h3>${p.name}</h3>
        <p>Price: KES ${p.price}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;
      div.querySelector("button").addEventListener("click", () => {
        cartItems.push(p);
        saveCart();
        alert(`${p.name} added to cart ✅`);
      });
      productList.appendChild(div);
    });
  }

  /* ===== CART ===== */
  const cartItemsDiv = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  }

  function updateCart() {
    cartItemsDiv.innerHTML = "";
    cartCount.textContent = cartItems.length;
    let total = 0;
    cartItems.forEach(item => {
      total += Number(item.price);
      cartItemsDiv.innerHTML += `<div>${item.name} - KES ${item.price}</div>`;
    });
    if (cartItems.length) cartItemsDiv.innerHTML += `<strong>Total: KES ${total}</strong>`;
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cartItems.length) return alert("Cart is empty ❌");
    const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
    alert(`Total amount: KES ${total}.\nPayment via WhatsApp.`);
    cartItems = [];
    saveCart();
  });

  renderProducts();
  updateCart();

  /* ===== BOOK SERVICE ===== */
  const bookServiceBtn = document.getElementById("bookServiceBtn");
  if (bookServiceBtn) bookServiceBtn.addEventListener("click", () => showSection("#contact"));

  /* ===== ADMIN DASHBOARD ===== */
  const adminBtn = document.createElement("button");
  adminBtn.textContent = "Admin Panel";
  adminBtn.classList.add("admin-btn");
  document.querySelector(".site-header nav").appendChild(adminBtn);

  const adminModal = document.createElement("div");
  adminModal.classList.add("modal", "hidden");
  adminModal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeAdmin">&times;</span>
      <h2>Admin Dashboard</h2>
      <form id="add-product-form">
        <input type="text" id="p_name" placeholder="Product Name" required>
        <input type="number" id="p_price" placeholder="Price" required>
        <input type="text" id="p_icon" placeholder="FontAwesome Icon Class" required>
        <button type="submit">Add Product</button>
      </form>
      <h3>All Products</h3>
      <ul id="admin-product-list"></ul>
      <h3>Cart Items</h3>
      <ul id="admin-cart-list"></ul>
    </div>
  `;
  document.body.appendChild(adminModal);

  adminBtn.addEventListener("click", () => adminModal.classList.remove("hidden"));
  document.getElementById("closeAdmin").addEventListener("click", () => adminModal.classList.add("hidden"));

  /* ===== ADMIN FORM HANDLER ===== */
  document.getElementById("add-product-form").addEventListener("submit", e => {
    e.preventDefault();
    const newProduct = {
      name: document.getElementById("p_name").value,
      price: document.getElementById("p_price").value,
      icon: document.getElementById("p_icon").value
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
    alert("Product added ✅");
  });

  function renderAdminProducts() {
    const list = document.getElementById("admin-product-list");
    list.innerHTML = "";
    products.forEach(p => list.innerHTML += `<li>${p.name} - KES ${p.price}</li>`);
  }

  function renderAdminCart() {
    const list = document.getElementById("admin-cart-list");
    list.innerHTML = "";
    cartItems.forEach(i => list.innerHTML += `<li>${i.name} - KES ${i.price}</li>`);
  }

  renderAdminProducts();
  renderAdminCart();
});
