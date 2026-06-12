import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJETS } from "./data/projets";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================================
   PORTFOLIO — Direction "Precision in Motion"
   Minimaliste typographique · Dev-first · Animations natives (0 dépendance)
   Tout est en français. Couleur d'accent modifiable via --accent ci-dessous.
   ========================================================================= */

const CSS = `
:root {
  --bg: #ffffff;
  --ink: #0a0a0a;
  --muted: #6b6b6b;
  --line: #e6e6e6;
  --accent: #ff4d2e;            /* ← change cette valeur pour reskinner tout le site */
  --font-display: "Syne", sans-serif;
  --font-body: "Archivo", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body, #root {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

.pf { position: relative; overflow-x: hidden; }

/* ---------- Curseur personnalisé ---------- */
.pf__cursor {
  position: fixed; top: 0; left: 0;
  width: 14px; height: 14px;
  border: 1.5px solid var(--ink);
  border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width .25s ease, height .25s ease, background .25s ease, border-color .25s ease, opacity .25s ease;
  mix-blend-mode: difference;
}
.pf__cursor.is-hover {
  width: 64px; height: 64px;
  background: var(--bg);
  border-color: var(--bg);
}
@media (pointer: coarse) { .pf__cursor { display: none; } }

/* ---------- Layout commun ---------- */
.pf section { padding: 0 6vw; }
.pf__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--muted);
  display: flex; align-items: center; gap: 12px;
}
.pf__eyebrow::before {
  content: ""; width: 28px; height: 1px; background: var(--accent);
}

/* ---------- Navigation ---------- */
.pf__nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 26px 6vw;
  mix-blend-mode: difference; color: #fff;
}
.pf__nav-logo { font-family: var(--font-mono); font-size: 14px; letter-spacing: .04em; }
.pf__nav-links { display: flex; gap: 30px; }
.pf__nav-links a {
  color: inherit; text-decoration: none;
  font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em;
  position: relative;
}
.pf__nav-links a::after {
  content: ""; position: absolute; left: 0; bottom: -4px; width: 0; height: 1px;
  background: currentColor; transition: width .3s ease;
}
.pf__nav-links a:hover::after { width: 100%; }

/* ---------- Hero ---------- */
.pf__hero {
  min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
  padding-top: 100px; padding-bottom: 60px;
}
.pf__hero-title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(34px, 8vw, 120px); line-height: .92; letter-spacing: -0.03em;
  max-width: 100%; color: var(--ink);
}
.pf__hero-title .accent { color: var(--accent); }
.pf__line-mask { display: block; overflow: hidden; padding-bottom: .04em; }
.pf__line { display: block; will-change: transform; }
.pf__hero-bottom {
  margin-top: 32px; display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; align-items: flex-end;
}
.pf__hero-lead {
  max-width: 420px; font-size: clamp(16px, 1.4vw, 20px); line-height: 1.6; color: var(--muted);
}
.pf__hero-lead strong { color: var(--ink); font-weight: 500; }
.pf__stats { display: flex; gap: 48px; }
.pf__stat-num { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 3.4vw, 50px); line-height: 1; margin-bottom: 8px; }
.pf__stat-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }

/* ---------- Scroll indicator ---------- */
.pf__scroll {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--muted); display: flex; align-items: center; gap: 10px; margin-top: 28px;
}
.pf__scroll span { display: inline-block; width: 1px; height: 36px; background: var(--ink); animation: scrollPulse 2s ease-in-out infinite; transform-origin: top; }
@keyframes scrollPulse { 0%,100% { transform: scaleY(.3); opacity:.3 } 50% { transform: scaleY(1); opacity:1 } }

/* ---------- À propos ---------- */
.pf__about { padding-top: 14vh; padding-bottom: 14vh; }
.pf__about-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 6vw; align-items: start; margin-top: 48px; }
.pf__photo {
  aspect-ratio: 3/4; background: #f0f0ee; filter: grayscale(1) contrast(1.05);
  background-size: cover; background-position: center; position: relative;
}
.pf__photo::after { content: "MA PHOTO"; position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--font-mono); font-size: 12px; letter-spacing: .2em; color: #b5b5b5; }
.pf__about-text p { font-size: clamp(20px, 2.4vw, 34px); line-height: 1.35; font-family: var(--font-display); font-weight: 500; letter-spacing: -0.01em; }
.pf__about-text p .muted { color: var(--muted); }
.pf__stack { margin-top: 40px; }
.pf__stack-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
.pf__tags { display: flex; flex-wrap: wrap; gap: 10px; }
.pf__tag { font-family: var(--font-mono); font-size: 13px; padding: 8px 14px; border: 1px solid var(--line); border-radius: 100px; transition: border-color .25s, color .25s; }
.pf__tag:hover { border-color: var(--ink); }

/* ---------- Projets ---------- */
.pf__projects { padding-top: 10vh; padding-bottom: 12vh; }
.pf__projects-head { display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.pf__projects-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(40px, 7vw, 110px); line-height: .92; letter-spacing: -0.03em; }
.pf__filters { display: flex; flex-wrap: wrap; gap: 8px; }
.pf__filter { font-family: var(--font-mono); font-size: 12px; letter-spacing: .04em; padding: 9px 16px; border: 1px solid var(--line); border-radius: 100px; background: none; color: var(--muted); cursor: none; transition: all .25s; }
.pf__filter.is-active { background: var(--ink); color: var(--bg); border-color: var(--ink); }

.pf__list { border-top: 1px solid var(--line); }
.pf__item {
  border-bottom: 1px solid var(--line);
  display: grid; grid-template-columns: 64px 1fr auto; gap: 24px; align-items: center;
  padding: 34px 8px; position: relative; cursor: none;
  transition: padding-left .4s cubic-bezier(.2,.7,.3,1), color .4s;
}
.pf__item:hover { padding-left: 28px; }
.pf__item:hover .pf__item-name { color: var(--accent); }
.pf__item-num { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
.pf__item-name { font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 4.4vw, 60px); line-height: 1; letter-spacing: -0.02em; transition: color .35s; }
.pf__item-stack { font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-align: right; max-width: 240px; }
.pf__item-arrow { transition: transform .35s; display: inline-block; }
.pf__item:hover .pf__item-arrow { transform: translate(6px, -6px); }

/* image flottante qui suit le curseur */
.pf__float {
  position: fixed; top: 0; left: 0; width: 320px; height: 240px;
  pointer-events: none; z-index: 50; overflow: hidden; border-radius: 6px;
  opacity: 0; transform: translate(-50%, -50%) scale(.85);
  transition: opacity .35s ease, transform .35s ease;
  background-size: cover; background-position: center;
}
.pf__float.is-on { opacity: 1; transform: translate(-50%, -50%) scale(1); }
@media (pointer: coarse) { .pf__float { display: none; } }

/* ---------- Contact ---------- */
.pf__contact { padding-top: 14vh; padding-bottom: 8vh; }
.pf__contact-big { font-family: var(--font-display); font-weight: 800; font-size: clamp(40px, 10vw, 150px); line-height: .95; letter-spacing: -0.03em; max-width: 100%; }
.pf__contact-big a { color: inherit; text-decoration: none; transition: color .3s; }
.pf__contact-big a:hover { color: var(--accent); }
.pf__contact-row { margin-top: 48px; display: flex; flex-wrap: wrap; gap: 30px; }
.pf__contact-row a { font-family: var(--font-mono); font-size: 14px; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--line); padding-bottom: 3px; transition: border-color .3s; }
.pf__contact-row a:hover { border-color: var(--accent); }

.pf__footer { padding: 36px 6vw; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

/* ---------- Lenis (smooth scroll) ---------- */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }

/* ---------- Reveal au scroll (animé par GSAP) ---------- */
.reveal { opacity: 0; }
.reveal.is-in { opacity: 1; }

@media (max-width: 820px) {
  .pf__about-grid { grid-template-columns: 1fr; }
  .pf__photo { max-width: 320px; }
  .pf__item { grid-template-columns: 40px 1fr; }
  .pf__item-stack { display: none; }
  .pf__nav-links { gap: 18px; }
}
`;

