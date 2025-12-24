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

// ================= NAVIGATION =================
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);

        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.remove("hidden-section");
            } else {
                sec.classList.add("hidden-section");
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ================= CART =================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let isLoggedIn = false;

function updateCart() {
    const cartList = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    cartList.innerHTML = "";
    cartCount.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.textContent = `${item.name} - $${item.price}`;
        cartList.appendChild(div);
    });

    if (cartItems.length > 0) {
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
        cartList.appendChild(totalDiv);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        cartItems.push({ name, price });
        updateCart();
        alert(`${name} added to cart!`);
    });
});

// Checkout with login check
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!isLoggedIn) {
        alert("Please login or register to checkout!");
        openModal(loginModal);
        return;
    }
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Checkout successful! (Frontend only)");
    cartItems = [];
    updateCart();
});

// ================= MODALS =================
function openModal(modal) { modal.classList.add("active"); }
function closeModal(modal) { modal.classList.remove("active"); }

// Login Modal
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
loginBtn.addEventListener("click", () => openModal(loginModal));
loginModal.querySelector(".close").addEventListener("click", () => closeModal(loginModal));

// Handle login form
loginModal.querySelector(".submit-btn").addEventListener("click", () => {
    const username = loginModal.querySelector("input[type='text']").value;
    const password = loginModal.querySelector("input[type='password']").value;
    if (username && password) {
        isLoggedIn = true;
        alert(`Welcome, ${username}! You are now logged in (frontend only).`);
        closeModal(loginModal);
    } else {
        alert("Please enter username and password.");
    }
});

// Register Modal
const registerBtn = document.getElementById("registerBtn");
const registerModal = document.getElementById("registerModal");
registerBtn.addEventListener("click", () => openModal(registerModal));
registerModal.querySelector(".close").addEventListener("click", () => closeModal(registerModal));

// Handle register form
registerModal.querySelector(".submit-btn").addEventListener("click", () => {
    const username = registerModal.querySelector("input[type='text']").value;
    const email = registerModal.querySelector("input[type='email']").value;
    const password = registerModal.querySelector("input[type='password']").value;
    if (username && email && password) {
        isLoggedIn = true;
        alert(`Thank you ${username}! You are registered (frontend only).`);
        closeModal(registerModal);
    } else {
        alert("Please fill in all fields.");
    }
});

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    alert(`Thank you ${name}, we received your message!`);
    contactForm.reset();
});

// ================= INITIALIZE =================
updateCart();
showSlide(currentSlide);
