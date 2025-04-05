# 🚤 Ma Nautic

**Ma Nautic** est un site vitrine pour un service de location de bateaux en Corse. Développé avec Eleventy, TailwindCSS et Decap CMS, il offre une navigation fluide, un design moderne et permet une gestion simple du contenu pour le client.

---

## 🛠️ Stack technique

- [Eleventy (11ty)](https://www.11ty.dev/) — générateur de site statique
- [Nunjucks](https://mozilla.github.io/nunjucks/) — moteur de templates
- [TailwindCSS v4](https://tailwindcss.com/) — framework CSS utilitaire
- [Decap CMS](https://decapcms.org/) — CMS headless intégré
- Hébergement : [Netlify](https://www.netlify.com/)

---

## 🧑‍💻 Structure (extrait)

Le projet est structuré selon l’architecture **OMA** (Organism / Molecule / Atom) et les composants sont alimentés par des fichiers de données JSON et Markdown.

src/ ├── _includes/ # Composants Nunjucks classés par OMA ├── _data/ # Fichiers JSON pour les contenus dynamiques ├── collection-boats/ # Fichiers Markdown pour chaque bateau ├── collection-carousels/ ├── pages .njk # Pages du site (index, contact, etc.) ├── assets/ # Images, icônes, polices ├── js/ # Scripts JS └── input.css # Fichier Tailwind v4

---

## ✍️ Contenu modifiable par le client

Via **Decap CMS**, le client peut modifier :

- **Les bateaux** : titre, description, photos, tarifs (`collection-boats/*.md`)
- **Les carrousels d’images** : directement intégrés dans chaque fiche bateau (dans le même fichier `.md`)

---

## 🚀 Lancer le projet en local

```bash
npm install
npm run dev
Le site sera accessible sur : http://localhost:8080

🌍 Déploiement
Le site est automatiquement déployé sur Netlify à chaque mise à jour de la branche principale (main).
Le CMS est accessible via /admin.

📌 À propos
Développement : CC

Design : EM (PDF, SVG, textes)

SEO: PC

Technos : Eleventy, Nunjucks, Tailwind v4, Decap CMS

Version actuelle : v1.0.0