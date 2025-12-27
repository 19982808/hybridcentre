/* =====================================================
   GLOBAL STATE
===================================================== */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = [
  { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
  { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
  { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
  { name: "Engine Components", price: 350, icon: "fa-engine" },
  { name: "Cooling Systems", price: 200, icon: "fa-fan" },
  { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
  { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
  { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" },
];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= HERO SLIDER ================= */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    currentSlide = index;
  }

  setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  showSlide(0);

  /* ================= SPA NAVIGATION ================= */
  const sections = document.querySelectorAll("#home, #products, #cart, #payment, #location, #contact");

  function showSection(id) {
    sections.forEach(sec => sec.classList.add("hidden-section"));
    const target = document.querySelector(id);
    if (target) target.classList.remove("hidden-section");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      showSection(link.getAttribute("href"));
    };
  });

  showSection("#home");

  /* ================= RENDER PRODUCTS ================= */
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
      div.querySelector("button").onclick = () => {
        cartItems.push(p);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCart();
        alert(`${p.name} added to cart ✅`);
      };
      productList.appendChild(div);
    });
  }

  renderProducts();

  /* ================= CART ================= */
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    cartCount.textContent = cartItems.length;
    let total = 0;
    cartItems.forEach(item => {
      total += item.price;
      cartItemsContainer.innerHTML += `<div>${item.name} - KES ${item.price}</div>`;
    });
    if (cartItems.length > 0) {
      cartItemsContainer.innerHTML += `<strong>Total: KES ${total}</strong>`;
    }
  }

  updateCart();

  document.getElementById("checkoutBtn").onclick = () => {
    if (!cartItems.length) return alert("Cart is empty ❌");
    alert("Proceeding to payment...");
  };

  /* ================= REGISTER MODAL ================= */
  const registerBtn = document.getElementById("registerBtn");
  const registerModal = document.getElementById("registerModal");
  const closeRegister = document.getElementById("closeRegister");
  const registerSubmit = document.getElementById("register-submit");

  registerBtn.onclick = () => registerModal.classList.remove("hidden");
  closeRegister.onclick = () => registerModal.classList.add("hidden");

  registerSubmit.onclick = () => {
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) return alert("Please fill all fields!");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful ✅");
    registerModal.classList.add("hidden");

    document.getElementById("register-username").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
  };

  /* ================= LOGIN MODAL ================= */
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const loginSubmit = document.getElementById("login-submit");
  const closeLogin = loginModal.querySelector(".close");

  loginBtn.onclick = () => loginModal.classList.remove("hidden");
  closeLogin.onclick = () => loginModal.classList.add("hidden");

  loginSubmit.onclick = () => {
    const email = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return alert("Invalid login ❌");

    alert(`Welcome, ${user.username} ✅`);
    loginModal.classList.add("hidden");
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
  };

  /* ================= BOOK SERVICE BUTTON ================= */
  const bookServiceBtn = document.getElementById("bookServiceBtn");
  if (bookServiceBtn) bookServiceBtn.onclick = () => showSection("#contact");

});
