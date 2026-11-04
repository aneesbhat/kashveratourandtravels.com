
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Replace this with your actual WhatsApp number.
  // Include country code 91, without + or spaces.
  const WHATSAPP_NUMBER = "919697000951";

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const navLinks = document.querySelectorAll(".nav-link");

  const popup = document.getElementById("inquiryPopup");
  const closePopupButton = document.getElementById("closePopup");
  const inquiryForm = document.getElementById("inquiryForm");
  const formStatus = document.getElementById("formStatus");

  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const serviceInput = document.getElementById("service");
  const messageInput = document.getElementById("message");
  const honeypotInput = document.getElementById("website");

  const currentYear = document.getElementById("currentYear");

  let previouslyFocusedElement = null;

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------
  // MOBILE NAVIGATION
  // -------------------------

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
  }

  function openMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    primaryNav.classList.add("is-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  // -------------------------
  // ACTIVE NAVIGATION LINK
  // -------------------------

  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${activeId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // -------------------------
  // INQUIRY POPUP
  // -------------------------

  function openPopup(selectedService = "") {
    if (!popup) return;

    previouslyFocusedElement = document.activeElement;

    if (selectedService && serviceInput) {
      const matchingOption = Array.from(serviceInput.options).find(
        (option) => option.value === selectedService
      );

      if (matchingOption) {
        serviceInput.value = selectedService;
      }
    }

    if (formStatus) {
      formStatus.textContent = "";
    }

    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");

    window.requestAnimationFrame(() => {
      if (fullNameInput) {
        fullNameInput.focus();
      }
    });
  }

  function closePopup() {
    if (!popup || !popup.classList.contains("is-open")) return;

    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");

    if (
      previouslyFocusedElement &&
      typeof previouslyFocusedElement.focus === "function"
    ) {
      previouslyFocusedElement.focus();
    }
  }

  document.querySelectorAll("[data-open-popup]").forEach((button) => {
    button.addEventListener("click", () => openPopup());
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      openPopup(button.dataset.service || "");
    });
  });

  if (closePopupButton) {
    closePopupButton.addEventListener("click", closePopup);
  }

  if (popup) {
    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!popup || !popup.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closePopup();
      return;
    }

    // Keep keyboard focus inside the open dialog.
    if (event.key === "Tab") {
      const focusableElements = popup.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );

      const visibleElements = Array.from(focusableElements).filter(
        (element) => element.getClientRects().length > 0
      );

      if (!visibleElements.length) return;

      const firstElement = visibleElements[0];
      const lastElement = visibleElements[visibleElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  // -------------------------
  // PHONE INPUT
  // -------------------------

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  // -------------------------
  // INQUIRY FORM
  // -------------------------

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
      }

      // Basic honeypot spam check.
      if (honeypotInput && honeypotInput.value.trim() !== "") {
        if (formStatus) {
          formStatus.textContent =
            "Unable to process this request. Please try again.";
        }
        return;
      }

      const name = fullNameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const service = serviceInput.value;
      const message = messageInput.value.trim();

      if (!name || !service) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter your name and choose a service.";
        }
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a valid 10-digit mobile number.";
        }

        phoneInput.focus();
        return;
      }

      if (email && !emailInput.validity.valid) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a valid email address.";
        }

        emailInput.focus();
        return;
      }

      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        if (formStatus) {
          formStatus.textContent =
            "WhatsApp is not configured correctly. Please contact the website administrator.";
        }
        return;
      }

      const whatsappMessage = [
        "Hello KASHVERA!",
        "",
        "I would like to make an enquiry.",
        "",
        `Name: ${name}`,
        `Mobile: ${phone}`,
        `Email: ${email || "Not provided"}`,
        `Service: ${service}`,
        `Message: ${message || "No additional message"}`
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(whatsappMessage);

      // Open WhatsApp directly from the form submission.
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      

      // If the browser blocks the new tab, offer a clickable fallback.
      if (!whatsappWindow) {
        if (formStatus) {
          formStatus.textContent =
            "WhatsApp may have been blocked by your browser. Use the link below.";
        }

        let fallbackLink = document.getElementById("whatsappFallback");

        if (!fallbackLink) {
          fallbackLink = document.createElement("a");
          fallbackLink.id = "whatsappFallback";
          fallbackLink.className = "text-link";
          fallbackLink.target = "_blank";
          fallbackLink.rel = "noopener noreferrer";
          fallbackLink.textContent = "Open WhatsApp to send your enquiry";

          inquiryForm.appendChild(fallbackLink);
        }

        fallbackLink.href = whatsappURL;
      } else {
        const fallbackLink = document.getElementById("whatsappFallback");

        if (fallbackLink) {
          fallbackLink.remove();
        }

        closePopup();
        inquiryForm.reset();
      }
    });
  }

  
/* =========================================
   TOUR DESTINATION TABS
========================================= */
(() => {
  function initTourTabs() {
    const section = document.querySelector(".tour-packages");

    if (!section || section.dataset.tabsReady === "true") return;

    const tabs = Array.from(
      section.querySelectorAll("[data-destination-tab]")
    );

    const panels = Array.from(
      section.querySelectorAll("[data-destination-panel]")
    );

    if (!tabs.length || !panels.length) return;

    section.dataset.tabsReady = "true";

    function activateTab(destination, moveFocus = false) {
      const selectedTab = tabs.find(
        (tab) => tab.dataset.destinationTab === destination
      );

      const selectedPanel = panels.find(
        (panel) => panel.dataset.destinationPanel === destination
      );

      if (!selectedTab || !selectedPanel) return;

      tabs.forEach((tab) => {
        const active = tab === selectedTab;

        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      panels.forEach((panel) => {
        const active = panel === selectedPanel;

        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });

      if (moveFocus) selectedTab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateTab(tab.dataset.destinationTab);
      });

      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(tabs[nextIndex].dataset.destinationTab, true);
      });
    });

    // Always initialise the first valid destination.
    const initialTab =
      tabs.find((tab) => tab.dataset.destinationTab === "kashmir") ||
      tabs[0];

    activateTab(initialTab.dataset.destinationTab);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTourTabs, {
      once: true
    });
  } else {
    initTourTabs();
  }
})();


/* ===== FOOTER DESTINATION LINKS ===== */

const packagesSection = document.getElementById("packages");

if (packagesSection) {
  const destinationTabs = Array.from(
    packagesSection.querySelectorAll("[data-destination-tab]")
  );

  const destinationPanels = Array.from(
    packagesSection.querySelectorAll("[data-destination-panel]")
  );

  function activateFooterDestination(destination) {
    const matchingTab = destinationTabs.find(
      (tab) => tab.dataset.destinationTab === destination
    );

    const matchingPanel = destinationPanels.find(
      (panel) => panel.dataset.destinationPanel === destination
    );

    if (!matchingTab || !matchingPanel) return;

    destinationTabs.forEach((tab) => {
      const selected = tab === matchingTab;

      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    destinationPanels.forEach((panel) => {
      const selected = panel === matchingPanel;

      panel.classList.toggle("is-active", selected);
      panel.hidden = !selected;
    });
  }

  document.querySelectorAll("[data-footer-destination]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.dataset.footerDestination;

      const matchingTab = destinationTabs.find(
        (tab) => tab.dataset.destinationTab === destination
      );

      if (!matchingTab) return;

      event.preventDefault();
      activateFooterDestination(destination);

      const nav = document.getElementById("primaryNav");
      const menuToggle = document.getElementById("menuToggle");

      if (nav && menuToggle) {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      packagesSection.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
}


});
