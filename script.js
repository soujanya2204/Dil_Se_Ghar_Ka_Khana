// ---------- MOBILE NAV ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("show");
    }
  });
}

// ---------- SMOOTH SCROLL ----------
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
window.scrollToSection = scrollToSection;

// ---------- ORDER STATE ----------
const orderItemsState = []; // { name, price, qty }

// helper to find item index
function findOrderItemIndex(name) {
  return orderItemsState.findIndex((item) => item.name === name);
}

// ---------- MENU: PRESELECT ITEM + ADD TO ORDER ----------
function selectItem(itemName, price) {
  const mealSelect = document.getElementById("meal");
  if (mealSelect) {
    mealSelect.value = itemName;
  }

  // Add/update order summary
  if (itemName) {
    const idx = findOrderItemIndex(itemName);
    if (idx === -1) {
      orderItemsState.push({
        name: itemName,
        price: price || 0,
        qty: 1,
      });
    } else {
      orderItemsState[idx].qty += 1;
    }
    renderOrderSummary();
  }

  scrollToSection("contact");
}
window.selectItem = selectItem;

// ---------- MENU FILTERS ----------
const chips = document.querySelectorAll(".chip");
const menuCards = document.querySelectorAll(".menu-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.getAttribute("data-filter");

    chips.forEach((c) => c.classList.remove("chip-active"));
    chip.classList.add("chip-active");

    menuCards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      if (filter === "all" || filter === cat) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ---------- ORDER SUMMARY UI ----------
const orderSummaryEl = document.getElementById("orderSummary");
const orderItemsList = document.getElementById("orderItems");
const orderTotalEl = document.getElementById("orderTotal");
const clearOrderBtn = document.getElementById("clearOrderBtn");
const orderSummaryToggle = document.getElementById("orderSummaryToggle");

function renderOrderSummary() {
  if (!orderItemsList || !orderTotalEl) return;

  orderItemsList.innerHTML = "";

  if (orderItemsState.length === 0) {
    orderItemsList.innerHTML =
      '<li class="order-item"><span class="order-item-name">No items yet. Add from the menu. 🌱</span></li>';
    orderTotalEl.textContent = "₹0";
    return;
  }

  let total = 0;

  orderItemsState.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "order-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "order-item-name";
    nameSpan.textContent = item.name;

    const qtySpan = document.createElement("span");
    qtySpan.className = "order-item-qty";
    qtySpan.textContent = `x${item.qty}`;

    const priceSpan = document.createElement("span");
    priceSpan.className = "order-item-price";
    const itemTotal = item.price * item.qty;
    priceSpan.textContent = item.price ? `₹${itemTotal}` : "₹—";

    const removeBtn = document.createElement("button");
    removeBtn.className = "order-item-remove";
    removeBtn.innerHTML = "✕";
    removeBtn.title = "Remove item";

    removeBtn.addEventListener("click", () => {
      orderItemsState.splice(index, 1);
      renderOrderSummary();
    });

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    li.appendChild(priceSpan);
    li.appendChild(removeBtn);

    orderItemsList.appendChild(li);

    total += itemTotal;
  });

  orderTotalEl.textContent = total ? `₹${total}` : "₹0";
}

if (clearOrderBtn) {
  clearOrderBtn.addEventListener("click", () => {
    orderItemsState.splice(0, orderItemsState.length);
    renderOrderSummary();
  });
}

if (orderSummaryToggle && orderSummaryEl) {
  orderSummaryToggle.addEventListener("click", () => {
    const isCollapsed = orderSummaryEl.classList.toggle("collapsed");
    orderSummaryToggle.textContent = isCollapsed ? "▸" : "▾";
  });
}

// initial render
renderOrderSummary();

// ---------- ORDER FORM → WHATSAPP ----------
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");

// TODO: Replace this with your mom's WhatsApp number (without +, with country code)
const WHATSAPP_NUMBER = "919078799890";

if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const meal = document.getElementById("meal").value;
    const time = document.getElementById("time").value;
    const address = document.getElementById("address").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name || !phone || !meal || !time || !address) {
      if (formMessage) {
        formMessage.textContent =
          "Please fill all the required fields (*) before submitting.";
      }
      return;
    }

    // Build a simple text summary from orderItemsState
    let orderSummaryText = "";
    if (orderItemsState.length > 0) {
      orderSummaryText =
        "\n\nOrder Summary (from website cart):\n" +
        orderItemsState
          .map(
            (item) =>
              `• ${item.name} x${item.qty} ${
                item.price ? `- ₹${item.price * item.qty}` : ""
              }`
          )
          .join("\n");
    }

    const msgLines = [
      "*New Order Request – Dil Se Ghar Ka Khana (Pure Veg)*",
      "",
      `Name: ${name}`,
      `Customer Phone: ${phone}`,
      `Preferred Meal: ${meal}`,
      `Meal Time: ${time}`,
      `Address: ${address}`,
      notes ? `Notes / Preferences: ${notes}` : "",
      orderSummaryText,
      "",
      "Sent from website order form.",
    ].filter(Boolean);

    const message = encodeURIComponent(msgLines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(url, "_blank");

    if (formMessage) {
      formMessage.textContent = "Opening WhatsApp with your order details...";
    }

    orderForm.reset();

    setTimeout(() => {
      if (formMessage) formMessage.textContent = "";
    }, 5000);
  });
}

// ---------- FOOTER YEAR ----------
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ---------- DARK / LIGHT THEME TOGGLE ----------
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Read saved theme from localStorage
const savedTheme = localStorage.getItem("dilse-theme");

if (savedTheme === "dark") {
  body.classList.add("dark");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("dilse-theme", isDark ? "dark" : "light");
  });
}

// ---------- FAQ ACCORDION ----------
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    faqItems.forEach((i) => i.classList.remove("active"));
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// ---------- SCROLL TO TOP BUTTON ----------
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (!scrollTopBtn) return;

  if (window.scrollY > 250) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- ACTIVE NAV LINK + SECTION ANIMATIONS ----------
const sections = document.querySelectorAll("[data-section]");
const navAnchors = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.style.transitionDelay = "0.05s";

          navAnchors.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  sections.forEach((sec) => observer.observe(sec));
} else {
  sections.forEach((sec) => sec.classList.add("visible"));
}

// ---------- HERO PARALLAX EFFECT ----------
const heroParallax = document.querySelector(".hero-parallax");

if (heroParallax) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = scrollY * 0.25;
    heroParallax.style.transform = `translateY(${offset * 0.1}px)`;
  });
}
