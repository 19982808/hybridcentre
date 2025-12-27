/* ================= GLOBAL STATE ================= */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = [
  { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
  { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
  { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
  { name: "Engine Components", price: 350, icon: "fa-engine" },
  { name: "Cooling Systems", price: 200, icon: "fa-fan" },
  { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
  { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
  { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" }
];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

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
  const sections = document.querySelectorAll("#home, #products, #cart, #payment, #location, #contact");
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

  /* ===== PRODUCTS ===== */
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
    alert(`Total amount: KES ${total}. Payment will be handled via M-Pesa / WhatsApp.`);
    cartItems = [];
    saveCart();
  });

  renderProducts();
  updateCart();

  /* ===== MODALS ===== */
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const closeLogin = document.getElementById("closeLogin");
  const closeRegister = document.getElementById("closeRegister");

  loginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
  registerBtn.addEventListener("click", () => registerModal.classList.remove("hidden"));
  closeLogin.addEventListener("click", () => loginModal.classList.add("hidden"));
  closeRegister.addEventListener("click", () => registerModal.classList.add("hidden"));

  /* ===== LOGIN ===== */
  document.getElementById("login-submit").addEventListener("click", () => {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    loginModal.classList.add("hidden");
    alert("Logged in successfully ✅");
  });

  /* ===== REGISTER ===== */
  document.getElementById("register-submit").addEventListener("click", () => {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!username || !email || !password) {
      alert("Please fill all fields ❌");
      return;
    }

    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    registerModal.classList.add("hidden");
    alert(`Registration confirmed ✅\nWelcome, ${username}`);
  });

  /* ===== BOOK SERVICE ===== */
  const bookServiceBtn = document.getElementById("bookServiceBtn");
  bookServiceBtn.addEventListener("click", () => showSection("#contact"));

});
