/**
 * Page-transition logo animation (the second part of the intro).
 * Runs only when html[data-transition="logo"]; otherwise hides the overlay.
 * Sequence: stroke-draw → fill → scale-up + fade reveal → unlock.
 */
import gsap from "gsap";

const root = document.documentElement;
const overlay = document.getElementById("page-transition");

function unlock() {
  root.dataset.transition = "none"; // hides overlay + releases the scroll lock (CSS)
}

if (overlay) {
  if (root.dataset.transition !== "logo") {
    // Not a logo transition — make sure nothing is covering the page.
    overlay.style.display = "none";
  } else {
    const outline = overlay.querySelector("#pt-logo-outline");
    const fill = overlay.querySelector("#pt-logo-fill");
    const logo = overlay.querySelector("#pt-logo");
    const L = outline.getTotalLength();

    const tl = gsap.timeline();
    tl.set(outline, { strokeDasharray: L, strokeDashoffset: L });
    tl.set(logo, { opacity: 1 });

    // Draw the logo, fill it.
    tl.to(outline, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" });
    tl.to(fill, { opacity: 1, duration: 0.5, ease: "power2.out" }, "+=0.05");
    tl.to(outline, { opacity: 0, duration: 0.35, ease: "power2.out" }, "<0.4");

    // Scale up + fade the curtain to reveal the page.
    tl.addLabel("out", "+=0.1");
    tl.to(logo, { scale: 32, transformOrigin: "center center", duration: 0.6, ease: "power2.inOut" }, "out");
    tl.to(overlay, { backgroundColor: "rgba(14,14,14,0)", duration: 0.6, ease: "power2.inOut" }, "out");
    tl.to(logo, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "out");
    tl.set(overlay, { display: "none" });
    tl.call(unlock);
  }
}
