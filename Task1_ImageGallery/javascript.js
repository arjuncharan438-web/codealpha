// ── Image Data ────────────────────────────────────────────────────────────────
const images = [
  { src:"https://picsum.photos/seed/nature1/800/600",  thumb:"https://picsum.photos/seed/nature1/400/300",  title:"Forest Path",     category:"Nature" },
  { src:"https://picsum.photos/seed/arch1/800/600",   thumb:"https://picsum.photos/seed/arch1/400/300",   title:"City Skyline",    category:"Architecture" },
  { src:"https://picsum.photos/seed/travel1/800/600", thumb:"https://picsum.photos/seed/travel1/400/300", title:"Mountain Trail",  category:"Travel" },
  { src:"https://picsum.photos/seed/animal1/800/600", thumb:"https://picsum.photos/seed/animal1/400/300", title:"Wild Deer",       category:"Animals" },
  { src:"https://picsum.photos/seed/food1/800/600",   thumb:"https://picsum.photos/seed/food1/400/300",   title:"Fresh Harvest",   category:"Food" },
  { src:"https://picsum.photos/seed/nature2/800/600", thumb:"https://picsum.photos/seed/nature2/400/300", title:"Autumn Lake",     category:"Nature" },
  { src:"https://picsum.photos/seed/arch2/800/600",   thumb:"https://picsum.photos/seed/arch2/400/300",   title:"Stone Bridge",    category:"Architecture" },
  { src:"https://picsum.photos/seed/travel2/800/600", thumb:"https://picsum.photos/seed/travel2/400/300", title:"Coastal Cliffs",  category:"Travel" },
  { src:"https://picsum.photos/seed/animal2/800/600", thumb:"https://picsum.photos/seed/animal2/400/300", title:"Ocean Turtle",    category:"Animals" },
  { src:"https://picsum.photos/seed/food2/800/600",   thumb:"https://picsum.photos/seed/food2/400/300",   title:"Farmers Market",  category:"Food" },
  { src:"https://picsum.photos/seed/nature3/800/600", thumb:"https://picsum.photos/seed/nature3/400/300", title:"Misty Mountains", category:"Nature" },
  { src:"https://picsum.photos/seed/arch3/800/600",   thumb:"https://picsum.photos/seed/arch3/400/300",   title:"Glass Tower",     category:"Architecture" },
  { src:"https://picsum.photos/seed/travel3/800/600", thumb:"https://picsum.photos/seed/travel3/400/300", title:"Desert Dunes",    category:"Travel" },
  { src:"https://picsum.photos/seed/animal3/800/600", thumb:"https://picsum.photos/seed/animal3/400/300", title:"Arctic Fox",      category:"Animals" },
  { src:"https://picsum.photos/seed/food3/800/600",   thumb:"https://picsum.photos/seed/food3/400/300",   title:"Morning Coffee",  category:"Food" },
  { src:"https://picsum.photos/seed/nature4/800/600", thumb:"https://picsum.photos/seed/nature4/400/300", title:"Waterfall",       category:"Nature" },
  { src:"https://picsum.photos/seed/arch4/800/600",   thumb:"https://picsum.photos/seed/arch4/400/300",   title:"Ancient Temple",  category:"Architecture" },
  { src:"https://picsum.photos/seed/travel4/800/600", thumb:"https://picsum.photos/seed/travel4/400/300", title:"Hidden Village",  category:"Travel" },
];

// ── State ─────────────────────────────────────────────────────────────────────
let activeCategory  = "All";
let activeCSSFilter = "none";
let lightboxIndex   = -1;
let filtered        = [];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const grid      = document.getElementById("galleryGrid");
const countEl   = document.getElementById("imageCount");
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lbImg");
const lbSpinner = document.getElementById("lbSpinner");
const lbTitle   = document.getElementById("lbTitle");
const lbBadge   = document.getElementById("lbBadge");
const lbCounter = document.getElementById("lbCounter");

// ── Render grid ───────────────────────────────────────────────────────────────
function renderGrid() {
  filtered = activeCategory === "All"
    ? images
    : images.filter(img => img.category === activeCategory);

  countEl.textContent = filtered.length + " photo" + (filtered.length !== 1 ? "s" : "");
  grid.innerHTML = "";

  filtered.forEach((img, idx) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img" src="${img.thumb}" alt="${img.title}" loading="lazy"
             style="filter:${activeCSSFilter}"/>
        <div class="card-overlay">
          <span class="card-zoom">&#x26F6;</span>
          <p class="card-title">${img.title}</p>
          <span class="card-category">${img.category}</span>
        </div>
      </div>`;
    card.addEventListener("click", () => openLightbox(idx));
    grid.appendChild(card);
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function openLightbox(idx) {
  lightboxIndex = idx;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  loadLightboxImage();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxIndex = -1;
}

function loadLightboxImage() {
  const img = filtered[lightboxIndex];
  lbImg.classList.remove("loaded");
  lbSpinner.style.display = "block";
  lbTitle.textContent   = img.title;
  lbBadge.textContent   = img.category;
  lbCounter.textContent = (lightboxIndex + 1) + " / " + filtered.length;
  lbImg.style.filter    = activeCSSFilter;

  const tmp = new Image();
  tmp.onload = () => {
    lbImg.src = img.src;
    lbImg.classList.add("loaded");
    lbSpinner.style.display = "none";
  };
  tmp.src = img.src;
}

function goNext() {
  if (lightboxIndex === -1) return;
  lightboxIndex = (lightboxIndex + 1) % filtered.length;
  loadLightboxImage();
}

function goPrev() {
  if (lightboxIndex === -1) return;
  lightboxIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
  loadLightboxImage();
}

// ── Events ────────────────────────────────────────────────────────────────────
document.getElementById("categoryBar").addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.cat;
  renderGrid();
});

document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeCSSFilter = btn.dataset.filter;
  document.querySelectorAll(".card-img").forEach(img => img.style.filter = activeCSSFilter);
  if (lightboxIndex !== -1) lbImg.style.filter = activeCSSFilter;
});

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", e => { e.stopPropagation(); goPrev(); });
document.getElementById("lbNext").addEventListener("click", e => { e.stopPropagation(); goNext(); });
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (lightboxIndex === -1) return;
  if (e.key === "ArrowRight") goNext();
  if (e.key === "ArrowLeft")  goPrev();
  if (e.key === "Escape")     closeLightbox();
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderGrid();
