/* ROHIT YADAV — PORTFOLIO INTERACTIONS */
(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("#nav-links");

  // Mobile navigation: button state is exposed to assistive technology.
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });

  // Fade-up reveal animations; content remains visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Carousel controls and counter.
  const track = document.querySelector("#work-track");
  const cards = [...document.querySelectorAll(".work-card")];
  const counter = document.querySelector("#carousel-counter");
  const prev = document.querySelector("#prev-work");
  const next = document.querySelector("#next-work");

  function currentCardIndex() {
    if (!cards.length) return 0;
    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  }

  function updateCounter() {
    const index = currentCardIndex() + 1;
    counter.innerHTML = `${String(index).padStart(2, "0")} <i>/ ${String(cards.length).padStart(2, "0")}</i>`;
  }

  function scrollToCard(index) {
    const safeIndex = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: cards[safeIndex].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
  }

  prev.addEventListener("click", () => scrollToCard(currentCardIndex() - 1));
  next.addEventListener("click", () => scrollToCard(currentCardIndex() + 1));
  track.addEventListener("scroll", updateCounter, { passive: true });
  window.addEventListener("resize", updateCounter);
  updateCounter();

  // Mouse dragging for desktop; touch users can swipe using native overflow scrolling.
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  track.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch" || event.target.closest(".work-card")) return;
    isDragging = true;
    startX = event.clientX;
    scrollStart = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener("pointermove", event => {
    if (!isDragging) return;
    track.scrollLeft = scrollStart - (event.clientX - startX);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
    track.addEventListener(type, () => { isDragging = false; });
  });

  // Video modal: accepts YouTube/Vimeo embed URLs or a local .mp4 path.
  const modal = document.querySelector("#video-modal");
  const modalPlayer = document.querySelector("#modal-player");
  const modalTitle = document.querySelector("#modal-title");
  const closeButton = document.querySelector(".modal-close");
  let lastFocusedElement = null;

  function openVideo(card) {
    const url = card.dataset.video.trim();
    const title = card.dataset.title || "Project preview";
    if (!url || url.startsWith("PASTE_VIDEO_LINK")) {
      showToast("Add a video URL to this project card in index.html.");
      return;
    }

    lastFocusedElement = document.activeElement;
    modalTitle.textContent = title;
    modalPlayer.replaceChildren();

    if (/\.mp4($|\?)/i.test(url)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      modalPlayer.appendChild(video);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.title = `${title} video player`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      modalPlayer.appendChild(iframe);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeButton.focus();
  }

  function closeVideo() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalPlayer.replaceChildren(); // Stops playback when the modal closes.
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  cards.forEach(card => {
    card.addEventListener("click", () => openVideo(card));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openVideo(card);
      }
    });
  });

  closeButton.addEventListener("click", closeVideo);
  modal.querySelector("[data-close-modal]").addEventListener("click", closeVideo);

  // Keep keyboard focus inside the open dialog and support Escape to close.
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeVideo();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll("button, iframe, video")]
      .filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Discord copy button.
  const copyButton = document.querySelector("#copy-discord");
  const discordValue = document.querySelector("#discord-value");
  copyButton.addEventListener("click", async () => {
    const value = discordValue.textContent.trim();
    if (value === "YOUR_DISCORD_USERNAME") {
      showToast("Add your Discord username in index.html first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      showToast("Discord username copied.");
    } catch {
      showToast(`Discord: ${value}`);
    }
  });

  // Small, accessible status message.
  const toast = document.querySelector("#toast");
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  document.querySelector("#year").textContent = new Date().getFullYear();
})();
