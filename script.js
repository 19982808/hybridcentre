/* ================= GLOBAL STATE ================= */
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

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= SPA NAVIGATION ================= */
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

  /* ================= PRODUCT LIST ================= */
  const productList = document.getElementById("product-list");

  function renderProducts() {
    if (!productList) return;
    productList.innerHTML = "";
    products.forEach((p, idx) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <i class="fa-solid ${p.icon} product-icon"></i>
        <h3>${p.name}</h3>
        <p>Price: KES ${p.price}</p>
        <button class="add-to-cart-btn" data-id="${idx}">Add to Cart</button>
      `;
      productList.appendChild(div);
    });

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        cartItems.push(products[id]);
        saveCart();
        alert(`${products[id].name} added to cart ✅`);
      });
    });
  }

  /* ================= CART ================= */
  const cartItemsDiv = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  }

  function updateCart() {
    if (!cartItemsDiv || !cartCount) return;
    cartItemsDiv.innerHTML = "";
    cartCount.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach(item => {
      total += Number(item.price);
      const div = document.createElement("div");
      div.textContent = `${item.name} - KES ${item.price}`;
      cartItemsDiv.appendChild(div);
    });

    if (cartItems.length) {
      const totalDiv = document.createElement("strong");
      totalDiv.textContent = `Total: KES ${total}`;
      cartItemsDiv.appendChild(totalDiv);
    }
  }

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (!cartItems.length) return alert("Cart is empty ❌");
    const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
    const phone = prompt("Enter your WhatsApp number (2547XXXXXXXX):");
    if (!phone) return;

    let message = `🛒 *Hybrid Service Centre Order*\n\n`;
    cartItems.forEach(item => message += `• ${item.name} - KES ${item.price}\n`);
    message += `\n*Total:* KES ${total}\nThank you for shopping with us!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    alert("Payment received ✅\nOrder sent via WhatsApp");
    cartItems = [];
    saveCart();
  });

  renderProducts();
  updateCart();

  /* ================= BOOK SERVICE ================= */
  const bookServiceBtn = document.getElementById("bookServiceBtn");
  if (bookServiceBtn) {
    bookServiceBtn.addEventListener("click", () => {
      showSection("#contact");
      document.getElementById("contact-name").focus();
    });
  }

  /* ================= ADMIN PANEL ================= */
  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const adminLoginModal = document.getElementById("adminLoginModal");
  const closeAdminLogin = document.getElementById("closeAdminLogin");
  const adminLoginSubmit = document.getElementById("adminLoginSubmit");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => adminLoginModal.classList.remove("hidden"));
  }

  if (closeAdminLogin) {
    closeAdminLogin.addEventListener("click", () => adminLoginModal.classList.add("hidden"));
  }

  if (adminLoginSubmit) {
    adminLoginSubmit.addEventListener("click", () => {
      const user = document.getElementById("adminUsername").value;
      const pass = document.getElementById("adminPassword").value;
      if (user === "admin" && pass === "1234") {
        adminLoginModal.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        renderProducts();
        alert("Admin logged in ✅");
      } else alert("Invalid credentials ❌");
    });
  }

});
