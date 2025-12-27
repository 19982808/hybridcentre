/* ================= GLOBAL STATE ================= */
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let products = [
    { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
    { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
    { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
    { name: "Engine Components", price: 350, icon: "fa-engine" },
    { name: "Cooling Systems", price: 200, icon: "fa-fan" },
    { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
    { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
    { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" }
];

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

    /* ===== HERO SLIDESHOW ===== */
    const heroSection = document.querySelector(".hero");
    const slides = [
        "hero1.png",
        "hero2.png",
        "hero3.png"
    ];

    let currentSlide = 0;

    function showSlide() {
        heroSection.style.backgroundImage = `url('${slides[currentSlide]}')`;
        currentSlide = (currentSlide + 1) % slides.length;
    }

    showSlide();
    setInterval(showSlide, 5000);

    /* ===== SPA NAVIGATION ===== */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    function showSection(id) {
        sections.forEach(sec => sec.classList.add("hidden-section"));
        const target = document.querySelector(id);
        if (target) target.classList.remove("hidden-section");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            showSection(link.getAttribute("href"));
        });
    });

    showSection("#home"); // default

    /* ===== PRODUCTS ===== */
    const productList = document.getElementById("product-list");

    function renderProducts() {
        productList.innerHTML = "";
        products.forEach(p => {
            const div = document.createElement("div");
            div.className = "product";
            div.innerHTML = `
                <i class="fa-solid ${p.icon} product-icon"></i>
                <h3>${p.name}</h3>
                <p>Price: KES ${p.price}</p>
                <button class="cta-btn add-to-cart-btn">Add to Cart</button>
            `;
            div.querySelector("button").addEventListener("click", () => {
                cartItems.push(p);
                saveCart();
                alert(`${p.name} added to cart ✅`);
            });
            productList.appendChild(div);
        });
    }

    /* ===== CART ===== */
    const cartDiv = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");

    function saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCart();
    }

    function updateCart() {
        cartDiv.innerHTML = "";
        cartCount.textContent = cartItems.length;
        let total = 0;
        cartItems.forEach(item => {
            total += Number(item.price);
            const div = document.createElement("div");
            div.textContent = `${item.name} - KES ${item.price}`;
            cartDiv.appendChild(div);
        });
        if (cartItems.length > 0) {
            const totalDiv = document.createElement("div");
            totalDiv.innerHTML = `<strong>Total: KES ${total}</strong>`;
            cartDiv.appendChild(totalDiv);
        }
    }

    document.getElementById("checkoutBtn").addEventListener("click", () => {
        if (!cartItems.length) return alert("Cart is empty ❌");
        const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
        alert(`Total amount: KES ${total}. Payment will be handled via WhatsApp.`);
        cartItems = [];
        saveCart();
    });

    renderProducts();
    updateCart();

    /* ===== BOOK SERVICE FORM ===== */
    const bookForm = document.getElementById("bookServiceForm");
    bookForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("service-name").value;
        const phone = document.getElementById("service-phone").value;
        const details = document.getElementById("service-details").value;
        alert(`Booking received ✅\nName: ${name}\nPhone: ${phone}\nDetails: ${details}`);
        bookForm.reset();
    });

    /* ===== PAYMENT CTA ===== */
    const payBtn = document.getElementById("payNowBtn");
    payBtn.addEventListener("click", () => {
        const message = encodeURIComponent("Payment received! Thanks for shopping at Hybrid Spares Shop.");
        const whatsappUrl = `https://wa.me/254700000000?text=${message}`;
        window.open(whatsappUrl, "_blank");
    });

    /* ===== ADMIN DASHBOARD ===== */
    const adminModal = document.getElementById("adminModal");
    const adminBtn = document.getElementById("adminLoginBtn");
    const closeAdmin = document.getElementById("closeAdmin");
    const adminForm = document.getElementById("add-product-form");
    const adminList = document.getElementById("admin-product-list");

    adminBtn.addEventListener("click", () => adminModal.classList.remove("hidden"));
    closeAdmin.addEventListener("click", () => adminModal.classList.add("hidden"));

    function renderAdminProducts() {
        adminList.innerHTML = "";
        products.forEach((p, i) => {
            const li = document.createElement("li");
            li.textContent = `${p.name} - KES ${p.price} - Icon: ${p.icon}`;
            adminList.appendChild(li);
        });
    }

    renderAdminProducts();

    adminForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("admin-product-name").value;
        const price = document.getElementById("admin-product-price").value;
        const icon = document.getElementById("admin-product-icon").value;
        products.push({ name, price: Number(price), icon });
        renderProducts();
        renderAdminProducts();
        adminForm.reset();
        alert(`Product "${name}" added ✅`);
    });

    /* ===== BOOK SERVICE CTA ===== */
    const bookServiceBtn = document.getElementById("bookServiceBtn");
    bookServiceBtn.addEventListener("click", () => showSection("#contact"));
});
