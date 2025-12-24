let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {

    /* ===== HERO SLIDER ===== */
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".dots");
    let current = 0;
    let interval;

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
        current = index;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    interval = setInterval(nextSlide, 5000);

    /* ===== SECTION NAVIGATION ===== */
    const sections = document.querySelectorAll("section");
    document.querySelectorAll(".nav-link").forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            sections.forEach(s => s.classList.add("hidden-section"));
            document.querySelector(link.getAttribute("href")).classList.remove("hidden-section");
        };
    });

    document.querySelector("#home").classList.remove("hidden-section");

    /* ===== CART ===== */
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.onclick = () => {
            cartItems.push({
                name: btn.dataset.name,
                price: Number(btn.dataset.price)
            });
            updateCart();
            alert("Added to cart");
        };
    });

    function updateCart() {
        const cart = document.getElementById("cart-items");
        const count = document.getElementById("cart-count");
        cart.innerHTML = "";
        count.textContent = cartItems.length;

        let total = 0;
        cartItems.forEach(i => {
            total += i.price;
            const div = document.createElement("div");
            div.textContent = `${i.name} - $${i.price}`;
            cart.appendChild(div);
        });

        if (cartItems.length) {
            const totalDiv = document.createElement("div");
            totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
            cart.appendChild(totalDiv);
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    updateCart();

    document.getElementById("checkout-btn").onclick = () => {
        if (!isLoggedIn) {
            alert("Please login to checkout");
            document.getElementById("loginModal").classList.remove("hidden");
            return;
        }
        cartItems = [];
        updateCart();
        alert("Checkout successful");
    };

    /* ===== LOGIN / REGISTER ===== */
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    document.getElementById("loginBtn").onclick = () => loginModal.classList.remove("hidden");
    document.getElementById("registerBtn").onclick = () => registerModal.classList.remove("hidden");

    document.getElementById("closeLogin").onclick = () => loginModal.classList.add("hidden");
    document.getElementById("closeRegister").onclick = () => registerModal.classList.add("hidden");

    document.querySelector("#loginModal .submit-btn").onclick = () => {
        isLoggedIn = true;
        alert("Login successful");
        loginModal.classList.add("hidden");
    };
});
document.getElementById("mpesa-pay").addEventListener("click", async () => {
    const phone = prompt("Enter phone number (2547XXXXXXXX)");
    if (!phone || cartItems.length === 0) return;

    const total = cartItems.reduce((s, i) => s + i.price, 0);

    const res = await fetch("http://localhost:3000/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total })
    });

    const data = await res.json();
    alert("Check your phone for M-Pesa prompt");
});
let products = [];

document.getElementById("add-product-form").addEventListener("submit", e => {
    e.preventDefault();

    const name = pName.value;
    const price = pPrice.value;
    const icon = pIcon.value;

    products.push({ name, price, icon });
    renderProducts();
});

function renderProducts() {
    const list = document.getElementById("products-list");
    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `
            <div class="product">
                <i class="fa-solid ${p.icon} product-icon"></i>
                <h3>${p.name}</h3>
                <p>Price: $${p.price}</p>
                <button class="add-to-cart-btn"
                    data-name="${p.name}"
                    data-price="${p.price}">
                    Buy Now
                </button>
            </div>
        `;
    });
}

// ===== ADMIN LOGIN LOGIC =====
const adminLoginModal = document.getElementById("adminLoginModal");
const adminPanel = document.getElementById("admin-panel");
const logoutAdmin = document.getElementById("logoutAdmin");

// Open admin modal when user clicks login (replace with separate admin button if needed)
document.getElementById("loginBtn").addEventListener("click", () => {
  adminLoginModal.classList.remove("hidden");
});

// Close modal
document.getElementById("closeAdminLogin").addEventListener("click", () => {
  adminLoginModal.classList.add("hidden");
});

// Admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

document.getElementById("adminLoginBtn").addEventListener("click", () => {
  const username = document.getElementById("admin-username").value;
  const password = document.getElementById("admin-password").value;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    adminLoginModal.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadAdminData();
  } else {
    alert("Invalid admin credentials");
  }
});

// Logout
logoutAdmin.addEventListener("click", () => {
  adminPanel.classList.add("hidden");
});

// ===== LOAD ADMIN DATA =====
function loadAdminData() {
  const productList = document.getElementById("admin-products");
  const orderList = document.getElementById("admin-orders");

  productList.innerHTML = "";
  orderList.innerHTML = "";

  // List all products
  document.querySelectorAll(".product h3").forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.textContent;
    productList.appendChild(li);
  });

  // List cart items
  if (cartItems.length === 0) {
    orderList.innerHTML = "<li>No orders yet</li>";
  } else {
    cartItems.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price}`;
      orderList.appendChild(li);
    });
  }
}
