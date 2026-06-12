/* =========================================================================
   Données projets — partagées entre Accueil (liste) et About (détail)
   Édite librement. Le `slug` sert d'identifiant dans l'URL (/about/:slug).
   ========================================================================= */

export const PROJETS = [
  {
    slug: "aeronav",
    nom: "AeroNav",
    cat: "Spring Boot MVC",
    stack: "Spring Boot · JPA · PostgreSQL",
    tags: ["Spring Boot", "JPA", "PostgreSQL", "Thymeleaf", "Java"],
    desc: "Application de réservation et planification de navettes aéroportuaires. Centralise les réservations, gère la flotte de véhicules et optimise l'organisation des trajets passagers.",
    annee: "2025",
    role: "Développeur full-stack",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    github: "https://github.com/NathaRHS/Aeronav",
    demo: "",
  },
  {
    slug: "nearbyshop",
    nom: "Nearbyshop",
    cat: "React",
    stack: "React · Vite · API REST",
    tags: ["React", "Vite", "API REST", "Bagisto"],
    desc: "Catalogue e-commerce headless connecté à une API Bagisto. Navigation produits fluide, filtres dynamiques et panier réactif.",
    annee: "2025",
    role: "Développeur front-end",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    github: "https://github.com",
    demo: "https://nearbyshop.me",
  },
  {
    slug: "schooltech",
    nom: "SchoolTech",
    cat: "Projets déployés",
    stack: "React · Node.js · JWT",
    tags: ["React", "Node.js", "Express", "JWT"],
    desc: "Plateforme de gestion scolaire déployée en production. Authentification JWT, tableaux de bord et suivi des étudiants en temps réel.",
    annee: "2024",
    role: "Développeur full-stack",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    slug: "identite-visuelle",
    nom: "Identité Visuelle",
    cat: "Projets Designs",
    stack: "Figma · Design system",
    tags: ["Figma", "Design system", "UI/UX"],
    desc: "Système de design complet : grille typographique, composants réutilisables et maquettes haute-fidélité orientées conversion.",
    annee: "2024",
    role: "Designer UI",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    github: "https://github.com",
    demo: "",
  },
];

export const getProjet = (slug) => PROJETS.find((p) => p.slug === slug);
