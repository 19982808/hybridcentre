/***********************
 HERO SLIDER
************************/
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 4000); // 4 seconds
showSlide(currentSlide);


/***********************
 NAV SECTION TOGGLE
************************/
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);

    sections.forEach(section => {
      if (section.id === targetId || targetId === "home") {
        section.style.display = "block";
      } else if (section.id) {
        section.style.display = "none";
      }
    });

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  });
});


/***********************
 LOGIN & REGISTER MODALS
************************/
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const closeLogin = document.getElementById("closeLogin");
const closeRegister = document.getElementById("closeRegister");

loginBtn?.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

registerBtn?.addEventListener("click", () => {
  registerModal.style.display = "flex";
});

closeLogin?.addEventListener("click", () => {
  loginModal.style.display = "none";
});

closeRegister?.addEventListener("click", () => {
  registerModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === registerModal) registerModal.style.display = "none";
});


/***********************
 CART FUNCTIONALITY
************************/
let cart = [];
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    cart.push({ name, price });
    updateCart();
    alert(`${name} added to cart`);
  });
});

function updateCart() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} - $${item.price}`;
    cartItemsContainer.appendChild(div);
  });
}


/***********************
 CONTACT FORM (FRONTEND ONLY)
************************/
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  contactStatus.textContent = "Message sent successfully ✔";
  contactForm.reset();
});


/***********************
 INITIAL STATE
************************/
sections.forEach(section => {
  if (section.id !== "home") {
    section.style.display = "none";
  }
});
