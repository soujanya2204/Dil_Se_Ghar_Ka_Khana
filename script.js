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

// ---------- MENU: PRESELECT ITEM ----------
function selectItem(itemName) {
  const mealSelect = document.getElementById("meal");
  if (mealSelect) {
    mealSelect.value = itemName;
    scrollToSection("contact");
  }
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

// ---------- ORDER FORM → WHATSAPP ----------
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");

// TODO: Replace this with your mom's WhatsApp number (without +, with country code)
// Example: "919876543210"
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

    const msgLines = [
      "*New Order Request – Dil Se Ghar Ka Khana (Pure Veg)*",
      "",
      `Name: ${name}`,
      `Customer Phone: ${phone}`,
      `Meal: ${meal}`,
      `Meal Time: ${time}`,
      `Address: ${address}`,
      notes ? `Notes / Preferences: ${notes}` : "",
      "",
      "Sent from website order form.",
    ].filter(Boolean);

    const message = encodeURIComponent(msgLines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    // Open WhatsApp (web or app)
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

// IntersectionObserver for fade-in + active nav
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

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
  // Fallback: just show all sections
  sections.forEach((sec) => sec.classList.add("visible"));
}
