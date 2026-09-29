/* ==========================================================
   CCS114 Finals Lab 1 - User Info Card
   DOM selection methods used:
     1. getElementById
     2. querySelector / querySelectorAll
     3. getElementsByClassName
     4. getElementsByTagName
   DOM manipulation techniques used:
     textContent, innerHTML-free element creation (createElement/appendChild),
     setAttribute, style changes, classList add/remove
   ========================================================== */

// ---- Selection: getElementById ----
const showBtn = document.getElementById("showBtn");
const clearBtn = document.getElementById("clearBtn");
const formMessage = document.getElementById("formMessage");
const infoCard = document.getElementById("infoCard");
const emptyState = document.getElementById("emptyState");
const infoList = document.getElementById("infoList");
const hobbyTags = document.getElementById("hobbyTags");
const mood = document.getElementById("mood");
const moodValue = document.getElementById("moodValue");
const favColor = document.getElementById("favColor");
const otherColor = document.getElementById("otherColor");
const DEFAULT_COLOR = "#e64980";

// ---- Helpers ----
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function addRow(label, value) {
  const row = document.createElement("div");
  row.className = "info-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value || "Not provided";
  row.appendChild(dt);
  row.appendChild(dd);
  infoList.appendChild(row);
}

function applyAccent(color) {
  // Manipulation: style / CSS variable
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--accent-soft", "color-mix(in srgb, " + color + " 12%, white)");
}

// ---- Live slider label ----
mood.addEventListener("input", function () {
  moodValue.textContent = mood.value;
});

// Returns a usable CSS color from the dropdown (or the "Others" text box)
function getCardColor() {
  if (favColor.value === "other") {
    const typed = otherColor.value.trim();
    return typed && CSS.supports("color", typed) ? typed : DEFAULT_COLOR;
  }
  return favColor.value;
}

// ---- Show the "please specify" box only when Others is chosen ----
favColor.addEventListener("change", function () {
  if (favColor.value === "other") {
    otherColor.classList.remove("hidden");
    otherColor.focus();
  } else {
    otherColor.classList.add("hidden");
    otherColor.value = "";
  }
  applyAccent(getCardColor());
});

otherColor.addEventListener("input", function () {
  applyAccent(getCardColor());
});

// ---- SHOW MY INFO ----
showBtn.addEventListener("click", function () {
  // Read values (getElementById)
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value;
  const birthdate = document.getElementById("birthdate").value;
  const phone = document.getElementById("phone").value.trim();
  const website = document.getElementById("website").value.trim();
  const education = document.getElementById("education").value;
  const address = document.getElementById("address").value.trim();
  const bio = document.getElementById("bio").value.trim();

  // Read values (querySelector / querySelectorAll)
  const favColorName = favColor.value === "other"
    ? (otherColor.value.trim() || "Other (not specified)")
    : favColor.options[favColor.selectedIndex].text;
  const cardColor = getCardColor();
  const genderInput = document.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : "";
  const hobbies = Array.from(document.querySelectorAll('input[name="hobby"]:checked'))
    .map(function (box) { return box.value; });

  // Validation: name is required
  if (fullName === "") {
    formMessage.textContent = "Please enter your full name first.";
    formMessage.className = "form-message error";
    document.getElementById("fullName").focus();
    return;
  }

  // Selection: getElementsByClassName - highlight filled inputs
  const inputs = document.getElementsByClassName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.borderColor = inputs[i].value ? cardColor : "";
  }

  // Selection: getElementsByTagName - count checked/filled inputs
  const allInputs = document.getElementsByTagName("input");
  let filled = 0;
  for (let i = 0; i < allInputs.length; i++) {
    const t = allInputs[i].type;
    if (t === "radio" || t === "checkbox") { if (allInputs[i].checked) filled++; }
    else if (t !== "range" && allInputs[i].value) filled++;
  }

  // Manipulation: textContent
  document.getElementById("cardName").textContent = fullName;
  document.getElementById("cardEducation").textContent = education || "Education not selected";
  document.getElementById("cardBio").textContent = bio ? '"' + bio + '"' : "";

  // Manipulation: avatar text + style
  const avatar = document.getElementById("cardAvatar");
  avatar.textContent = initials(fullName);
  avatar.style.background = cardColor;
  document.getElementById("cardBanner").style.background = cardColor;
  applyAccent(cardColor);

  // Manipulation: setAttribute
  avatar.setAttribute("title", fullName + "'s avatar");
  const link = document.getElementById("cardLink");
  if (website) {
    link.setAttribute("href", website);
    link.classList.remove("hidden");
  } else {
    link.removeAttribute("href");
    link.classList.add("hidden");
  }

  // Manipulation: create elements (tags + rows)
  hobbyTags.replaceChildren();
  hobbies.forEach(function (h) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = h;
    hobbyTags.appendChild(tag);
  });

  infoList.replaceChildren();
  addRow("Email", email);
  addRow("Age", age);
  addRow("Birthdate", formatDate(birthdate));
  addRow("Phone", phone);
  addRow("Address", address);
  addRow("Gender", gender);
  addRow("Favorite color", favColorName);
  addRow("Happiness today", mood.value + " / 10");
  addRow("Hobbies", hobbies.join(", "));
  addRow("Website", website);

  // Manipulation: classList - reveal the card
  emptyState.classList.add("hidden");
  infoCard.classList.remove("hidden");
  // restart animation on repeat clicks
  infoCard.style.animation = "none";
  void infoCard.offsetWidth;
  infoCard.style.animation = "";

  formMessage.textContent = "Card generated from " + filled + " filled fields!";
  formMessage.className = "form-message success";
  // When the layout is stacked (small screens), bring the card into view
  if (window.matchMedia("(max-width: 1000px)").matches) {
    infoCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ---- CLEAR ----
clearBtn.addEventListener("click", function () {
  document.getElementById("infoForm").reset();
  moodValue.textContent = mood.value;
  otherColor.classList.add("hidden");

  const inputs = document.getElementsByClassName("input");
  for (let i = 0; i < inputs.length; i++) inputs[i].style.borderColor = "";

  infoCard.classList.add("hidden");
  emptyState.classList.remove("hidden");
  applyAccent(DEFAULT_COLOR);
  formMessage.textContent = "";
  formMessage.className = "form-message";
});
