import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getProjet } from "./data/projets";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================================
   ABOUT — page détail d'un projet
   Même direction artistique que Accueil ("Precision in Motion").
   ========================================================================= */

const CSS = `
.ab {
  --bg: #ffffff; --ink: #0a0a0a; --muted: #6b6b6b; --line: #e6e6e6;
  --accent: #ff4d2e;
  --font-display: "Syne", sans-serif;
  --font-body: "Archivo", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  background: var(--bg); color: var(--ink); font-family: var(--font-body);
  min-height: 100vh; position: relative; overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.ab * { box-sizing: border-box; }
.ab section { padding: 0 6vw; }

.ab__eyebrow {
  font-family: var(--font-mono); font-size: 12px; letter-spacing: .18em;
  text-transform: uppercase; color: var(--muted);
  display: flex; align-items: center; gap: 12px;
}
.ab__eyebrow::before { content: ""; width: 28px; height: 1px; background: var(--accent); }

/* Nav retour */
.ab__nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 26px 6vw; background: rgba(255,255,255,.8); backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.ab__back {
  font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em;
  color: var(--ink); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
}
.ab__back .ar { transition: transform .35s; display: inline-block; }
.ab__back:hover .ar { transform: translateX(-5px); }
.ab__nav-logo { font-family: var(--font-mono); font-size: 14px; letter-spacing: .04em; color: var(--muted); }

/* Header */
.ab__head { padding-top: 9vh; padding-bottom: 5vh; }
.ab__title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(46px, 11vw, 150px); line-height: .92; letter-spacing: -0.03em;
  margin-top: 18px;
}
.ab__line-mask { display: block; overflow: hidden; padding-bottom: .04em; }
.ab__line { display: block; will-change: transform; }

.ab__meta {
  margin-top: 40px; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 28px; border-top: 1px solid var(--line); padding-top: 28px;
}
.ab__meta-k { font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.ab__meta-v { font-family: var(--font-display); font-weight: 600; font-size: clamp(16px, 1.6vw, 20px); }

/* Visuel */
.ab__visual {
  margin: 6vh 0; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden;
  background-size: cover; background-position: center; background-color: #f0f0ee;
}

/* Corps */
.ab__body { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6vw; align-items: start; padding-bottom: 8vh; }
.ab__lead { font-family: var(--font-display); font-weight: 500; font-size: clamp(22px, 2.6vw, 36px); line-height: 1.35; letter-spacing: -0.01em; }
.ab__stack-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
.ab__tags { display: flex; flex-wrap: wrap; gap: 10px; }
.ab__tag { font-family: var(--font-mono); font-size: 13px; padding: 8px 14px; border: 1px solid var(--line); border-radius: 100px; transition: border-color .25s; }
.ab__tag:hover { border-color: var(--ink); }

.ab__actions { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 14px; }
.ab__btn {
  font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em;
  padding: 14px 24px; border-radius: 100px; text-decoration: none;
  border: 1px solid var(--ink); transition: all .25s; display: inline-flex; align-items: center; gap: 8px;
}
.ab__btn--solid { background: var(--ink); color: var(--bg); }
.ab__btn--solid:hover { background: var(--accent); border-color: var(--accent); }
.ab__btn--ghost { color: var(--ink); }
.ab__btn--ghost:hover { border-color: var(--accent); color: var(--accent); }

.ab__footer { padding: 36px 6vw; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

.ab__notfound { min-height: 70vh; display: grid; place-items: center; text-align: center; }
.ab__notfound h1 { font-family: var(--font-display); font-weight: 800; font-size: clamp(30px, 6vw, 70px); margin-bottom: 20px; }

.reveal { opacity: 0; }

@media (max-width: 820px) {
  .ab__body { grid-template-columns: 1fr; gap: 40px; }
}
`;

export default function About() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const projet = getProjet(slug);
  const rootRef = useRef(null);

  /* Polices Google Fonts (mêmes que Accueil) */
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Archivo:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);

  /* Animations d'entrée + reveals au scroll (même niveau qu'Accueil) */
  useEffect(() => {
    if (!projet) return;
    window.scrollTo(0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      rootRef.current?.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
      return;
    }

    const ctx = gsap.context(() => {
      /* Titre : lignes qui montent depuis leur masque */
      gsap.from(".ab__line", {
        yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.1,
      });

      /* Méta + visuel : apparition douce */
      gsap.from([".ab__meta", ".ab__visual"], {
        opacity: 0, y: 40, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.3,
      });

      /* Sections reveal au scroll */
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [projet, slug]);

  if (!projet) {
    return (
      <div className="ab" ref={rootRef}>
        <style>{CSS}</style>
        <div className="ab__notfound">
          <div>
            <h1>Projet introuvable</h1>
            <button className="ab__btn ab__btn--solid" onClick={() => navigate("/")}>
              <span className="ar">←</span> Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ab" ref={rootRef}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="ab__nav">
        <Link to="/" className="ab__back"><span className="ar">←</span> Retour</Link>
        <span className="ab__nav-logo">SYLVANO ©2026</span>
      </nav>

      {/* HEADER */}
      <section className="ab__head">
        <div className="ab__eyebrow">{projet.cat}</div>
        <h1 className="ab__title">
          <span className="ab__line-mask"><span className="ab__line">{projet.nom}</span></span>
        </h1>

        <div className="ab__meta">
          <div>
            <div className="ab__meta-k">Année</div>
            <div className="ab__meta-v">{projet.annee}</div>
          </div>
          <div>
            <div className="ab__meta-k">Rôle</div>
            <div className="ab__meta-v">{projet.role}</div>
          </div>
          <div>
            <div className="ab__meta-k">Stack</div>
            <div className="ab__meta-v">{projet.stack}</div>
          </div>
        </div>
      </section>

      {/* VISUEL */}
      <section>
        <div className="ab__visual" style={{ backgroundImage: `url(${projet.img})` }} />
      </section>

      {/* CORPS */}
      <section className="ab__body reveal">
        <div>
          <div className="ab__stack-title">À propos du projet</div>
          <div className="ab__tags">
            {projet.tags.map((t) => (
              <span className="ab__tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="ab__lead">{projet.desc}</p>
          <div className="ab__actions">
            {projet.github && (
              <a className="ab__btn ab__btn--solid" href={projet.github} target="_blank" rel="noreferrer">
                Voir le repo GitHub ↗
              </a>
            )}
            {projet.demo && (
              <a className="ab__btn ab__btn--ghost" href={projet.demo} target="_blank" rel="noreferrer">
                Voir le site déployé ↗
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="ab__footer">
        <span>© 2026 — Conçu & codé à Antananarivo</span>
        <Link to="/" className="ab__back" style={{ color: "var(--muted)" }}>
          <span className="ar">←</span> Tous les projets
        </Link>
      </footer>
    </div>
  );
}
