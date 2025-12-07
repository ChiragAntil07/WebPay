
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  function smoothScrollToHash(hash) {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    const headerOffset = header ? header.offsetHeight : 0;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 16;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const hash = link.getAttribute("href");
      document.body.classList.remove("nav-open");
      smoothScrollToHash(hash);
    });
  });


  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }


  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    const headerEl = document.querySelector("header");
    if (!headerEl.contains(e.target)) {
      document.body.classList.remove("nav-open");
    }
  });


  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.body.classList.remove("nav-open");
      closeModal();
    }
  });

  const createAccountBtn = document.querySelector(".hero-actions .btn-primary");
  const seeDemoBtn = document.querySelector(".hero-actions .btn-outline");

  if (createAccountBtn) {
    createAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScrollToHash("#pricing");
    });
  }


  const themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (themeToggle) themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      if (themeToggle) themeToggle.textContent = "🌙";
    }
  }


  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      const newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }


  const demoModal = document.getElementById("demoModal");
  const modalBackdrop = demoModal ? demoModal.querySelector(".modal-backdrop") : null;
  const modalCloseBtn = demoModal ? demoModal.querySelector(".modal-close") : null;

  function openModal() {
    if (!demoModal) return;
    demoModal.classList.add("open");
    demoModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!demoModal) return;
    demoModal.classList.remove("open");
    demoModal.setAttribute("aria-hidden", "true");
  }

  if (seeDemoBtn) {
    seeDemoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", () => {
      closeModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  const revealElements = document.querySelectorAll(
    ".hero-left, .mock-card, .feature, .product.card, .plan.card, .testimonial.card, .contact-grid"
  );

  revealElements.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {

    revealElements.forEach((el) => el.classList.add("in-view"));
  }


  const balanceEl = document.querySelector(".mock-card .balance");
  const lastDepositEl = document.querySelector(".mini-stats .stat:nth-child(1) .stat-value");
  const recentSpendEl = document.querySelector(".mini-stats .stat:nth-child(2) .stat-value");
  const addMoneyBtn = document.querySelector(".card-actions .btn-primary");
  const sendMoneyBtn = document.querySelector(".card-actions .btn-secondary");

  function parseINR(text) {
    if (!text) return 0;
    const num = text.replace(/[^\d.-]/g, "");
    const value = parseFloat(num);
    return isNaN(value) ? 0 : value;
  }

  function formatINR(value) {
    try {
      return value.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      });
    } catch {
      return "₹ " + value.toFixed(2);
    }
  }

  if (balanceEl && lastDepositEl && recentSpendEl) {
    let balance = parseINR(balanceEl.textContent);
    const lastDepositAmount = parseINR(lastDepositEl.textContent);
    const recentSpendAmount = parseINR(recentSpendEl.textContent);

    function animateBalanceChange(from, to, duration = 400) {
      const start = performance.now();

      function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = from + (to - from) * progress;
        balanceEl.textContent = formatINR(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          balanceEl.textContent = formatINR(to);
        }
      }

      requestAnimationFrame(step);
    }

    if (addMoneyBtn) {
      addMoneyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const newBalance = balance + lastDepositAmount;
        animateBalanceChange(balance, newBalance);
        balance = newBalance;
      });
    }

    if (sendMoneyBtn) {
      sendMoneyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const newBalance = Math.max(0, balance - recentSpendAmount);
        animateBalanceChange(balance, newBalance);
        balance = newBalance;
      });
    }
  }


  const billingButtons = document.querySelectorAll(".billing-option");
  const priceEls = document.querySelectorAll(".plan .price");

  function updateBilling(mode) {
    billingButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.billing === mode);
    });

    priceEls.forEach((priceEl) => {
      const monthly = Number(priceEl.dataset.monthly || 0);
      const yearly = Number(priceEl.dataset.yearly || 0);

      let value, suffix;
      if (mode === "yearly") {
        value = yearly;
        suffix = " / year";
      } else {
        value = monthly;
        suffix = " / month";
      }

      if (isNaN(value)) return;

      const formatted = value.toLocaleString("en-IN");
      priceEl.textContent = `₹ ${formatted}${suffix}`;
    });
  }

  billingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.billing || "monthly";
      updateBilling(mode);
    });
  });


  if (billingButtons.length) {
    updateBilling("monthly");
  }


  const contactSection = document.querySelector("#contact");
  const contactForm = contactSection ? contactSection.querySelector("form") : null;

  if (contactForm) {
    const sendButton = contactForm.querySelector('button[type="button"]');

    let statusEl = contactForm.querySelector(".form-status");
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "form-status";
      statusEl.style.marginTop = "10px";
      statusEl.style.fontSize = "14px";
      contactForm.appendChild(statusEl);
    }

    function setStatus(message, isError = false) {
      statusEl.textContent = message;
      statusEl.style.color = isError ? "#b91c1c" : "#166534";
    }

    if (sendButton) {
      sendButton.addEventListener("click", () => {
        const nameInput =
          contactForm.querySelector('input[placeholder="Your name"]') ||
          contactForm.querySelector('input[type="text"]:not([style])');
        const emailInput = contactForm.querySelector('input[type="email"]');

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";

        if (!name) {
          setStatus("Please enter your name.", true);
          return;
        }

        if (!email) {
          setStatus("Please enter your email address.", true);
          return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          setStatus("Please enter a valid email address.", true);
          return;
        }

        setStatus("Sending your request...");
        setTimeout(() => {
          contactForm.reset();
          setStatus("Thanks! We’ve received your request and will contact you soon.");
        }, 700);
      });
    }
  }
});
