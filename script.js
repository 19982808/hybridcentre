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

  /* ===== SPA NAVIGATION ===== */
  const sections = document.querySelectorAll("section");
  function showSection(id) {
    sections.forEach(sec => sec.classList.remove("active-section"));
    const target = document.querySelector(id);
    if (target) target.classList.add("active-section");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showSection(link.getAttribute("href"));
    });
  });

  showSection("#home");

  /* ===== PRODUCT RENDERING ===== */
  const productList = document.getElementById("product-list");
  function renderProducts() {
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
    alert(`Payment received ✅\nTotal: KES ${total}\nThank you for shopping at Hybrid Centre!`);
    cartItems = [];
    saveCart();
  });

  renderProducts();
  updateCart();

  /* ===== BOOK SERVICE ===== */
  const bookServiceBtn = document.getElementById("bookServiceBtn");
  bookServiceBtn.addEventListener("click", () => showSection("#contact"));

  /* ===== ADMIN DASHBOARD ===== */
  const adminBtn = document.createElement("button");
  adminBtn.textContent = "Admin Panel";
  adminBtn.style.marginLeft = "10px";
  document.querySelector("nav").appendChild(adminBtn);

  const adminModal = document.createElement("div");
  adminModal.className = "modal hidden";
  adminModal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeAdmin">&times;</span>
      <h2>Admin Dashboard</h2>
      <form id="admin-form">
        <input type="text" id="admin-product-name" placeholder="Product Name" required>
        <input type="number" id="admin-product-price" placeholder="Price" required>
        <input type="text" id="admin-product-icon" placeholder="FontAwesome Icon e.g fa-bolt" required>
        <button type="submit">Add Product</button>
      </form>
      <h3>Existing Products</h3>
      <ul id="admin-product-list"></ul>
    </div>
  `;
  document.body.appendChild(adminModal);

  const closeAdmin = document.getElementById("closeAdmin");
  adminBtn.addEventListener("click", () => adminModal.classList.remove("hidden"));
  closeAdmin.addEventListener("click", () => adminModal.classList.add("hidden"));

  const adminForm = document.getElementById("admin-form");
  const adminProductList = document.getElementById("admin-product-list");

  function renderAdminProducts() {
    adminProductList.innerHTML = "";
    products.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} - KES ${p.price} - ${p.icon}`;
      adminProductList.appendChild(li);
    });
  }

  adminForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("admin-product-name").value;
    const price = document.getElementById("admin-product-price").value;
    const icon = document.getElementById("admin-product-icon").value;
    products.push({ name, price, icon });
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
    adminForm.reset();
    alert("Product added ✅");
  });

  renderAdminProducts();

  /* ===== CONTACT LINKS ===== */
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const phone = "+2547XXXXXXXX"; // Replace with actual number
    const message = `Hi, I want to book a service. Name: ${document.getElementById("contact-name").value}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    contactStatus.textContent = "WhatsApp message opened ✅";
    contactForm.reset();
  });

});
