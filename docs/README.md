# CV Interactif - Charlotte Carpentier

Développeuse web freelance spécialisée en back-end Symfony avec expertise front-end.

## Le projet

CV interactif responsive avec navigation par onglets, tooltips et design personnalisé. Développé pour me démarquer en tant que freelance.

## Fonctionnalités

- Interface responsive (mobile → desktop)
- Navigation par onglets 
- Tooltips détaillant les compétences
- Système visuel de niveaux de maîtrise
- Formulaire de contact intégré
- Respect des standards d'accessibilité

## Stack

- **Générateur** : Eleventy (11ty)
- **CSS** : TailwindCSS
- **Templates** : Nunjucks
- **CMS** : Decap CMS
- **Hébergement** : Netlify
- **Icônes** : Phosphor Icons

## Couleurs

- Vert clair `#C4FFCB` pour les accents
- Vert foncé `#4A7C59` pour les textes (conforme WCAG AA)
- Dégradé de gris pour la hiérarchie

## Responsive

**Mobile** (< 768px) : Menu burger, sections empilées, descriptions complètes affichées

**Tablette portrait** (768-1024px) : Layout hybride, navigation horizontale

**Tablette paysage** (1024-1200px) : Interface proche desktop

**Desktop** (> 1200px) : Layout complet avec tooltips au survol

## Installation

```bash
git clone https://github.com/charlotte-carpentier/cv-charlotte-carpentier.git
cd cv-charlotte-carpentier
npm install
npm run dev
```

## Scripts

```bash
npm run dev          # Développement avec hot reload
npm run build        # Build production
npm run serve        # Prévisualisation
```

## Architecture

```
src/
├── _data/           # Données CV (JSON/YAML)
├── _includes/       
│   ├── layouts/     # Templates de base
│   └── components/  # Composants
├── assets/          
│   ├── css/         # Styles
│   ├── js/          # Scripts
│   └── images/      # Visuels
└── pages/           # Pages
```

## Approche

Ce CV reflète ma vision du développement : combiner technique et créativité. Chaque choix est motivé par l'expérience utilisateur et la démonstration de mes compétences.

La citation de Ruth Bader Ginsburg guide le projet : "Bats-toi pour les choses qui te tiennent à cœur, mais fais-le d'une manière qui donne envie aux autres de te suivre."

## Performances

- Score Lighthouse 100/100
- Conforme WCAG 2.1 niveau AA  
- Core Web Vitals optimisés
- Fonctionne sans JavaScript

## Contact

**Charlotte Carpentier**  
Développeuse Web Freelance  
carpentier.dev@gmail.com  
Marseille

---

Développé à Marseille avec du café et de la détermination.
