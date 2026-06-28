import gsap from "gsap";

/*
 * Full intro (logo + "HI, I'm Vito"). Runs only on a fresh homepage
 * open/refresh — i.e. html[data-transition="full"]. Otherwise the overlay
 * is hidden (the page-transition overlay handles navigations instead).
 */
const root = document.documentElement;

if (root.dataset.transition !== "full") {
  const intro = document.getElementById("intro");
  if (intro) intro.style.display = "none";
} else {
  const tl = gsap.timeline();
  const d = 0.7,
    ease = "power3.out";

  tl.set(".guide--top", { top: "50%" })
    .set(".guide--bottom", { bottom: "50%" })
    .set(".guide--left", { left: "50%" })
    .set(".guide--right", { right: "50%" });

  // STATO INIZIALE DEL LOGO
  const outline = document.querySelector("#logo-outline");
  const L = outline.getTotalLength();
  tl.set(outline, { strokeDasharray: L, strokeDashoffset: L });

  // === STEP 1 - HI ===

  /* .from() dice "parti da questo stato e arriva al normale"*/
  tl.from(
    " .phrase1 .mask_inner",
    {
      scale: 0.6,
      opacity: 0,
      duration: d,
      transformOrigin: "center center",
    },
    "+=0.2",
  );

  /* .to() dice "parti dal normale e arriva a questo stato"*/
  tl.to(".guide", { opacity: 1, duration: 0.2 }, "<0.10")
    .to(".guide--top", { top: "0%", duration: d, ease }, "<")
    .to(".guide--bottom", { bottom: "0%", duration: d, ease }, "<")
    .to(".guide--left", { left: "0%", duration: d, ease }, "<")
    .to(".guide--right", { right: "0%", duration: d, ease }, "<");

  // === STEP 2 - HI, I'M VITO ===

  tl.set(".rest", { opacity: 1, overflow: "hidden", marginLeft: 0 }, "+=0.1")
    .to(".rest", { width: () => getRestWidth(), marginLeft: "0.25em", duration: d, ease }, "<")
    .set(".rest", { width: "auto", overflow: "visible" });

  tl.to(".guide", { autoAlpha: 0, duration: 0.4, ease: "power2.in" });

  tl.to(".intro_text", { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "+=0.2");

  /* Misura la larghezza del contenuto restante */
  function getRestWidth() {
    const rest = document.querySelector(".rest");
    if (!rest) return 0;
    rest.style.width = "auto";
    const w = rest.offsetWidth;
    rest.style.width = "0px";
    return w;
  }

  // === LOGO ANIMATION ===

  tl.set("#logo", { opacity: 1 });
  tl.to(outline, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" });
  tl.to("#logo-fill", { opacity: 1, duration: 0.6, ease: "power2.out" }, "+=0.1");
  tl.to(outline, { opacity: 0, duration: 0.4, ease: "power2.out" }, "<0.5");

  // === TRANSIZIONE ===
  tl.addLabel("toHome", "+=0.15");
  tl.to("#logo", { scale: 32, transformOrigin: "center center", duration: 0.6, ease: "power2.inOut" }, "toHome");
  tl.to("#intro", { backgroundColor: "rgba(14,14,14,0)", duration: 0.6, ease: "power2.inOut" }, "toHome");
  tl.to("#logo", { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "toHome");
  tl.set("#intro", { display: "none" }); // Per rimuovere l'overlay
  tl.call(() => {
    root.dataset.transition = "none"; // release the scroll lock
  });

  // === TIME MANAGEMENT ===
  tl.timeScale(0.65);
}
