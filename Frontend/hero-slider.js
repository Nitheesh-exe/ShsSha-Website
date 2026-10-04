const slider = document.querySelector("[data-hero-slider]");

if (slider) {
  const track = slider.querySelector("[data-hero-track]");
  const slides = [...track.querySelectorAll(".hero-slide")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timer = null;

  function renderSlides() {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });
  }

  function stopAutoplay() {
    window.clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (slides.length < 2 || reducedMotion.matches || document.hidden) return;
    timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      renderSlides();
    }, 5000);
  }

  document.addEventListener("visibilitychange", startAutoplay);
  reducedMotion.addEventListener("change", () => {
    startAutoplay();
  });

  renderSlides();
  startAutoplay();
}