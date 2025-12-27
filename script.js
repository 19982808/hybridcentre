document.addEventListener("DOMContentLoaded", () => {

  // ================= HERO SLIDER =================
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    currentSlide = index;
  }

  setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  showSlide(0);

  // ================= SPA NAVIGATION =================
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

  // ================= PRODUCTS =================
  const products = [
    { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
    { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
    { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
    { name: "Engine Components", price: 350, icon: "fa-engine" },
    { name: "Cooling Systems", price: 200, icon: "fa-fan" },
    { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
    { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
    { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" }
  ];

  const productList = document.getElementById("product-list");
  const cartItems = [];

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
        updateCart();
        alert("Added to cart ✅");
      };
      productList.appendChild(div);
    });
  }
  renderProducts();

  // ================= CART =================
  const cartDiv = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  function updateCart() {
    cartDiv.innerHTML = "";
    cartCount.textContent = cartItems.length;
    let total = 0;
    cartItems.forEach(item => {
      total += item.price;
      cartDiv.innerHTML += `<div>${item.name} - KES ${item.price}</div>`;
    });
    if (cartItems.length) cartDiv.innerHTML += `<strong>Total: KES ${total}</strong>`;
  }

  document.getElementById("checkoutBtn").onclick = () => {
    if (!cartItems.length) return alert("Cart is empty ❌");
    alert("Checkout simulated. You can add payment logic here.");
  };

  // ================= MODALS =================
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  const closeLogin = loginModal.querySelector(".close");
  const closeRegister = registerModal.querySelector(".close");

  loginBtn.onclick = () => loginModal.classList.remove("hidden");
  closeLogin.onclick = () => loginModal.classList.add("hidden");

  registerBtn.onclick = () => registerModal.classList.remove("hidden");
  closeRegister.onclick = () => registerModal.classList.add("hidden");

  // ================= LOGIN / REGISTER =================
  document.getElementById("register-submit").onclick = () => {
    const username = document.getElementById("register-username").value;
    if (!username) return alert("Please enter username");
    alert(`Registration successful! Welcome, ${username} ✅`);
    registerModal.classList.add("hidden"); // <-- Close modal after registration
  };

  document.getElementById("login-submit").onclick = () => {
    const username = document.getElementById("login-username").value;
    if (!username) return alert("Enter email");
    alert(`Login successful! Welcome back, ${username} ✅`);
    loginModal.classList.add("hidden"); // <-- Close modal after login
  };

  // ================= BOOK SERVICE =================
  document.getElementById("bookServiceBtn").onclick = () => showSection("#contact");

});
