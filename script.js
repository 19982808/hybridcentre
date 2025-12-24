// ================= HERO SLIDER =================
const slides = document.querySelectorAll(".slide"); // Adjusted to match your HTML structure
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[index].classList.add("active");
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-slide every 5s
setInterval(nextSlide, 5000);

// ================= SECTION NAVIGATION =================
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        sections.forEach((sec) => sec.classList.add("hidden"));
        target.classList.remove("hidden");
    });
});

// ================= CART =================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let isLoggedIn = false;

function updateCart() {
    const cartList = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    cartList.innerHTML = "";
    count.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach((item) => {
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

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        cartItems.push({ name, price });
        updateCart();
        alert(`${name} added to cart!`);
    });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!isLoggedIn) {
        alert("Please login to checkout");
        openModal("#loginModal");
        return;
    }
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Checkout successful!");
    cartItems = [];
    updateCart();
});

// ================= MODALS =================
function openModal(modalId) {
    document.querySelector(modalId).classList.add("active");
}

function closeModal(modalId) {
    document.querySelector(modalId).classList.remove("active");
}

document.querySelectorAll(".modal .close").forEach((btn) => {
    btn.addEventListener("click", () => {
        closeModal(btn.closest('.modal').id);
    });
});

// ================= LOGIN / REGISTER =================
document.getElementById("loginBtn").addEventListener("click", () => {
    openModal("#loginModal");
});

document.getElementById("registerBtn").addEventListener("click", () => {
    openModal("#registerModal");
});

document.querySelector("#loginModal .submit-btn").addEventListener("click", () => {
    isLoggedIn = true;
    alert("Login successful!");
    closeModal("#loginModal");
});

// ================= BOOK SERVICE =================
document.querySelectorAll(".cta-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const bookingSection = document.querySelector("#bookingModal");
        if (bookingSection) {
            sections.forEach((sec) => sec.classList.add("hidden"));
            bookingSection.classList.remove("hidden");
        }
    });
});

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-message").value;

        alert(`Thank you ${name}, we received your message!`);
        contactForm.reset();
    });
}

// ================= INITIALIZE =================
updateCart();
showSlide(currentSlide);
