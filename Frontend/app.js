const products = [
  {
    id: "hardware",
    name: "Hardware & Fasteners",
    category: "Hardware",
    image: "assets/harware.png",
    price: "₹25 / piece",
    priceAmount: 25,
    priceReference: "M8 x 25 mm SS 304 hex bolt (Aajjo)",
    brands: [],
    description: "Hardware and fasteners for construction, maintenance and repair requirements. Contact the store to confirm available product types, specifications and pricing."
  },
  {
    id: "sanitary",
    name: "Sanitary Wares & Plumbing",
    category: "Plumbing",
    image: "assets/pipe.PNG",
    price: "₹890 / set",
    priceAmount: 890,
    priceReference: "Parryware E8372A1 health faucet (Flipkart)",
    brands: ["parryware"],
    description: "Sanitary ware and plumbing products for residential and project requirements. Contact the store to confirm current models, specifications and pricing."
  },
  {
    id: "paints",
    name: "Paints & Coatings",
    category: "Paints",
    image: "assets/paint.png",
    price: "₹4,150 / 20 L",
    priceAmount: 4150,
    priceReference: "Asian Paints Tractor 0057 white (IndustryBuying)",
    brands: ["asian-paints", "berger"],
    description: "Paints and coatings for project finishing. Computerized paint mixing is available in store; contact the team to confirm product options, shade requirements and pricing."
  },
  {
    id: "power-tools",
    name: "Power Tools",
    category: "Tools",
    image: "assets/power.png",
    price: "₹4,694 / kit",
    priceAmount: 4694,
    priceReference: "Bosch GSB 550 Freedom kit (Snapdeal)",
    brands: ["bosch", "stanley", "dewalt", "black-decker"],
    description: "Power tools for project, repair and maintenance requirements. Speak with the store team to identify a suitable product from the available range."
  },
  {
    id: "electrical",
    name: "Electrical Supplies",
    category: "Electrical",
    image: "assets/electrical.png",
    price: "₹2,820 / 90 m",
    priceAmount: 2820,
    priceReference: "Havells LifeLine Plus S3, 1.5 sq mm (IndiaMART)",
    brands: [],
    description: "Electrical supplies for home and project requirements. Contact the store to confirm product specifications, availability and pricing."
  },
  {
    id: "security",
    name: "Hardware & Security",
    category: "Security",
    image: "assets/lo.webp",
    price: "₹860 / lock",
    priceAmount: 860,
    priceReference: "Godrej Nav-Tal 65 mm, 7 lever (Flipkart)",
    brands: [],
    description: "Hardware and security products for home and project requirements. Contact the store to confirm available product types and pricing."
  }
];

const cartKey = "shasha-cart";
const wishlistKey = "shasha-wishlist";
const whatsappNumber = "919042310035";

// Read a saved array from localStorage and return a safe empty list if the saved value is missing or invalid.
function readStoredArray(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new TypeError(`Saved ${key} data is invalid.`);
    return parsed;
  } catch (error) {
    showNotice(`Saved ${key.replace("shasha-", "")} data could not be read. ${error.message}`, true);
    return [];
  }
}

// Load the current cart from storage, remove invalid entries, and normalize each item quantity.
function getCart() {
  return readStoredArray(cartKey)
    .filter((entry) => products.some((product) => product.id === entry.id))
    .map((entry) => ({
      id: entry.id,
      quantity: Number.isInteger(entry.quantity) && entry.quantity > 0 ? entry.quantity : 1
    }));
}

// Save the cart to localStorage and refresh the cart badge counts shown in the header.
function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartBadges(cart);
}

// Display a temporary site-wide notice for user feedback, including an error style when needed.
function showNotice(message, isError = false) {
  let notice = document.querySelector("[data-site-notice]");
  if (!notice) {
    notice = document.createElement("p");
    notice.dataset.siteNotice = "";
    notice.className = "site-notice";
    notice.setAttribute("role", "status");
    document.querySelector("main")?.prepend(notice);
  }
  notice.textContent = message;
  notice.classList.toggle("is-error", isError);
}

