
const foods = [
  {id:1, name:"Paneer Tikka Bowl", shop:"The Green Tiffin", price:159, category:"Indian", rating:4.8, emoji:"🍛", bg:"#f5e6c9"},
  {id:2, name:"Veg Momos", shop:"Momo Junction", price:99, category:"Snacks", rating:4.7, emoji:"🥟", bg:"#e5efdc"},
  {id:3, name:"Classic Burger", shop:"Burger Adda", price:179, category:"Fast Food", rating:4.6, emoji:"🍔", bg:"#f7dfc9"},
  {id:4, name:"Masala Dosa", shop:"South Side Cafe", price:129, category:"Indian", rating:4.9, emoji:"🥞", bg:"#f2e9c9"},
  {id:5, name:"Chilli Potato", shop:"The Snack Stop", price:109, category:"Snacks", rating:4.5, emoji:"🍟", bg:"#f8e3d8"},
  {id:6, name:"Cold Coffee", shop:"Bean & Bloom", price:89, category:"Drinks", rating:4.8, emoji:"🥤", bg:"#e2ece6"},
  {id:7, name:"Veg Biryani", shop:"The Green Tiffin", price:149, category:"Indian", rating:4.7, emoji:"🍲", bg:"#f3e3c5"},
  {id:8, name:"Chocolate Shake", shop:"Bean & Bloom", price:119, category:"Drinks", rating:4.6, emoji:"🍫", bg:"#eee0d9"}
];

let selectedCategory = "All";
let searchQuery = "";
const cart = {};

const $ = (selector) => document.querySelector(selector);

function money(amount) {
  return "₹" + amount;
}

function renderFoods() {
  const filtered = foods.filter(food => {
    const categoryMatches =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const text = `${food.name} ${food.shop} ${food.category}`.toLowerCase();
    const searchMatches = text.includes(searchQuery.toLowerCase());

    return categoryMatches && searchMatches;
  });

  $("#foodGrid").innerHTML = filtered.map(food => `
    <article class="food-card">
      <div class="food-picture" style="background:${food.bg}">
        <span class="food-label">${food.category.toUpperCase()}</span>
        <span class="food-emoji" role="img" aria-label="${food.name}">${food.emoji}</span>
      </div>
      <div class="food-details">
        <div class="food-title-row">
          <h3>${food.name}</h3>
          <span class="food-price">${money(food.price)}</span>
        </div>
        <p class="food-shop">${food.shop}</p>
        <div class="food-bottom">
          <span class="rating">★ ${food.rating}</span>
          <button class="add-btn" data-add="${food.id}" aria-label="Add ${food.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  $("#emptyMessage").classList.toggle("hidden", filtered.length > 0);
}

function renderCart() {
  const entries = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({
      food: foods.find(food => food.id === Number(id)),
      quantity
    }));

  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce(
    (sum, item) => sum + item.food.price * item.quantity, 0
  );

  $("#cartCount").textContent = count;
  $("#cartEmpty").classList.toggle("hidden", entries.length > 0);
  $("#cartFooter").classList.toggle("hidden", entries.length === 0);

  $("#cartItems").innerHTML = entries.map(({food, quantity}) => `
    <div class="cart-item">
      <div class="cart-item-emoji" style="background:${food.bg}">${food.emoji}</div>
      <div class="cart-item-info">
        <h4>${food.name}</h4>
        <p>${money(food.price)} each</p>
        <div class="quantity">
          <button data-change="-1" data-id="${food.id}" aria-label="Remove one">−</button>
          <span>${quantity}</span>
          <button data-change="1" data-id="${food.id}" aria-label="Add one">+</button>
        </div>
      </div>
      <span class="line-total">${money(food.price * quantity)}</span>
    </div>
  `).join("");

  $("#subtotal").textContent = money(subtotal);
}

function showModal(icon, title, message) {
  $("#modalIcon").textContent = icon;
  $("#modalTitle").textContent = title;
  $("#modalMessage").textContent = message;
  $("#modal").classList.remove("hidden");
  $("#overlay").classList.remove("hidden");
}

function closePanels() {
  $("#cartPanel").classList.remove("open");
  $("#modal").classList.add("hidden");
  $("#overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

$("#categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });

  renderFoods();
});

$("#foodGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  cart[id] = (cart[id] || 0) + 1;

  renderCart();
  button.textContent = "✓";
  setTimeout(() => {
    if (button.isConnected) button.textContent = "+";
  }, 600);
});

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchQuery = $("#searchInput").value.trim();
  renderFoods();
  $("#menu").scrollIntoView({behavior:"smooth"});
});

$("#searchInput").addEventListener("input", event => {
  searchQuery = event.target.value.trim();
  renderFoods();
});

$("#openCart").addEventListener("click", () => {
  $("#cartPanel").classList.add("open");
  $("#overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

$("#closeCart").addEventListener("click", closePanels);
$("#closeModal").addEventListener("click", closePanels);
$("#modalOkay").addEventListener("click", closePanels);
$("#overlay").addEventListener("click", closePanels);

$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;

  const id = Number(button.dataset.id);
  cart[id] = (cart[id] || 0) + Number(button.dataset.change);

  if (cart[id] <= 0) delete cart[id];

  renderCart();
});

$("#shopBtn").addEventListener("click", () => {
  showModal(
    "🏪",
    "For local food shops",
    "Shop registration is not implemented yet. It will need a backend to save shop details and manage menus."
  );
});

$("#checkoutBtn").addEventListener("click", () => {
  showModal(
    "🧾",
    "Checkout is not ready yet",
    "Your cart works, but payment and real order processing are not implemented. No order has been placed."
  );
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePanels();
});

renderFoods();
renderCart();
