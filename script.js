/* =====================================================
   GLOBAL STATE
===================================================== */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = [
  { name: "Hybrid Batteries", price: 500, icon: "fa-battery-full" },
  { name: "Electric Motors", price: 750, icon: "fa-gears" },
  { name: "Inverters", price: 400, icon: "fa-bolt" },
  { name: "Engine Components", price: 350, icon: "fa-engine" },
  { name: "Cooling Systems", price: 200, icon: "fa-fan" },
  { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
  { name: "Gearbox", price: 600, icon: "fa-gears" },
  { name: "Auxiliary Parts", price: 150, icon: "fa-triangle-exclamation" }
];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= HERO SLIDER ================= */
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currentSlide = 0;

  slides.forEach((slide, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  showSlide(0);

  /* ================= SPA NAVIGATION ================= */
  const sections = document.querySelectorAll("#home, #products, #cart, #location, #contact");
  function showSection(id) {
    sections.forEach(sec => sec.classList.add("hidden-section"));
    document.querySelector(id).classList.remove("hidden-section");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showSection(link.getAttribute("href"));
    });
  });
  showSection("#home");

  /* ================= PRODUCTS ================= */
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
        toast("Added to cart ✅");
      });
      productList.appendChild(div);
    });
  }

  renderProducts();

  /* ================= CART ================= */
  const cartCount = document.getElementById("cart-count");
  const cartItemsDiv = document.getElementById("cart-items");

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

    if (cartItems.length) {
      cartItemsDiv.innerHTML += `<strong>Total: KES ${total}</strong>`;
    }
  }

  updateCart();

  /* ================= CHECKOUT & M-PESA SIM ================= */
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cartItems.length) return alert("Cart is empty ❌");

    const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);
    const phone = prompt("Enter your WhatsApp number (2547XXXXXXXX):");
    if (!phone) return;

    const mpesaCode = "MP" + Math.floor(Math.random() * 1000000);
    const order = {
      id: Date.now(),
      items: cartItems,
      mpesaCode,
      amount: totalAmount,
      status: "Paid",
      date: new Date().toLocaleString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Send order via WhatsApp
    let message = `🛒 *Order #${order.id}*\n\n`;
    order.items.forEach(item => message += `• ${item.name} - KES ${item.price}\n`);
    message += `\n*Total:* KES ${order.amount}\nM-Pesa Ref: ${order.mpesaCode}\nThank you for your order!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    cartItems = [];
    saveCart();
    toast("Payment successful & WhatsApp sent! ✅");
  });

  /* ================= LOGIN MODAL ================= */
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const closeLogin = document.getElementById("closeLogin");

  loginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
  closeLogin.addEventListener("click", () => loginModal.classList.add("hidden"));
  document.getElementById("login-submit").addEventListener("click", () => {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    loginModal.classList.add("hidden");
    toast("Logged in successfully ✅");
  });

  /* ================= REGISTER MODAL ================= */
  const registerModal = document.getElementById("registerModal");
  const registerBtn = document.getElementById("registerBtn");
  const closeRegister = document.getElementById("closeRegister");

  registerBtn.addEventListener("click", () => registerModal.classList.remove("hidden"));
  closeRegister.addEventListener("click", () => registerModal.classList.add("hidden"));
  document.getElementById("register-submit").addEventListener("click", () => {
    registerModal.classList.add("hidden");
    toast("Registered successfully ✅");
  });

  /* ================= BOOK SERVICE ================= */
  const bookBtn = document.getElementById("bookServiceBtn");
  bookBtn?.addEventListener("click", () => showSection("#contact"));

  /* ================= TOAST ================= */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

});