// Update the cart counter badges across the page to reflect the total number of items in the cart.
function updateCartBadges(cart) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".header-actions .badge").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

// Find the matching product entry for a DOM card using either its data attribute or its title text.
function productForCard(card) {
  const id = card.id || card.querySelector("[data-product-id]")?.dataset.productId;
  if (id) return products.find((product) => product.id === id);
  const title = card.querySelector("h3")?.textContent.trim().toLowerCase();
  return products.find((product) => product.name.toLowerCase() === title);
}

// Bind each product card to its correct product page and wishlist state so the catalog links work consistently.
function setupProductLinks() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const product = productForCard(card);
    if (!product) return;
    card.dataset.productId = product.id;
    const price = card.querySelector(".price");
    if (price) {
      price.textContent = product.price;
      let reference = card.querySelector(".price-reference");
      if (!reference) {
        reference = document.createElement("small");
        reference.className = "price-reference";
        price.insertAdjacentElement("afterend", reference);
      }
      reference.textContent = `Reference: ${product.priceReference}`;
    }
    const detailsLink = card.querySelector('a[href^="product.html"]');
    if (detailsLink) detailsLink.href = `product.html?item=${encodeURIComponent(product.id)}`;
    const wishlistLink = card.querySelector(".wish");
    if (wishlistLink) {
      wishlistLink.dataset.wishlist = product.id;
      wishlistLink.setAttribute("aria-label", `Add ${product.name} to wishlist`);
    }
  });
}

// Attach wishlist toggle behavior to all wishlist buttons and persist the saved product IDs in localStorage.
function setupWishlist() {
  const wishlist = new Set(readStoredArray(wishlistKey).filter((id) => products.some((product) => product.id === id)));
  document.querySelectorAll("[data-wishlist]").forEach((button) => {
    const id = button.dataset.wishlist;
    const product = products.find((entry) => entry.id === id);
    if (!product) return;
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
    const render = () => {
      const saved = wishlist.has(id);
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", `${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`);
    };
    render();
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (wishlist.has(id)) wishlist.delete(id);
      else wishlist.add(id);
      try {
        localStorage.setItem(wishlistKey, JSON.stringify([...wishlist]));
      } catch (error) {
        showNotice(`Your wishlist could not be saved in this browser. ${error.message}`, true);
        return;
      }
      render();
      showNotice(`${product.name} ${wishlist.has(id) ? "saved to" : "removed from"} your wishlist.`);
      if (document.querySelector("[data-wishlist-items]")) renderWishlist();
    });
  });
}

// Generate the wishlist page content from saved product IDs and rebind the wishlist interaction handlers.
function renderWishlist() {
  const grid = document.querySelector("[data-wishlist-items]");
  if (!grid) return;
  const savedIds = new Set(readStoredArray(wishlistKey));
  const savedProducts = products.filter((product) => savedIds.has(product.id));
  grid.replaceChildren();
  savedProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;
    card.innerHTML = `<button class="wish is-saved" type="button" data-wishlist="${product.id}" aria-pressed="true" aria-label="Remove ${product.name} from wishlist">♡</button><div class="product-image"><img src="${product.image}" alt="${product.name}"></div><span class="product-label">${product.category}</span><h3>${product.name}</h3><p class="price">${product.price}</p><small class="price-reference">Reference: ${product.priceReference}</small><a class="button button-primary" href="product.html?item=${product.id}">View Details</a>`;
    grid.append(card);
  });
  const empty = document.querySelector("[data-wishlist-empty]");
  if (empty) empty.hidden = savedProducts.length > 0;
  setupWishlist();
}

