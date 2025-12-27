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
  { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
  { name: "Auxiliary Parts", price: 150, icon: "fa-triangle-exclamation" },
];

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= PRODUCT LIST ================= */
  const productList = document.getElementById("product-list");
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
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCart();
      alert(`${p.name} added to cart ✅`);
    });
    productList.appendChild(div);
  });

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

    if (cartItems.length) {
      cartItemsContainer.innerHTML += `<strong>Total: KES ${total}</strong>`;
    }
  }
  updateCart();

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cartItems.length) return alert("Your cart is empty ❌");
    alert("Checkout simulation! In real app, integrate payment.");
  });

  /* ================= SPA NAVIGATION ================= */
  const sections = document.querySelectorAll("section");
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      sections.forEach(sec => sec.classList.add("hidden-section"));
      if (target) target.classList.remove("hidden-section");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ================= LOGIN MODAL ================= */
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const loginClose = loginModal.querySelector(".close");
  const loginSubmit = document.getElementById("login-submit");

  loginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
  loginClose.addEventListener("click", () => loginModal.classList.add("hidden"));

  loginSubmit.addEventListener("click", () => {
    const email = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!email || !password) return alert("Fill all fields!");
    alert(`Logged in as ${email} ✅`);
    loginModal.classList.add("hidden");
  });

  /* ================= REGISTER MODAL ================= */
  const registerModal = document.getElementById("registerModal");
  const registerBtn = document.getElementById("registerBtn");
  const registerClose = registerModal.querySelector(".close");
  const registerSubmit = document.getElementById("register-submit");

  registerBtn.addEventListener("click", () => registerModal.classList.remove("hidden"));
  registerClose.addEventListener("click", () => registerModal.classList.add("hidden"));

  registerSubmit.addEventListener("click", () => {
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) return alert("Fill all fields!");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful ✅");
    document.getElementById("register-username").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
    registerModal.classList.add("hidden");
  });

});
