/**
 * Intro orchestrator.
 * Times the logo reveal, lifts the curtain, then unlocks scrolling.
 * Honors prefers-reduced-motion by skipping straight to the page.
 */

const intro = document.getElementById("intro");
const body = document.body;

const finish = () => {
  body.classList.remove("intro-active");
  if (intro) intro.setAttribute("hidden", "");
};

if (!intro) {
  finish();
} else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // No motion: drop the curtain immediately.
  finish();
} else {
  const HOLD = 1100; // logo on screen before it lifts (ms)

  window.setTimeout(() => {
    intro.classList.add("is-leaving"); // ease the logo out
    window.setTimeout(() => {
      intro.classList.add("is-done"); // slide the curtain up
    }, 250);
  }, HOLD);

  // Clean up once the curtain transition ends.
  intro.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform" && intro.classList.contains("is-done")) {
      finish();
    }
  });

  // Safety net in case the transition never fires.
  window.setTimeout(finish, HOLD + 1600);
}