/* ---------- Données (voir src/data/projets.js) ---------- */
const FILTRES = ["Tous", "React", "Spring Boot MVC", "Projets déployés", "Projets Designs"];
const STACK = ["JavaScript", "React", "Node.js", "Express", "Spring Boot", "Java", "PostgreSQL", "JWT", "Git", "Figma"];

/* ---------- Compteur animé ---------- */
function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf, start;
    const dur = 1400;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return val;
}

export default function Accueil() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("Tous");
  const [heroIn, setHeroIn] = useState(false);
  const cursorRef = useRef(null);
  const floatRef = useRef(null);
  const heroRef = useRef(null);

  const projetsVisibles = filtre === "Tous" ? PROJETS : PROJETS.filter((p) => p.cat === filtre);
  const nbProjets = useCountUp(12, heroIn);
  const nbAnnees = useCountUp(3, heroIn);

  /* Polices Google Fonts */
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Archivo:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);

  /* Curseur personnalisé */
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (floatRef.current) {
        floatRef.current.style.left = e.clientX + "px";
        floatRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const setHover = useCallback((on) => {
    cursorRef.current?.classList.toggle("is-hover", on);
  }, []);

  /* Image flottante sur les projets */
  const showFloat = useCallback((img) => {
    if (!floatRef.current) return;
    floatRef.current.style.backgroundImage = `url(${img})`;
    floatRef.current.classList.add("is-on");
    setHover(true);
  }, [setHover]);
  const hideFloat = useCallback(() => {
    floatRef.current?.classList.remove("is-on");
    setHover(false);
  }, [setHover]);

  /* Smooth scroll (Lenis) + animations au scroll (GSAP ScrollTrigger) */
  useEffect(() => {
    setHeroIn(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }

    /* --- Lenis : défilement fluide et inertiel --- */
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* Liens d'ancrage pilotés par Lenis */
    const onNavClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
    };
    document.addEventListener("click", onNavClick);

    const ctx = gsap.context(() => {
      /* Hero : les lignes montent depuis leur masque */
      gsap.from(".pf__line", {
        yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.15,
      });

      /* Sections "reveal" : apparition au scroll */
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onStart: () => el.classList.add("is-in"),
          }
        );
      });

      /* Lignes de projets : stagger à l'entrée */
      gsap.from(".pf__item", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: ".pf__list", start: "top 80%" },
      });

      /* Photo : léger parallaxe */
      gsap.to(".pf__photo", {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: ".pf__about", start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      document.removeEventListener("click", onNavClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="pf">
      <style>{CSS}</style>

      <div className="pf__cursor" ref={cursorRef} />
      <div className="pf__float" ref={floatRef} />

      {/* NAV */}
      <nav className="pf__nav">
        <span className="pf__nav-logo">SYLVANO ©2026</span>
        <div className="pf__nav-links">
          <a href="#projets">Mes projets</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pf__hero" ref={heroRef}>
        <div className="pf__eyebrow">Développeur web · Madagascar</div>
        <h1 className="pf__hero-title" style={{ marginTop: 18 }}>
          <span className="pf__line-mask"><span className="pf__line">Développeur</span></span>
          <span className="pf__line-mask"><span className="pf__line accent">web.</span></span>
        </h1>

        <div className="pf__hero-bottom">
          <p className="pf__hero-lead">
            Je conçois des sites web modernes, <strong>responsives et centrés sur l'utilisateur</strong>.
            De la conception à la réalisation finale, je transforme les idées en expériences
            numériques performantes.
          </p>
          <div className="pf__stats">
            <div>
              <div className="pf__stat-num">{nbProjets}+</div>
              <div className="pf__stat-label">Projets</div>
            </div>
            <div>
              <div className="pf__stat-num">{nbAnnees}</div>
              <div className="pf__stat-label">Ans de code</div>
            </div>
          </div>
        </div>

        <div className="pf__scroll"><span /> Défiler</div>
      </section>

      {/* À PROPOS */}
      <section className="pf__about reveal" id="apropos">
        <div className="pf__eyebrow">À propos</div>
        <div className="pf__about-grid">
          <div className="pf__photo" />
          <div className="pf__about-text">
            <p>
              Développeur orienté <span style={{ color: "var(--accent)" }}>précision</span> et performance.
              <span className="muted"> J'aime quand le code est propre, l'interface fluide et chaque détail intentionnel.</span>
            </p>
            <div className="pf__stack">
              <div className="pf__stack-title">Stack technique</div>
              <div className="pf__tags">
                {STACK.map((t) => (
                  <span className="pf__tag" key={t} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section className="pf__projects reveal" id="projets">
        <div className="pf__projects-head">
          <h2 className="pf__projects-title">Mes projets</h2>
          <div className="pf__filters">
            {FILTRES.map((f) => (
              <button
                key={f}
                className={"pf__filter" + (filtre === f ? " is-active" : "")}
                onClick={() => setFiltre(f)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="pf__list">
          {projetsVisibles.map((p, i) => (
            <div
              className="pf__item"
              key={p.slug}
              role="link"
              tabIndex={0}
              onMouseEnter={() => showFloat(p.img)}
              onMouseLeave={hideFloat}
              onClick={() => { hideFloat(); navigate(`/about/${p.slug}`); }}
              onKeyDown={(e) => { if (e.key === "Enter") navigate(`/about/${p.slug}`); }}
            >
              <span className="pf__item-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="pf__item-name">{p.nom}</div>
              </div>
              <div className="pf__item-stack">
                {p.stack}
                <span className="pf__item-arrow"> ↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="pf__contact reveal" id="contact">
        <div className="pf__eyebrow">Contact</div>
        <h2 className="pf__contact-big" style={{ marginTop: 24 }}>
          Travaillons<br />
          <a href="mailto:sylvano@email.com">ensemble.</a>
        </h2>
        <div className="pf__contact-row">
          <a href="mailto:sylvano@email.com" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>sylvano@email.com</a>
          <a href="https://github.com" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>GitHub</a>
          <a href="https://linkedin.com" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>LinkedIn</a>
        </div>
      </section>

      <footer className="pf__footer">
        <span>© 2026 — Conçu & codé à Antananarivo</span>
        <span>Disponible pour de nouveaux projets</span>
      </footer>
    </div>
  );
}