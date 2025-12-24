// ================= HERO SLIDER =================
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// ================= NAVIGATION =================
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1); // Remove #
        sections.forEach(sec => sec.classList.add("hidden-section"));
        const targetSection = document.getElementById(targetId);
        if(targetSection) targetSection.classList.remove("hidden-section");
    });
});

// ================= CART =================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

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

    if(cartItems.length > 0){
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

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if(cartItems.length === 0){
        alert("Your cart is empty!");
        return;
    }
    alert("Checkout successful! (Frontend only)");
    cartItems = [];
    updateCart();
});

// ================= MODALS =================
function openModal(modal) {
    modal.classList.remove("hidden");
}

function closeModal(modal) {
    modal.classList.add("hidden");
}

// Login modal
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
loginBtn.addEventListener("click", () => openModal(loginModal));

loginModal.querySelector(".close").addEventListener("click", () => closeModal(loginModal));

// Register modal
const registerBtn = document.getElementById("registerBtn");
const registerModal = document.getElementById("registerModal");
registerBtn.addEventListener("click", () => openModal(registerModal));

registerModal.querySelector(".close").addEventListener("click", () => closeModal(registerModal));

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    alert(`Thank you ${name}, we received your message!`);
    contactForm.reset();
});

// ================= INITIALIZE =================
updateCart();
showSlide(currentSlide);
