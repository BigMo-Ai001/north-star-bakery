/* North Star Bakery — Touchstone 4 interactivity */
"use strict";

const bakeryProducts = [
  { id: "pastries", name: "Golden Pastries", emoji: "🥐", description: "Flaky, buttery and baked to golden perfection." },
  { id: "bread", name: "Freshly Baked Bread", emoji: "🍞", description: "Soft, comforting bread for every occasion." },
  { id: "cakes", name: "Celebration Cakes", emoji: "🎂", description: "Sweet creations for your unforgettable moments." }
];

const validationRules = [
  { field: "name", test: value => value.trim().length >= 2, message: "Please enter your name (at least 2 characters)." },
  { field: "email", test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: "Enter a valid email address, such as name@example.com." },
  { field: "message", test: value => value.trim().length >= 10, message: "Please enter a message of at least 10 characters." }
];

const storageKeys = {
  favourites: "northStarBakeryFavourites",
  contactDraft: "northStarBakeryContactDraft"
};

function readStoredJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn("Saved bakery data could not be read.", error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Bakery data could not be saved in this browser.", error);
  }
}

function getFavouriteIds() {
  const saved = readStoredJSON(storageKeys.favourites, []);
  return Array.isArray(saved) ? saved.filter(id => bakeryProducts.some(product => product.id === id)) : [];
}

function renderFavourites() {
  const favouriteIds = getFavouriteIds();
  document.querySelectorAll("[data-favourite-id]").forEach(button => {
    const isFavourite = favouriteIds.includes(button.dataset.favouriteId);
    button.setAttribute("aria-pressed", String(isFavourite));
    button.textContent = isFavourite ? "♥ Saved to favourites" : "♡ Add to favourites";
    button.classList.toggle("is-favourite", isFavourite);
  });

  const count = document.getElementById("favourite-count");
  if (count) {
    count.textContent = String(favouriteIds.length);
  }

  const summary = document.getElementById("favourite-summary");
  if (summary) {
    if (favouriteIds.length === 0) {
      summary.textContent = "Your favourites will appear here when you save a bakery treat.";
    } else {
      const names = bakeryProducts
        .filter(product => favouriteIds.includes(product.id))
        .map(product => product.name);
      summary.textContent = "You saved: " + names.join(", ") + ".";
    }
  }
}

function toggleFavourite(productId) {
  const favouriteIds = getFavouriteIds();
  const nextIds = favouriteIds.includes(productId)
    ? favouriteIds.filter(id => id !== productId)
    : [...favouriteIds, productId];

  saveJSON(storageKeys.favourites, nextIds);
  renderFavourites();
}

function initialiseFavourites() {
  document.querySelectorAll("[data-favourite-id]").forEach(button => {
    button.addEventListener("click", () => toggleFavourite(button.dataset.favouriteId));
  });
  renderFavourites();
}

function showFieldError(field, message) {
  const input = document.getElementById(field);
  const error = document.getElementById(field + "-error");
  if (!input || !error) return;

  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateContactForm(form) {
  let isValid = true;

  validationRules.forEach(rule => {
    const input = form.elements.namedItem(rule.field);
    const value = input ? input.value : "";
    const passes = rule.test(value);
    showFieldError(rule.field, passes ? "" : rule.message);
    if (!passes) isValid = false;
  });

  return isValid;
}

function saveContactDraft(form) {
  const draft = {
    name: form.elements.namedItem("name").value,
    email: form.elements.namedItem("email").value,
    message: form.elements.namedItem("message").value
  };
  saveJSON(storageKeys.contactDraft, draft);
}

function restoreContactDraft(form) {
  const draft = readStoredJSON(storageKeys.contactDraft, {});
  ["name", "email", "message"].forEach(field => {
    if (typeof draft[field] === "string") {
      form.elements.namedItem(field).value = draft[field];
    }
  });

  const notice = document.getElementById("draft-notice");
  if (notice && ["name", "email", "message"].some(field => Boolean(draft[field]))) {
    notice.textContent = "Your saved draft has been restored from this browser.";
  }
}

function initialiseContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  restoreContactDraft(form);

  ["name", "email", "message"].forEach(field => {
    form.elements.namedItem(field).addEventListener("input", () => {
      showFieldError(field, "");
      saveContactDraft(form);
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const status = document.getElementById("form-status");

    if (!validateContactForm(form)) {
      status.textContent = "Please correct the highlighted fields. Your entries have been kept.";
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "Thank you, " + form.elements.name.value.trim() +
      ". Your message passed validation. This learning project stores the draft in your browser; it does not send email.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialiseFavourites();
  initialiseContactForm();
});
