document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Products
  const products = [
    { name: "Hybrid Batteries & Modules", price: 500, icon: "fa-battery-full" },
    { name: "Electric Motors & Generators", price: 750, icon: "fa-gears" },
    { name: "Inverters & Power Control Units", price: 400, icon: "fa-bolt" },
    { name: "Engine Components", price: 350, icon: "fa-engine" },
    { name: "Cooling Systems", price: 200, icon: "fa-fan" },
    { name: "Suspension Parts", price: 250, icon: "fa-car-side" },
    { name: "Gearbox & Transmission", price: 600, icon: "fa-gears" },
    { name: "Auxiliary & Safety Parts", price: 150, icon: "fa-triangle-exclamation" }
  ];

  let cartItems = [];

  const productList = document.getElementById("product-list");
  const cartDiv = document.getElementById("cart-items");
  const cartCount = document.createElement("p");
  document.getElementById("cart").prepend(cartCount);

  function renderProducts() {
    productList.innerHTML = "";
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <i class="fa-solid ${p.icon}"></i>
        <h3>${p.name}</h3>
        <p>Price: KES ${p.price}</p>
        <button>Add to Cart</button>
      `;
      div.querySelector("button").addEventListener("click", () => {
        cartItems.push(p);
        renderCart();
      });
      productList.appendChild(div);
    });
  }

  function renderCart() {
    cartDiv.innerHTML = "";
    let total = 0;
    cartItems.forEach(item => {
      total += item.price;
      cartDiv.innerHTML += `<div>${item.name} - KES ${item.price}</div>`;
    });
    cartCount.textContent = `Cart Items: ${cartItems.length}`;
    if (cartItems.length) cartDiv.innerHTML += `<strong>Total: KES ${total}</strong>`;
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cartItems.length) return alert("Cart is empty!");
    let total = cartItems.reduce((sum, i) => sum + i.price, 0);
    alert(`Checkout total: KES ${total}`);
    cartItems = [];
    renderCart();
  });

  renderProducts();

  // Forms
  document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    alert("Message sent! ✅");
    e.target.reset();
  });

  document.getElementById("register-form").addEventListener("submit", e => {
    e.preventDefault();
    alert(`Registered as ${document.getElementById("register-username").value} ✅`);
    e.target.reset();
  });

  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    alert(`Logged in as ${document.getElementById("login-email").value} ✅`);
    e.target.reset();
  });
});
