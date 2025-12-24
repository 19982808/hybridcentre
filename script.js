// ================= HERO SLIDER =================
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[index].classList.add("active");
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// ================= SECTION NAVIGATION =================
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        sections.forEach(sec => sec.classList.add("hidden"));
        target.classList.remove("hidden");
    });
});

// ================= CART FUNCTIONALITY =================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let isLoggedIn = false;

function updateCart() {
    const cartList = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    cartList.innerHTML = "";
    count.textContent = cartItems.length;

    let total = 0;
    cartItems.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.textContent = `${item.name} - $${item.price}`;
        cartList.appendChild(div);
    });

    if(cartItems.length){
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
        cartList.appendChild(totalDiv);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Add products to cart
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        cartItems.push({name, price});
        updateCart();
        alert(`${name} added to cart!`);
    });
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if(!isLoggedIn){
        alert("Please login to checkout");
        openModal("#loginModal");
        return;
    }
    if(cartItems.length === 0){
        alert("Your cart is empty!");
        return;
    }
    alert("Checkout successful!");
    cartItems = [];
    updateCart();
});

// ================= MODALS =================
function openModal(modalId){
    document.querySelector(modalId).classList.add("active");
}

function closeModal(modalId){
    document.querySelector(modalId).classList.remove("active");
}

// Close modal when clicking X
document.querySelectorAll(".modal .close").forEach(btn => {
    btn.addEventListener("click", () => {
        closeModal("#" + btn.closest('.modal').id);
    });
});

// Open login/register modals
document.getElementById("loginBtn").addEventListener("click", () => openModal("#loginModal"));
document.getElementById("registerBtn").addEventListener("click", () => openModal("#registerModal"));

// Simulate login
document.querySelector("#loginModal .submit-btn").addEventListener("click", () => {
    isLoggedIn = true;
    alert("Login successful!");
    closeModal("#loginModal");
});

// Open booking modal
document.getElementById("bookServiceBtn").addEventListener("click", () => openModal("#bookingModal"));
document.getElementById("bookServiceBtn2").addEventListener("click", () => openModal("#bookingModal"));

// Optional: Submit booking form
document.querySelectorAll("#bookingModal .submit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        alert("Service booked successfully!");
        closeModal("#bookingModal");
    });
});

// ================= INITIALIZE =================
updateCart();
showSlide(currentSlide);
