const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const themeButton = document.querySelector(".theme-toggle");
const metaTheme = document.querySelector('meta[name="theme-color"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const storedTheme = localStorage.getItem("jp-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(useDark) {
  document.body.classList.toggle("dark", useDark);
  metaTheme?.setAttribute("content", useDark ? "#151713" : "#f1efe8");
  themeButton?.setAttribute("aria-pressed", String(useDark));
}

applyTheme(storedTheme ? storedTheme === "dark" : prefersDark);

themeButton?.addEventListener("click", () => {
  const useDark = !document.body.classList.contains("dark");
  applyTheme(useDark);
  localStorage.setItem("jp-theme", useDark ? "dark" : "light");
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -7%" },
  );

  revealItems.forEach((item) => observer.observe(item));
}
