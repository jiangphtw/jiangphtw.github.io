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
  themeButton?.setAttribute(
    "aria-label",
    useDark ? "切換淺色模式" : "切換深色模式",
  );
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

const homeSections = document.querySelectorAll("[data-home-section]");
const railLinks = document.querySelectorAll(".home-rail a");
const railNumber = document.querySelector("[data-rail-number]");

function activateHomeSection(section) {
  const sectionNumber = section?.dataset.homeSection;

  if (!sectionNumber) return;

  railNumber && (railNumber.textContent = `0000${sectionNumber}`);
  railLinks.forEach((link) => {
    const target = link.getAttribute("href")?.slice(1);
    link.classList.toggle("is-active", target === section.id);
  });
}

if (homeSections.length && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) activateHomeSection(visible[0].target);
    },
    { threshold: [0.25, 0.5, 0.75], rootMargin: "-18% 0px -42%" },
  );

  homeSections.forEach((section) => sectionObserver.observe(section));
}

const parallaxItems = document.querySelectorAll("[data-parallax]");
const compactViewport = window.matchMedia("(max-width: 820px)");
let parallaxFrame = 0;

function updateParallax() {
  parallaxFrame = 0;

  parallaxItems.forEach((item) => {
    if (reducedMotion.matches || compactViewport.matches) {
      item.style.removeProperty("--parallax-y");
      return;
    }

    const rect = item.getBoundingClientRect();
    const speed = Number(item.dataset.parallax || 0);
    const limit = Number(item.dataset.parallaxLimit || 60);
    const distance = window.innerHeight / 2 - (rect.top + rect.height / 2);
    const offset = Math.max(-limit, Math.min(limit, distance * speed));

    item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
  });
}

function requestParallaxUpdate() {
  if (parallaxFrame) return;
  parallaxFrame = window.requestAnimationFrame(updateParallax);
}

if (parallaxItems.length) {
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  reducedMotion.addEventListener?.("change", requestParallaxUpdate);
  compactViewport.addEventListener?.("change", requestParallaxUpdate);
  requestParallaxUpdate();
}
