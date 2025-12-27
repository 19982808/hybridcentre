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

  /* ================= PRODUCTS ================= */
  function renderProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <i class="fa-solid ${p.icon} product-icon"></i>
        <h3>${p.name}</h3>
        <p>Price: $${p.price}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;
      div.querySelector("button").onclick = () => {
        cartItems.push(p);
        saveCart();
        toast("Added to cart ✅");
      };
      list.appendChild(div);
    });
  }

  /* ================= CART ================= */
  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  }

  function updateCart() {
    const cart = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    cart.innerHTML = "";
    count.textContent = cartItems.length;
    let total = 0;
    cartItems.forEach(item => {
      total += Number(item.price);
      cart.innerHTML += `<div>${item.name} - $${item.price}</div>`;
    });
    if (cartItems.length) {
      cart.innerHTML += `<strong>Total: $${total}</strong>`;
    }
  }

  renderProducts();
  updateCart();

  /* ================= CHECKOUT ================= */
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }
    const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
    const phone = prompt("Enter your WhatsApp number (2547XXXXXXXX):");
    if (!phone) return;
    const mpesaCode = "MP" + Math.floor(Math.random() * 1000000);
    const order = { id: Date.now(), items: cartItems, mpesaCode, status: "Paid", amount: total, date: new Date().toLocaleString() };
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // WhatsApp message
    let message = `🛒 *Order #${order.id}*\n\n`;
    order.items.forEach(item => message += `• ${item.name} - $${item.price}\n`);
    message += `\n*Total:* $${order.amount}\nM-Pesa Ref: ${order.mpesaCode}\nThank you for your order!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    cartItems = [];
    saveCart();
    toast("Payment successful & WhatsApp order sent! ✅");
  });

  /* ================= MODALS ================= */
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  document.getElementById("loginBtn").onclick = () => loginModal.classList.remove("hidden");
  document.getElementById("registerBtn").onclick = () => registerModal.classList.remove("hidden");

  loginModal.querySelector(".close").onclick = () => loginModal.classList.add("hidden");
  registerModal.querySelector(".close").onclick = () => registerModal.classList.add("hidden");

  /* ================= LOGIN ================= */
  document.getElementById("login-submit").addEventListener("click", (e) => {
    e.preventDefault();
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    loginModal.classList.add("hidden");
    toast("Login successful ✅");
  });

  /* ================= REGISTER ================= */
  document.getElementById("register-submit").addEventListener("click", (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    if (!username || !email || !password) return alert("Fill all fields!");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    toast("Registration successful ✅");
    registerModal.classList.add("hidden");

    document.getElementById("register-username").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
  });

  /* ================= BOOK SERVICE ================= */
  const bookBtn = document.getElementById("bookServiceBtn");
  if (bookBtn) bookBtn.onclick = () => showSection("#contact");

  /* ================= TOAST ================= */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

});