// Apply category, brand, price, and search filtering to the shop catalog while preserving the original display order.
function setupFilters() {
  const grid = document.querySelector(".shop-products");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".product-card")];
  const checkboxes = [...document.querySelectorAll(".filter-panel input[type=checkbox]")];
  const requestedCategory = new URLSearchParams(window.location.search).get("category") || window.location.hash.slice(1);
  const categoryFilter = checkboxes.find((input) => input.dataset.filterCategory === requestedCategory);
  if (categoryFilter) categoryFilter.checked = true;
  const originalOrder = new Map(cards.map((card, index) => [card, index]));
  const search = new URLSearchParams(window.location.search).get("q")?.trim().toLowerCase() || "";
  const priceSelect = document.querySelector(".filter-panel select");
  const sortSelect = document.querySelector(".sort-select");
  const count = document.querySelector(".catalogue-head p");
  const apply = () => {
    const selectedCategories = checkboxes.filter((input) => input.checked && input.dataset.filterCategory).map((input) => input.dataset.filterCategory);
    const selectedBrands = checkboxes.filter((input) => input.checked && input.dataset.filterBrand).map((input) => input.dataset.filterBrand);
    const priceBand = priceSelect?.value || "";
    const priceBands = {
      "under-500": [0, 499],
      "500-1999": [500, 1999],
      "2000-plus": [2000, Infinity]
    };
    const visible = [];
    cards.forEach((card) => {
      const product = products.find((entry) => entry.id === card.dataset.productId);
      if (!product) return;
      const matches = (!selectedCategories.length || selectedCategories.includes(product.id))
        && (!selectedBrands.length || selectedBrands.some((brand) => product.brands.includes(brand)))
        && (!priceBand || (product.priceAmount >= priceBands[priceBand][0] && product.priceAmount <= priceBands[priceBand][1]))
        && (!search || `${product.name} ${product.category} ${product.brands.join(" ").replaceAll("-", " ")}`.toLowerCase().includes(search));
      card.hidden = !matches;
      if (matches) visible.push(card);
    });
    if (sortSelect?.selectedIndex === 1) {
      visible.sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent));
      visible.forEach((card) => grid.append(card));
    } else {
      cards.sort((a, b) => originalOrder.get(a) - originalOrder.get(b)).forEach((card) => grid.append(card));
    }
    const noResults = document.querySelector("[data-no-results]");
    if (noResults) noResults.hidden = visible.length > 0;
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "product group" : "product groups"} available for enquiry.`;
  };
  checkboxes.forEach((input) => input.addEventListener("change", apply));
  priceSelect?.addEventListener("change", apply);
  sortSelect?.addEventListener("change", apply);
  if (search) {
    const input = document.querySelector(".search input[type=search]");
    if (input) input.value = search;
  }
  apply();
}

// Fill the product detail page with the selected product information, thumbnail gallery, and brand-specific images.
function setupProductPage() {
  const page = document.querySelector("[data-product-page]");
  if (!page) return;
  page.querySelector(".detail-tabs")?.remove();
  page.querySelectorAll('#related-products .product-card a[href^="shop.html#"]').forEach((link) => {
    const relatedProductId = link.hash.slice(1);
    if (!products.some((entry) => entry.id === relatedProductId)) return;
    link.href = `product.html?item=${encodeURIComponent(relatedProductId)}`;
    link.textContent = "View Details";
  });
  const requestedId = new URLSearchParams(window.location.search).get("item") || "power-tools";
  const product = products.find((entry) => entry.id === requestedId) || products.find((entry) => entry.id === "power-tools");
  const brandNames = {
    "asian-paints": "assets/asiann.png",
    berger: "assets/berger.png",
    bosch: "assets/Robert_Bosch_GmbH-Logo.wine.png",
    stanley: "assets/Stanley_logo_PNG3.png",
    dewalt: "assets/dewalt-seeklogo.png",
    "black-decker": "assets/blackdecker.png",
    parryware: "assets/parryware-brand.png"
  };
  const heroTitle = document.querySelector(".page-hero h1");
  const breadcrumb = document.querySelector(".page-hero .breadcrumb");
  const title = page.querySelector(".product-meta h1");
  const image = page.querySelector(".product-gallery-main img");
  const price = page.querySelector(".detail-price");
  const description = page.querySelector(".product-meta > p:not(.brand-name):not(.detail-price)");
  if (!title || !image || !price || !description) return;

  document.title = `${product.name} | Shasha Enterprises`;
  if (heroTitle) heroTitle.textContent = product.name;
  if (breadcrumb?.lastChild?.nodeType === Node.TEXT_NODE) breadcrumb.lastChild.textContent = ` / ${product.name}`;
  title.textContent = product.name;
  page.querySelector(".brand-name").textContent = product.category;
  image.src = product.image;
  image.alt = product.name;
  price.textContent = product.price;
  let priceReference = page.querySelector(".product-meta .price-reference");
  if (!priceReference) {
    priceReference = document.createElement("small");
    priceReference.className = "price-reference";
    price.insertAdjacentElement("afterend", priceReference);
  }
  priceReference.textContent = `Reference item: ${product.priceReference}`;
  description.textContent = product.description;
  const detailCopy = page.querySelector("#details > p");
  if (detailCopy) detailCopy.textContent = product.description;
  const specs = page.querySelector(".specs");
  if (specs) {
    const brandDescription = product.brands.length
      ? product.brands.map((brand) => brand.replace("-", " ")).join(", ")
      : "Ask the store team for available brands and models.";
    specs.innerHTML = `<dt>Category</dt><dd>${product.category}</dd><dt>Brand availability</dt><dd>${brandDescription}</dd><dt>Reference price</dt><dd>${product.price}</dd><dt>Reference item</dt><dd>${product.priceReference}</dd><dt>Product support</dt><dd>Confirm the matching brand, model, size and current store price before purchase.</dd>`;
  }
  const thumbnails = page.querySelector(".thumbnails");
  if (thumbnails) {
    thumbnails.replaceChildren();
    [product.image, ...product.brands.map((brand) => brandNames[brand]).filter(Boolean)].slice(0, 4).forEach((src, index) => {
      const thumbnail = document.createElement("button");
      thumbnail.type = "button";
      thumbnail.className = `thumbnail${index === 0 ? " is-active" : ""}`;
      thumbnail.setAttribute("aria-label", index === 0 ? `Show ${product.name}` : `Show ${product.brands[index - 1]} brand`);
      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = src;
      thumbnailImage.alt = index === 0 ? product.name : `${product.brands[index - 1]} brand`;
      thumbnail.append(thumbnailImage);
      thumbnail.addEventListener("click", () => {
        image.src = src;
        image.alt = thumbnailImage.alt;
        thumbnails.querySelectorAll(".thumbnail").forEach((button) => button.classList.toggle("is-active", button === thumbnail));
      });
      thumbnails.append(thumbnail);
    });
  }
  page.querySelectorAll("[data-add-to-cart], [data-buy-now]").forEach((button) => {
    button.dataset.productId = product.id;
  });
}

// Add the quantity stepper behavior to product quantity controls so users can increase or decrease counts.
function setupQuantities() {
  document.querySelectorAll(".quantity").forEach((control) => {
    const output = control.querySelector("output");
    if (!output) return;
    control.querySelectorAll("button").forEach((button, index) => {
      button.addEventListener("click", () => {
        const current = Number.parseInt(output.value || output.textContent, 10);
        const next = Math.max(1, current + (index === 0 ? -1 : 1));
        output.value = String(next);
        output.textContent = String(next);
      });
    });
  });
}

// Add one or more units of a product to the cart and merge them with any existing same-product entry.
function addToCart(id, quantity) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id, quantity });
  saveCart(cart);
}

// Send product add-to-cart and buy-now actions through validation and cart updates before redirecting to checkout if needed.
function setupCartButtons() {
  document.querySelectorAll("[data-add-to-cart], [data-buy-now]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const id = button.dataset.productId;
      const quantity = Number.parseInt(button.closest(".product-detail")?.querySelector(".quantity output")?.textContent || "1", 10);
      if (!products.some((product) => product.id === id) || !Number.isInteger(quantity) || quantity < 1) {
        showNotice("This product could not be added. Please select a valid product and quantity.", true);
        return;
      }
      try {
        addToCart(id, quantity);
        showNotice(`${products.find((product) => product.id === id).name} added to your cart.`);
        if (button.hasAttribute("data-add-to-cart")) {
          button.classList.remove("is-added");
          void button.offsetWidth;
          button.classList.add("is-added");
          document.querySelectorAll('.header-actions .icon-link[aria-label="View shopping cart"]').forEach((cartLink) => {
            cartLink.classList.remove("is-cart-updated");
            void cartLink.offsetWidth;
            cartLink.classList.add("is-cart-updated");
          });
        }
        if (button.hasAttribute("data-buy-now")) window.location.assign("checkout.html");
      } catch (error) {
        showNotice(`Your cart could not be saved in this browser. ${error.message}`, true);
      }
    });
  });
}

// Rebuild the cart page from the saved cart data and add controls for quantity changes and item removal.
function renderCart() {
  const cartList = document.querySelector(".cart-list");
  if (!cartList) return;
  const cart = getCart();
  cartList.replaceChildren();
  cartList.dataset.cartItems = "";
  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.innerHTML = '<h2>Your cart is empty</h2><p>Browse the product categories and add items to start an enquiry.</p><a class="button button-primary" href="shop.html">Explore the catalogue</a>';
    cartList.append(empty);
  } else {
    cart.forEach((item) => {
      const product = products.find((entry) => entry.id === item.id);
      const row = document.createElement("article");
      row.className = "cart-row";
      row.dataset.cartItem = product.id;
      row.innerHTML = `<div class="cart-thumb"><img src="${product.image}" alt="${product.name}"></div><div><h2>${product.name}</h2><p>${product.category}</p><div class="cart-controls"><div class="quantity" aria-label="Quantity for ${product.name}"><button type="button" data-quantity="-1" aria-label="Decrease ${product.name} quantity">−</button><output>${item.quantity}</output><button type="button" data-quantity="1" aria-label="Increase ${product.name} quantity">+</button></div><button class="remove-link" type="button" data-remove-item="${product.id}">Remove</button></div></div><p class="cart-price">${product.price}</p>`;
      cartList.append(row);
    });
  }
  updateCartBadges(cart);
  const lines = document.querySelector(".cart-layout .summary-lines");
  if (lines) {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    lines.innerHTML = `<div><span>Products</span><span>${itemCount} ${itemCount === 1 ? "item" : "items"}</span></div><div><span>Subtotal</span><span>Price on Request</span></div><div><span>Delivery</span><span>Confirmed at enquiry</span></div><div class="summary-total"><span>Total</span><span>Price on Request</span></div>`;
  }
  const checkout = document.querySelector('.cart-layout a[href="checkout.html"]');
  if (checkout) {
    checkout.hidden = !cart.length;
    checkout.setAttribute("aria-disabled", String(!cart.length));
  }
  cartList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeId = target.dataset.removeItem;
    if (removeId) {
      try {
        saveCart(getCart().filter((item) => item.id !== removeId));
        renderCart();
      } catch (error) {
        showNotice(`Your cart could not be updated. ${error.message}`, true);
      }
      return;
    }
    const quantityChange = target.closest("[data-quantity]");
    if (!quantityChange) return;
    const row = quantityChange.closest("[data-cart-item]");
    const item = getCart().find((entry) => entry.id === row?.dataset.cartItem);
    if (!item) return;
    const delta = Number.parseInt(quantityChange.dataset.quantity || "0", 10);
    if (item.quantity + delta < 1) return;
    item.quantity += delta;
    try {
      saveCart(getCart().map((entry) => entry.id === item.id ? item : entry));
      renderCart();
    } catch (error) {
      showNotice(`Your cart could not be updated. ${error.message}`, true);
    }
  }, { once: true });
}

// Show the checkout summary from the current cart and disable submission when the cart is empty.
function renderCheckout() {
  const summary = document.querySelector(".checkout-layout .summary-lines");
  if (!summary) return;
  const cart = getCart();
  if (!cart.length) {
    summary.innerHTML = '<p>Your cart is empty. Add products before sending an order request.</p>';
    const submit = document.querySelector('.checkout-layout button[type="submit"]');
    if (submit) submit.disabled = true;
    showNotice("Your cart is empty. Add products before checkout.", true);
    return;
  }
  const items = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<div><span>${product.name}</span><span>Qty ${item.quantity} · ${product.price}</span></div>`;
  }).join("");
  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.priceAmount * item.quantity;
  }, 0);
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(total);
  summary.innerHTML = `${items}<div><span>Subtotal</span><span>${formattedTotal}</span></div><div><span>Delivery</span><span>Confirmed at enquiry</span></div><div class="summary-total"><span>Grand Total</span><span>${formattedTotal}</span></div>`;
  updateCartBadges(cart);
}

