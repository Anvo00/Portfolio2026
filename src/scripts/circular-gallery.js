import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor, font }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  extra = 0;
  widthTotal = 0;
  width = 0;
  x = 0;
  scale = 1;
  padding = 2;
  speed = 0;
  isBefore = false;
  isAfter = false;

  constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius = 0, font, onLoad }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.onLoad = onLoad;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uHover;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          // Wave is driven by hover (no idle loop); drag adds a little ripple.
          float amp = uHover * 0.4 + abs(uSpeed) * 0.4;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * amp;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uHover: { value: 0 },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
      // Texture arrived after the loop may have gone idle — ask for one render.
      if (this.onLoad) this.onLoad();
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  isDown = false;
  start = 0;
  moved = 0; // total pointer travel since the last touchdown (click vs drag)
  hover = 0; // smoothed hover amount (0..1) driving the wave
  hoverTarget = 0;
  rafId = null; // null when the render loop is parked (idle or off-screen)
  isVisible = false; // toggled by the IntersectionObserver in initCircularGallery

  constructor(container, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onImageClick }) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onImageClick = onImageClick;
    autoBind(this);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.addEventListeners();
    // The loop is started by setVisible(true) once the gallery scrolls into view.
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias(items, bend, textColor, borderRadius, font) {
    const galleryItems = items && items.length > 0 ? items : [];
    this.itemsLength = galleryItems.length; // original count, before the loop duplication below
    this.mediasImages = [...galleryItems, ...galleryItems]; // duplicate for seamless loop
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        onLoad: this.wake,
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.moved = 0;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.wake();
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.moved = Math.max(this.moved, Math.abs(x - this.start));
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (!this.isDown) return;
    this.isDown = false;
    this.onCheck();
    // A tap/click (negligible drag) opens the image under the pointer instead
    // of just settling the scroll.
    if (this.moved < 5) this.handleClick(this.start);
  }

  /** Hit-test the pointer's X position against the currently rendered media
   *  planes and fire onImageClick with the tapped item's original index
   *  (mediasImages is duplicated for the seamless loop, so wrap it back). */
  handleClick(clientX) {
    if (!this.onImageClick || !this.medias || !this.medias.length) return;
    const rect = this.container.getBoundingClientRect();
    const relX = clientX - rect.left;
    const worldX = (relX - this.screen.width / 2) * (this.viewport.width / this.screen.width);
    let nearest = this.medias[0];
    let minDist = Infinity;
    for (const media of this.medias) {
      const dist = Math.abs(worldX - media.plane.position.x);
      if (dist < minDist) {
        minDist = dist;
        nearest = media;
      }
    }
    this.onImageClick(nearest.index % this.itemsLength);
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
    this.wake();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  scrollByItems(dir) {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const current = Math.round(this.scroll.target / width);
    this.scroll.target = (current + dir) * width;
    this.wake();
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
    this.wake(); // re-render once at the new size
  }

  onEnter() {
    this.hoverTarget = 0.1;
    this.wake();
  }

  onLeave() {
    this.hoverTarget = 0;
    this.wake(); // keep rendering while the wave eases back down to flat
  }

  /**
   * Toggle whether the gallery is on-screen. Driven by the IntersectionObserver
   * in initCircularGallery so the WebGL loop only runs while it's actually
   * visible — the single biggest perf win on the project pages.
   */
  setVisible(visible) {
    this.isVisible = visible;
    if (visible) this.wake();
    else this.stop();
  }

  /** Start (or keep) the render loop running. No-op if already running or hidden. */
  wake() {
    if (this.rafId != null || !this.isVisible) return;
    this.scroll.last = this.scroll.current; // avoid a spurious delta after a pause
    this.rafId = window.requestAnimationFrame(this.update);
  }

  /** Park the render loop. */
  stop() {
    if (this.rafId != null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    // Smoothly ease the hover amount and feed it to every plane.
    this.hover = lerp(this.hover, this.hoverTarget, 0.08);
    if (this.medias) {
      this.medias.forEach((media) => {
        media.program.uniforms.uHover.value = this.hover;
        media.update(this.scroll, direction);
      });
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    // Idle-skip: once the scroll has settled and nothing is hovered or dragged,
    // park the loop instead of re-rendering a static frame 60×/sec. Interaction
    // events (wheel/drag/hover) and onResize call wake() to restart it.
    const scrollSettled = Math.abs(this.scroll.target - this.scroll.current) < 0.001;
    const hoverSettled = this.hoverTarget === 0 && this.hover < 0.001;
    if (!this.isVisible || (scrollSettled && hoverSettled && !this.isDown)) {
      this.rafId = null;
      return;
    }
    this.rafId = window.requestAnimationFrame(this.update);
  }

  addEventListeners() {
    this.boundOnResize = this.onResize;
    this.boundOnWheel = this.onWheel;
    this.boundOnTouchDown = this.onTouchDown;
    this.boundOnTouchMove = this.onTouchMove;
    this.boundOnTouchUp = this.onTouchUp;
    window.addEventListener("resize", this.boundOnResize);
    // Wheel bound to the container so the page scroll isn't hijacked.
    this.container.addEventListener("mousewheel", this.boundOnWheel);
    this.container.addEventListener("wheel", this.boundOnWheel);
    // Hover drives the wave effect.
    this.container.addEventListener("mouseenter", this.onEnter);
    this.container.addEventListener("mouseleave", this.onLeave);
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    this.stop();
    if (this.visibilityObserver) this.visibilityObserver.disconnect();
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("mousewheel", this.boundOnWheel);
    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("mouseenter", this.onEnter);
    this.container.removeEventListener("mouseleave", this.onLeave);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

/**
 * Initialise a circular gallery inside `container`.
 * Reads the container's computed colour/font for the image labels.
 */
export function initCircularGallery(container, options = {}) {
  const { items = [], bend = 3, borderRadius = 0.05, scrollSpeed = 2, scrollEase = 0.05, onImageClick } = options;
  const cs = getComputedStyle(container);
  const font = `${cs.fontWeight || "bold"} ${cs.fontSize || "30px"} ${cs.fontFamily}`;
  const app = new App(container, {
    items,
    bend,
    textColor: cs.color || "#0e0e0e",
    borderRadius,
    font,
    scrollSpeed,
    scrollEase,
    onImageClick,
  });

  // Only run the WebGL loop while the gallery is actually on-screen.
  if ("IntersectionObserver" in window) {
    app.visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) app.setVisible(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    app.visibilityObserver.observe(container);
  } else {
    app.setVisible(true); // no IO support — just run it
  }

  return app;
}
