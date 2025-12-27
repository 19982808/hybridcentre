/* =====================================================
   GLOBAL STATE
===================================================== */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= HERO SLIDER ================= */
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

  /* ================= SPA NAVIGATION ================= */
  const sections = document.querySelectorAll("#home, #products, #cart, #location, #contact");

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
    if (!list) return;
    list.innerHTML = "";

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

  /* ================= PAYMENT + WHATSAPP ================= */
  function handlePayment(totalAmount) {
    if (!cartItems.length) return toast("Cart is empty ❌", false);

    const phone = localStorage.getItem("userPhone") || prompt("Enter your WhatsApp number (2547XXXXXXXX):");
    if (!phone) return;
    localStorage.setItem("userPhone", phone);

    const mpesaCode = "MP" + Math.floor(Math.random() * 1000000); // simulate STK

    const order = {
      id: Date.now(),
      items: cartItems,
      mpesaCode,
      status: "Paid",
      amount: totalAmount,
      date: new Date().toLocaleString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // WhatsApp message
    let message = `🛒 *Order #${order.id}*\n\n`;
    order.items.forEach(item => message += `• ${item.name} - KES ${item.price}\n`);
    message += `\n*Total:* KES ${order.amount}\nM-Pesa Ref: ${order.mpesaCode}\nThank you for your order!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    cartItems = [];
    localStorage.removeItem("cartItems");
    updateCart();
    toast("Payment successful & WhatsApp order sent! ✅");
    launchConfetti(40);
  }

  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    if (!cartItems.length) return alert("Cart is empty ❌");
    const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
    handlePayment(total);
  });

  /* ================= LOGIN ================= */
  const loginModal = document.getElementById("loginModal");
  loginBtn.onclick = () => loginModal.classList.remove("hidden");
  closeLogin.onclick = () => loginModal.classList.add("hidden");

  document.querySelector("#loginModal .submit-btn")?.addEventListener("click", () => {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    loginModal.classList.add("hidden");

    if (!localStorage.getItem("userPhone")) {
      const phone = prompt("Enter your WhatsApp number (2547XXXXXXXX):");
      if (phone) localStorage.setItem("userPhone", phone);
    }

    toast("Logged in successfully ✅");
  });

  /* ================= BOOK SERVICE ================= */
  const bookBtn = document.getElementById("bookServiceBtn");
  if (bookBtn) bookBtn.onclick = () => showSection("#contact");

  /* ================= ADMIN PANEL ================= */
  adminPanelBtn.onclick = () => adminLoginModal.classList.remove("hidden");
  adminLoginBtn.onclick = () => {
    if (adminUsername.value === "admin" && adminPassword.value === "1234") {
      adminLoginModal.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      renderAdminProducts();
      renderAdminOrders();
      toast("Admin logged in ✅");
    } else toast("Invalid admin credentials ❌", false);
  };
  logoutAdmin.onclick = () => {
    adminPanel.classList.add("hidden");
    toast("Admin logged out ✅");
  };

  function renderAdminProducts() {
    const list = document.getElementById("admin-product-list");
    list.innerHTML = "";
    products.forEach(p => list.innerHTML += `<li>${p.name} - KES ${p.price}</li>`);
  }

  function renderAdminOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const list = document.getElementById("admin-orders");
    list.innerHTML = "";
    orders.forEach(o => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>Order ${o.id}</strong><br>Amount: KES ${o.amount}<br>Ref: ${o.mpesaCode}<br>Status: ${o.status}<hr>`;
      list.appendChild(li);
    });
  }

  document.getElementById("add-product-form-admin")?.addEventListener("submit", e => {
    e.preventDefault();
    const product = { name: p_name.value, price: p_price.value, icon: p_icon.value };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
    toast("Product added ✅");
  });

  /* ================= TOAST ================= */
  function toast(msg, success = true) {
    const t = document.createElement("div");
    t.className = "toast";
    t.style.background = success ? "#28a745" : "#dc3545";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ================= CONFETTI ================= */
  function launchConfetti(count = 30) {
    const colors = ["#28a745","#ffc107","#17a2b8","#dc3545","#6f42c1"];
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.width = 5 + Math.random() * 10 + "px";
      confetti.style.height = 5 + Math.random() * 10 + "px";
      confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
      confetti.style.transform = `rotate(${Math.random()*360}deg)`;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  }

});
