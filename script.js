/* =====================================================
   GLOBAL STATE
===================================================== */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let isAdminLoggedIn = false;

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= HERO SLIDER (PRELOAD + DOTS) ================= */
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currentSlide = 0;

  slides.forEach(slide => {
    const img = new Image();
    img.src = slide.style.backgroundImage.slice(5, -2);
  });

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.onclick = () => showSlide(i);
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

  setInterval(() => {
    showSlide((currentSlide + 1) % slides.length);
  }, 5000);

  showSlide(0);

  /* ================= SPA NAVIGATION (HERO ALWAYS ON) ================= */
  const sections = document.querySelectorAll(
    "#home, #products, #cart, #location, #contact"
  );

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

  /* ================= PRODUCTS (USER SIDE) ================= */
  function renderProducts() {
    const list = document.getElementById("product-list");
    if (!list) return;
    list.innerHTML = "";

    products.forEach((p, i) => {
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
        saveCart();
        toast("Added to cart");
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
    if (!cart) return;

    cart.innerHTML = "";
    count.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach(item => {
      total += Number(item.price);
      cart.innerHTML += `<div>${item.name} - KES ${item.price}</div>`;
    });

    if (cartItems.length) {
      cart.innerHTML += `<strong>Total: KES ${total}</strong>`;
    }
  }

  updateCart();
  renderProducts();
/* ================= PAYMENT ================= */
const paidBtn = document.getElementById("paidBtn");
const paymentModal = document.getElementById("paymentModal");

if (paidBtn) {
  paidBtn.onclick = () => {
    if (!cartItems.length) {
      alert("Your cart is empty");
      return;
    }
    paymentModal.classList.remove("hidden");
  };
}

function closePayment() {
  paymentModal.classList.add("hidden");
}

document.getElementById("submitPayment").onclick = () => {
  const code = document.getElementById("mpesaCode").value.trim();
  if (code.length < 8) {
    alert("Enter a valid M-Pesa code");
    return;
  }

  const order = {
    items: cartItems,
    mpesaCode: code,
    status: "Pending Verification",
    date: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  cartItems = [];
  localStorage.removeItem("cartItems");
  updateCart();

  paymentModal.classList.add("hidden");
  alert("Payment submitted successfully!");
};

  /* ================= LOGIN / REGISTER ================= */
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  loginBtn.onclick = () => loginModal.classList.remove("hidden");
  registerBtn.onclick = () => registerModal.classList.remove("hidden");
  closeLogin.onclick = () => loginModal.classList.add("hidden");
  closeRegister.onclick = () => registerModal.classList.add("hidden");

  document.querySelector("#loginModal .submit-btn").onclick = () => {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    loginModal.classList.add("hidden");
    toast("Logged in successfully");
  };

  /* ================= BOOK SERVICE ================= */
  const bookBtn = document.getElementById("bookServiceBtn");
  if (bookBtn) {
    bookBtn.onclick = () => {
      showSection("#contact");
    };
  }

  /* ================= M-PESA (STK READY) ================= */
  document.getElementById("mpesa-pay")?.addEventListener("click", async () => {
    if (!cartItems.length) return toast("Cart is empty");

    const phone = prompt("Enter phone number (2547XXXXXXXX)");
    if (!phone) return;

    const total = cartItems.reduce((s, i) => s + Number(i.price), 0);

    try {
      const res = await fetch("http://localhost:3000/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total })
      });

      if (!res.ok) throw new Error("Payment failed");
      toast("Check your phone for M-Pesa prompt");
    } catch (e) {
      toast(e.message);
    }
  });

  /* ================= ADMIN PANEL ================= */
  adminPanelBtn.onclick = () =>
    adminLoginModal.classList.remove("hidden");

  adminLoginBtn.onclick = () => {
    if (adminUsername.value === "admin" && adminPassword.value === "1234") {
      adminLoginModal.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      renderAdminProducts();
      renderAdminOrders();
      toast("Admin logged in");
    } else {
      toast("Invalid admin credentials");
    }
  };

  logoutAdmin.onclick = () => {
    adminPanel.classList.add("hidden");
    toast("Admin logged out");
  };

  function renderAdminProducts() {
    const list = document.getElementById("admin-product-list");
    list.innerHTML = "";
    products.forEach(p => {
      list.innerHTML += `<li>${p.name} - KES ${p.price}</li>`;
    });
  }

  function renderAdminOrders() {
    const list = document.getElementById("admin-orders");
    list.innerHTML = cartItems.length
      ? cartItems.map(i => `<li>${i.name}</li>`).join("")
      : "<li>No orders</li>";
  }

  document.getElementById("add-product-form-admin").onsubmit = e => {
    e.preventDefault();
    const product = {
      name: p-name.value,
      price: p-price.value,
      icon: p-icon.value
    };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
    toast("Product added");
  };

  /* ================= TOAST ================= */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
});

