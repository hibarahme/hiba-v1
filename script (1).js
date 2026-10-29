(() => {
  const MINIMUM_BASKET = 10;
  const DELIVERY_FEE = 2;
  const ITEMS_PER_CATEGORY = 3;
  const ITEMS = [
    { name: "Soda", price: 2.5 },
    { name: "Ice cream", price: 3.5 },
    { name: "Nuts", price: 2 },
    { name: "Chips", price: 2, sponsored: true },
    { name: "Popcorn", price: 2.5 },
    { name: "Crackers", price: 1.5 },
    { name: "Iced tea", price: 2, sponsored: true },
    { name: "Water", price: 3 },
    { name: "Juice", price: 2.5 },
    { name: "Choc bar", price: 1.5, sponsored: true },
    { name: "Ice cream cup", price: 3 },
    { name: "Cookies", price: 2 },
  ];
  const CATEGORIES = ["Buy again", "Chips & snacks", "Drinks", "Ice cream & chocolate"];
  const basket = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const all = (selector, root = document) => root.querySelectorAll(selector);
  const money = value => `$${value.toFixed(2)}`;
  const subtotal = quantities => quantities.reduce((sum, quantity, index) => sum + quantity * ITEMS[index].price, 0);
  const ORDERCARD = '<div class="lab">Your order</div><div class="card"><div class="row between"><span>Chicken shawarma</span><b>$9.00</b></div><div class="row between"><span>Fattoush</span><b>$5.00</b></div></div>';
  const BROWSE = '<button type="button" class="browse" data-browse>Browse all categories</button>';

  // Shared markup for the five screens and the walkthrough.
  function status(time) {
    return `<div class="sb"><span>${time}</span><span>●●●</span></div>`;
  }
  function tracker(title, progress, eta) {
    return `<div class="top">${title}</div><div class="map"><i></i></div><div class="eta"><div class="bar"><b style="width:${progress}%"></b></div><span>${eta}</span></div>`;
  }
  function fd(prefix = "") {
    return `<div class="fd"><div class="row between"><span class="t" data-${prefix}msg></span></div><div class="bar"><b data-${prefix}prog></b></div></div>`;
  }
  function addons(group = 0) {
    return `<div class="items" data-addons="${group}"></div>`;
  }
  function phone(content, overlay = "") {
    return `<div class="phone"><div class="screen">${content}${overlay}</div></div>`;
  }
  function fig(content, caption, title) {
    return `<figure>${content}<figcaption><b>${title}</b>${caption}</figcaption></figure>`;
  }
  function categoryLabel(group) {
    return `<div class="lab row between"><span>${CATEGORIES[group]}</span><span>&#8594;</span></div>`;
  }
  function rowsBlock(from) {
    const rows = CATEGORIES.slice(from).map((_, index) => categoryLabel(from + index) + addons(from + index)).join("");
    return `<div class="rows" style="max-height:196px">${rows}</div>${BROWSE}`;
  }
  function productCard(item, control) {
    const label = item.sponsored ? '<span class="spon">Sponsored</span>' : "";
    return `<div class="item"><div class="sq" style="position:relative">${label}</div><div class="n">${item.name}</div><div class="p">${money(item.price)}</div>${control}</div>`;
  }
  function staticRow(group) {
    const start = group * ITEMS_PER_CATEGORY;
    const cards = ITEMS.slice(start, start + ITEMS_PER_CATEGORY).map(item => productCard(item, '<div class="add">+ Add</div>')).join("");
    return `${categoryLabel(group)}<div class="items">${cards}</div>`;
  }
  function quantityControl(item, index, quantity, animated = false) {
    if (animated) {
      return quantity > 0
        ? `<div class="step"><span style="padding:0 5px">−</span><span>${quantity}</span><span style="padding:0 5px" data-plus="${index}">+</span></div>`
        : `<div class="add" data-plus="${index}" style="text-align:center">+ Add</div>`;
    }
    return quantity > 0
      ? `<div class="step"><button type="button" data-i="${index}" data-d="-1" aria-label="Remove one ${item.name}">−</button><span>${quantity}</span><button type="button" data-i="${index}" data-d="1" aria-label="Add one ${item.name}">+</button></div>`
      : `<button type="button" class="add" data-i="${index}" data-d="1" aria-label="Add ${item.name}">+ Add</button>`;
  }
  function productRow(group, quantities, animated = false) {
    const start = group * ITEMS_PER_CATEGORY;
    const cards = ITEMS.slice(start, start + ITEMS_PER_CATEGORY).map((item, offset) => {
      const index = start + offset;
      return productCard(item, quantityControl(item, index, quantities[index], animated));
    }).join("");
    return cards;
  }

  function catsBody(fdHtml) {
    var C = [
      ["Drinks", 1],
      ["Ice cream", 1],
      ["Chocolate & snacks", 1],
      ["Chips & nuts", 1],
      ["Water", 1],
      ["Bakery", 0],
      ["Dairy & eggs", 0],
      ["Produce", 0],
      ["Pantry", 0],
      ["Personal care", 0],
    ];
    return (
      '<div class="row" style="gap:8px"><span style="color:var(--teal);font-weight:600">&#8592;</span><div class="top">All categories</div></div><div class="card tint" style="padding:7px 9px">' +
      fdHtml +
      '</div><div class="lab">Quick top-ups</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:none">' +
      C.map(function (c, i) {
        return (
          (i === 5
            ? '</div><div class="lab">Bigger shops</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:none">'
            : "") +
          '<div class="row" style="gap:6px;border:1px solid var(--line);border-radius:9px;padding:5px 6px;background:' +
          (c[1] ? "var(--tint)" : "var(--surface)") +
          '"><div class="sq" style="width:22px;height:22px;border-radius:6px"></div><span style="font-size:10px;font-weight:500;line-height:1.15">' +
          c[0] +
          "</span></div>"
        );
      }).join("") +
      "</div>"
    );
  }
  const screens = [
    fig(
      phone(
        status("9:41") +
          tracker("Your order is being prepared", 35, "25–35 min"),
        '<div class="dim"></div><div class="sheet"><div class="grab"></div><div class="row between"><b style="font-size:13px">Free Fresh delivery</b><span style="color:var(--teal);font-weight:600;white-space:nowrap">Not now</span></div><div class="sub" style="margin-top:-6px;font-size:10px">$10+ baskets · arrives separately · other fees apply</div>' +
          '<div class="card tint">' +
          fd() +
          "</div>" +
          rowsBlock(0) +
          '<div class="btn">Continue to Fresh basket</div></div>',
      ),
      "Buy again first, then rows by category (chips &amp; snacks, drinks, ice cream &amp; chocolate) that scroll. The goal reads “Add $4.00, get $0 delivery”. Shown once per order.",
      "1. Sheet after checkout",
    ),
    fig(
      phone(
        status("9:42") +
          tracker("Your order is being prepared", 40, "22–32 min") +
          '<div class="lab">While you wait</div><div class="card tint"><b>Add groceries while you wait</b>' +
          fd() +
          '<div class="lab">Buy again</div>' +
          addons() +
          '<button type="button" class="browse" data-browse>Browse all categories</button></div><div class="spacer"></div><div class="btn">Continue to Fresh basket</div>',
      ),
      "Same Buy again row and bar, with Browse all categories. Same button. Stays after the sheet is closed.",
      "2. Module under the tracker",
    ),
    fig(
      phone(
        status("9:43") +
          '<div class="top">Fresh basket</div><div class="card tint">' +
          fd() +
          '</div><div class="lab">Your add-ons</div><div data-lines style="display:flex;flex-direction:column;gap:8px"></div><div class="spacer"></div>' +
          '<div class="sum"><span>Subtotal</span><b data-sub></b></div><div class="sum"><span>Fresh delivery</span><b data-fee></b></div><div class="card tint" style="padding:7px 9px;font-weight:600;color:var(--teal)" data-save></div><div style="color:var(--muted)">Arrives separately, about 25 min</div><div class="btn">Place Fresh order</div>',
      ),
      "Same items and prices. The food delivery fee is not changed. Fresh fee shown is a placeholder.",
      "3. Fresh basket",
    ),
    '<figure id="catspage"><div class="phone"><div class="screen">' +
      status("9:42") +
      catsBody(fd()) +
      "</div></div><figcaption><b>4. All categories</b>Browse all categories, under the rows, opens this page. Quick top-ups first, bigger shops after.</figcaption></figure>",
    fig(
      phone(
        status("9:41") +
          tracker("Your order is being prepared", 35, "25–35 min") +
          '<div class="lab">While you wait</div><div class="card tint"><b>Free Fresh delivery while you wait</b><div class="fd"><div class="row between"><span class="t">Add $10.00, get $0 delivery</span></div><div class="bar"><b style="width:0%"></b></div></div><div class="rows" style="max-height:120px">' +
          staticRow(1) +
          staticRow(2) +
          '</div><button type="button" class="browse" data-browse>Browse all categories</button></div><div class="spacer"></div><div class="btn">Continue to Fresh basket</div>',
      ),
      "No Fresh history, so no Buy again row: the sheet opens on the category rows. Brands paying per click rank first in their row, labelled “Sponsored”.",
      "5. First-time Fresh customer",
    ),
  ];
  document.getElementById("v1screens").innerHTML = screens.join("");

  // Both baskets use the same prices, threshold and delivery messages.
  function renderDelivery(root, quantities, prefix = "") {
    const total = subtotal(quantities);
    const freeDelivery = total >= MINIMUM_BASKET;
    const remaining = money(MINIMUM_BASKET - total);
    const text = (attribute, value) => all(`[data-${prefix}${attribute}]`, root).forEach(element => {
      element.textContent = value;
    });
    text("msg", freeDelivery ? "Free Fresh delivery unlocked" : `Add ${remaining}, get $0 delivery`);
    all(`[data-${prefix}prog]`, root).forEach(element => {
      element.style.width = `${Math.min(100, total / MINIMUM_BASKET * 100)}%`;
    });
    text("sub", money(total));
    text("fee", freeDelivery ? "$0.00" : money(DELIVERY_FEE));
    text("save", freeDelivery ? "Free delivery" : `Add ${remaining} more for free delivery`);
  }
  function basketLines(quantities, animated = false) {
    return ITEMS.map((item, index) => {
      const quantity = quantities[index];
      if (!quantity) return "";
      const name = item.name + (animated ? ` × ${quantity}` : "");
      const control = animated ? "" : quantityControl(item, index, quantity);
      return `<div class="line"><div class="sq" style="width:28px;height:28px"></div><span class="nm">${name}</span><span class="pr">${money(item.price * quantity)}</span>${control}</div>`;
    }).join("");
  }
  function renderBasket() {
    all("[data-addons]").forEach(element => {
      element.innerHTML = productRow(Number(element.dataset.addons) || 0, basket);
    });
    renderDelivery(document, basket);
    const lines = basketLines(basket) || '<div class="empty">Nothing added yet</div>';
    all("[data-lines]").forEach(element => { element.innerHTML = lines; });
  }
  function highlightFigure(id) {
    const figure = document.getElementById(id);
    if (!figure) return;
    figure.scrollIntoView({ behavior: "smooth", block: "center" });
    figure.classList.add("flash");
    setTimeout(() => figure.classList.remove("flash"), 1800);
  }
  document.addEventListener("click", event => {
    if (event.target.closest("[data-browse]")) {
      highlightFigure("catspage");
      return;
    }
    const button = event.target.closest("button[data-i]");
    if (!button) return;
    const index = Number(button.dataset.i);
    basket[index] = Math.max(0, basket[index] + Number(button.dataset.d));
    renderBasket();
  });
  renderBasket();

  function initWalkthrough() {
    const host = document.getElementById("anim");
    if (!host) return;
    let currentStep = 0;
    let timer = null;
    let playing = false;
    const steps = [
      {
        scene: "checkout",
        sheetOpen: 0,
        quantities: [0, 0, 0],
        highlight: "[data-tap=place]",
        duration: 2600,
        caption: "1. Checkout. The customer places the restaurant order.",
      },
      {
        scene: "tracker",
        sheetOpen: 0,
        quantities: [0, 0, 0],
        highlight: "",
        duration: 1600,
        caption: "2. The order is confirmed and the tracker opens first.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [0, 0, 0],
        highlight: '[data-plus="0"]',
        duration: 2600,
        caption: "3. A sheet slides up: Buy again first, then rows by category. “Add $10.00, get $0 delivery” shows straight away, and fees are disclosed.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 0, 0],
        highlight: "",
        duration: 2200,
        scroll: 0,
        caption: "4. A soda is in and the bar moves.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 0, 0],
        highlight: "",
        duration: 2200,
        scroll: 120,
        caption: "5. Scrolling down shows more categories: chips and snacks, drinks.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 0, 0],
        highlight: "[data-tap=browse]",
        duration: 2600,
        scroll: 9999,
        caption: "6. Then ice cream and chocolate, and at the end, Browse all categories.",
      },
      {
        scene: "cats",
        sheetOpen: 0,
        quantities: [1, 0, 0],
        highlight: "",
        duration: 3200,
        caption: "7. A page with every Fresh category opens. Quick top-ups come first; the basket and free-delivery bar come along.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 0, 0],
        highlight: '[data-plus="1"]',
        duration: 1700,
        scroll: 0,
        caption: "8. Back to the sheet. Ice cream is next.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 1, 0],
        highlight: '[data-plus="2"]',
        duration: 1700,
        caption: "9. Ice cream is in.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 1, 1],
        highlight: '[data-plus="1"]',
        duration: 1700,
        caption: "10. Nuts are in: $8.00, still $2.00 to go.",
      },
      {
        scene: "tracker",
        sheetOpen: 1,
        quantities: [1, 2, 1],
        highlight: "[data-tap=cont]",
        duration: 2400,
        caption: "11. A second ice cream takes it past $10. Free delivery unlocks.",
      },
      {
        scene: "basket",
        sheetOpen: 0,
        quantities: [1, 2, 1],
        highlight: "[data-tap=placefresh]",
        duration: 3000,
        caption: "12. The basket shows the same items. Fresh delivery is $0.00: free delivery.",
      },
      {
        scene: "done",
        sheetOpen: 0,
        quantities: [1, 2, 1],
        highlight: "",
        duration: 3200,
        caption: "13. Both orders are tracked together, each with its own arrival time.",
      },
    ];
    host.innerHTML =
      '<div class="phone"><div class="screen">' +
      '<div class="scene" data-scene="checkout">' +
      status("9:40") +
      '<div class="top">Checkout</div><div class="card"><div class="row between"><span>Chicken shawarma</span><b>$9.00</b></div><div class="row between"><span>Fattoush</span><b>$5.00</b></div></div><div class="sum"><span>Delivery</span><b>$1.50</b></div><div class="spacer"></div><div class="btn" data-tap="place">Place order</div></div>' +
      '<div class="scene" data-scene="tracker">' +
      status("9:41") +
      tracker("Your order is being prepared", 35, "25–35 min") +
      ORDERCARD +
      '<div class="adim dim"></div><div class="asheet sheet"><div class="grab"></div><div class="row between"><b style="font-size:13px">Free Fresh delivery</b><span style="color:var(--teal);font-weight:600;white-space:nowrap">Not now</span></div><div class="sub" style="margin-top:-6px;font-size:10px">$10+ baskets · arrives separately · other fees apply</div><div class="card tint">' +
      fd("a") +
      '</div><div class="rows"><div class="lab row between"><span>Buy again</span><span>&#8594;</span></div><div class="items" data-aitems></div><div class="lab row between"><span>Chips &amp; snacks</span><span>&#8594;</span></div><div class="items" data-aitems2></div><div class="lab row between"><span>Drinks</span><span>&#8594;</span></div><div class="items" data-aitems3></div><div class="lab row between"><span>Ice cream &amp; chocolate</span><span>&#8594;</span></div><div class="items" data-aitems4></div><div class="browse" data-tap="browse">Browse all categories</div></div><div class="btn" data-tap="cont">Continue to Fresh basket</div></div></div>' +
      '<div class="scene" data-scene="basket">' +
      status("9:43") +
      '<div class="top">Fresh basket</div><div class="card tint">' +
      fd("a") +
      '</div><div class="lab">Your add-ons</div><div data-alines style="display:flex;flex-direction:column;gap:8px"></div><div class="spacer"></div><div class="sum"><span>Subtotal</span><b data-asub></b></div><div class="sum"><span>Fresh delivery</span><b data-afee></b></div><div class="card tint" style="padding:7px 9px;font-weight:600;color:var(--teal)" data-asave></div><div style="color:var(--muted)">Arrives separately, about 25 min</div><div class="btn" data-tap="placefresh">Place Fresh order</div></div>' +
      '<div class="scene" data-scene="cats">' +
      status("9:42") +
      catsBody(fd("a")) +
      "</div>" +
      '<div class="scene" data-scene="done">' +
      status("9:44") +
      tracker("Your orders are on the way", 60, "22–32 min") +
      '<div class="lab">Your orders</div><div class="card tint"><div class="row between"><b>Restaurant order</b><span>22–32 min</span></div><div class="bar"><b style="width:60%"></b></div></div><div class="card tint"><div class="row between"><b>Fresh order</b><span>about 25 min</span></div><div class="bar"><b style="width:15%"></b></div></div></div>' +
      "</div></div>";
    const caption = document.getElementById("anim-cap");
    const dots = document.getElementById("anim-dots");
    const playButton = document.getElementById("anim-play");
    const restartButton = document.getElementById("anim-restart");
    dots.innerHTML = steps.map((_, index) => `<button type="button" class="dot" data-go="${index}" aria-label="Go to step ${index + 1}"></button>`).join("");

    function applyStep(index) {
      currentStep = index;
      const step = steps[index];
      all(".scene", host).forEach(element => {
        element.classList.toggle("on", element.dataset.scene === step.scene);
      });
      host.querySelector(".asheet").classList.toggle("up", !!step.sheetOpen);
      host.querySelector(".adim").classList.toggle("up", !!step.sheetOpen);
      CATEGORIES.forEach((_, group) => {
        const attribute = `data-aitems${group === 0 ? "" : group + 1}`;
        host.querySelector(`[${attribute}]`).innerHTML = productRow(group, step.quantities, true);
      });
      const rows = host.querySelector(".asheet .rows");
      const top = step.scroll || 0;
      if (!top) rows.scrollTop = 0;
      else {
        try { rows.scrollTo({ top, behavior: "smooth" }); }
        catch { rows.scrollTop = top; }
      }
      renderDelivery(host, step.quantities, "a");
      host.querySelector("[data-alines]").innerHTML = basketLines(step.quantities, true);
      all(".tap", host).forEach(element => element.classList.remove("tap"));
      if (step.highlight) host.querySelector(step.highlight)?.classList.add("tap");
      caption.textContent = step.caption;
      all(".dot", dots).forEach((dot, position) => dot.classList.toggle("on", position === index));
    }
    function scheduleNextStep() {
      clearTimeout(timer);
      if (!playing) return;
      timer = setTimeout(() => {
        applyStep((currentStep + 1) % steps.length);
        scheduleNextStep();
      }, steps[currentStep].duration);
    }
    function setPlaying(value) {
      playing = value;
      playButton.textContent = playing ? "Pause" : "Play";
      scheduleNextStep();
    }
    applyStep(0);
    let reducedMotion = false;
    try { reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch { /* Use the normal playback setting if the preference is unavailable. */ }
    setPlaying(!reducedMotion);
    playButton.addEventListener("click", () => setPlaying(!playing));
    restartButton.addEventListener("click", () => {
      applyStep(0);
      setPlaying(true);
    });
    dots.addEventListener("click", event => {
      const button = event.target.closest("[data-go]");
      if (!button) return;
      applyStep(Number(button.dataset.go));
      scheduleNextStep();
    });
  }
  initWalkthrough();
})();