// Open WhatsApp with a pre-filled enquiry message using the store contact number.
function openWhatsApp(message) {
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
}

// Handle contact and checkout form submissions by validating them and sending the collected data to WhatsApp.
function setupForms() {
  document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;
    const fields = new FormData(form);
    openWhatsApp([
      "Product enquiry for Shasha Enterprises",
      `Name: ${fields.get("name")}`,
      `Email: ${fields.get("email")}`,
      `Phone: ${fields.get("phone")}`,
      `Subject: ${fields.get("subject")}`,
      `Message: ${fields.get("message")}`
    ].join("\n"));
  });
}

// Initialize the storefront when the page loads by wiring navigation, cart state, product links, filters, and form handlers.
document.addEventListener("DOMContentLoaded", () => {
  // Replace legacy text glyphs with the shared SVG cart and account icons on every page.
  document.querySelectorAll('.header-actions .icon-link[aria-label="View shopping cart"]').forEach((link) => {
    if (link.querySelector("svg")) return;
    const badge = link.querySelector(".badge")?.outerHTML ?? '<span class="badge">0</span>';
    link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2l2.3 11.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>' + badge + "<span>Cart</span>";
  });
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  document.querySelectorAll('.header-actions .icon-link[aria-label="Contact Shasha Enterprises"]').forEach((link) => {
    const signedOutIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
    const signedInIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><circle cx="18" cy="18" r="4.5" fill="#2f7546" stroke="white" stroke-width="1.5"/><path d="m15.8 18 1.4 1.4 2.8-2.9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    link.innerHTML = `${isAuthenticated ? signedInIcon : signedOutIcon}<span>Account</span>`;
    link.href = "login.html";
    link.classList.toggle("is-authenticated", isAuthenticated);
    link.setAttribute("aria-label", isAuthenticated ? "Signed in. View account details" : "Sign in to your account");
    link.title = isAuthenticated ? "Signed in. View account details" : "Sign in to your account";
  });
  document.querySelectorAll(".header-actions .icon-link:first-child").forEach((link) => {
    link.href = "wishlist.html";
    link.classList.add("wishlist-nav-link");
    link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg><span>Wishlist</span>';
    link.setAttribute("aria-label", "View wishlist");
    link.title = "View wishlist";
  });
  const navigation = document.querySelector(".primary-nav");
  const shopButton = navigation?.querySelector(".shop-now");
  if (navigation && !navigation.querySelector('a[href="wishlist.html"]')) {
    const wishlistLink = document.createElement("a");
    wishlistLink.href = "wishlist.html";
    wishlistLink.textContent = "Wishlist";
    navigation.insertBefore(wishlistLink, shopButton || null);
  }
  setupProductLinks();
  updateCartBadges(getCart());
  setupWishlist();
  setupFilters();
  setupProductPage();
  setupQuantities();
  setupCartButtons();
  renderCart();
  renderCheckout();
  renderWishlist();
  setupForms();
});
