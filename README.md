# North Star Bakery — Touchstone 4

A responsive bakery website built with HTML, CSS, and vanilla JavaScript.

## Live website
https://bigmo-ai001.github.io/north-star-bakery/

## GitHub repository
https://github.com/BigMo-Ai001/north-star-bakery

## Touchstone 4 features
- **Product favourites:** On the homepage, choose “Add to favourites” for Golden Pastries, Freshly Baked Bread, or Celebration Cakes. The button, count, and summary update immediately.
- **Persistent favourites:** Selected products are saved in browser `localStorage` and restored when the homepage is reopened.
- **Contact form validation:** The form checks the name length, email format, and message length. Invalid entries show feedback beside the relevant field, and submission is prevented.
- **Saved contact draft:** The name, email, and message are saved as a local draft and restored on the Contact page.
- **Responsive design:** The existing cream, brown, peach, and charcoal visual style is retained for desktop and mobile layouts.

## Project files
- `index.html` — bakery homepage and interactive product favourites.
- `about.html` — bakery story and values.
- `contact.html` — contact form, field validation, and draft restoration.
- `styles.css` — shared visual styling and responsive layout.
- `script.js` — interactive behaviour, validation rules, and browser storage.

## Important note
This is a front-end learning project. The contact form validates and saves a draft in the visitor's browser; it does not send an email because no server-side form service is connected.
