document.addEventListener("DOMContentLoaded", () => {

  // ================= HERO SLIDER =================
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  setInterval(nextSlide, 5000);
  showSlide(currentSlide);

  // ================= NAVIGATION =================
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      sections.forEach(sec => {
        sec.classList.toggle("hidden-section", sec.id !== targetId);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // ================= CART =================
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let isLoggedIn = false;

  const cartList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  function updateCart() {
    cartList.innerHTML = "";
    cartCount.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach(item => {
      total += item.price;
      const div = document.createElement("div");
      div.textContent = `${item.name} - $${item.price}`;
      cartList.appendChild(div);
    });

    if (cartItems.length) {
      const totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
      cartList.appendChild(totalDiv);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cartItems.push({
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price)
      });
      updateCart();
      alert("Added to cart!");
    });
  });

  updateCart();

  // ================= MODALS =================
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeLogin = document.getElementById("closeLogin");
  const closeRegister = document.getElementById("closeRegister");

  loginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  registerBtn.addEventListener("click", () => {
    registerModal.classList.remove("hidden");
  });

  closeLogin.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  closeRegister.addEventListener("click", () => {
    registerModal.classList.add("hidden");
  });

  window.addEventListener("click", e => {
    if (e.target === loginModal) loginModal.classList.add("hidden");
    if (e.target === registerModal) registerModal.classList.add("hidden");
  });

  // ================= LOGIN =================
  document.getElementById("login-submit").addEventListener("click", () => {
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;

    if (user && pass) {
      isLoggedIn = true;
      alert(`Welcome ${user}`);
      loginModal.classList.add("hidden");
    } else {
      alert("Fill all fields");
    }
  });

  // ================= REGISTER =================
  document.getElementById("register-submit").addEventListener("click", () => {
    const user = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const pass = document.getElementById("register-password").value;

    if (user && email && pass) {
      isLoggedIn = true;
      alert(`Registered as ${user}`);
      registerModal.classList.add("hidden");
    } else {
      alert("Fill all fields");
    }
  });

  // ================= CHECKOUT =================
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (!isLoggedIn) {
      alert("Please login to checkout");
      loginModal.classList.remove("hidden");
      return;
    }
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }
    alert("Checkout successful (frontend demo)");
    cartItems = [];
    updateCart();
  });

  // ================= CONTACT =================
  document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    alert("Message received!");
    e.target.reset();
  });

});
