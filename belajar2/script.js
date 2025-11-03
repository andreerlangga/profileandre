// simple client-side logic: validasi, simpan ke localStorage, tampilkan list
const form = document.getElementById("feedbackForm");
const kritikEl = document.getElementById("kritik");
const saranEl = document.getElementById("saran");
const ratingEl = document.getElementById("rating");
const feedbackList = document.getElementById("feedbackList");
const submitMsg = document.getElementById("submitMsg");
const resetBtn = document.getElementById("resetBtn");

const STORAGE_KEY = "profile_feedback_v1";

function loadFeedback() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveFeedback(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderList() {
  const list = loadFeedback();
  feedbackList.innerHTML = "";
  if (list.length === 0) {
    feedbackList.innerHTML = '<li class="text-muted small">Belum ada feedback.</li>';
    return;
  }
  list.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="d-flex justify-content-between">
        <div class="fw-bold small">${escapeHtml(item.user || "@anonymous")}</div>
        <div class="small text-muted">${new Date(item.date).toLocaleString()}</div>
      </div>
      <div class="mt-1 small">${escapeHtml(item.kritik)}</div>
      <div class="mt-2 small text-muted">Saran: ${escapeHtml(item.saran)} · Rating: ${escapeHtml(item.rating)}</div>
    `;
    feedbackList.appendChild(li);
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// initial render
renderList();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // simple validation
  const kritik = kritikEl.value.trim();
  const saran = saranEl.value.trim();
  const rating = ratingEl.value;

  let valid = true;
  if (kritik.length < 10) {
    kritikEl.classList.add("is-invalid");
    valid = false;
  } else {
    kritikEl.classList.remove("is-invalid");
  }

  if (saran.length < 5) {
    saranEl.classList.add("is-invalid");
    valid = false;
  } else {
    saranEl.classList.remove("is-invalid");
  }

  if (!valid) return;

  // simpan
  const list = loadFeedback();
  list.push({
    user: "@follower_" + Math.floor(Math.random() * 9999),
    kritik,
    saran,
    rating,
    date: new Date().toISOString()
  });
  saveFeedback(list);
  renderList();

  // feedback UI
  submitMsg.classList.remove("d-none");
  setTimeout(() => submitMsg.classList.add("d-none"), 2500);

  // reset form
  kritikEl.value = "";
  saranEl.value = "";
  ratingEl.value = "5";
});

// reset btn
resetBtn.addEventListener("click", () => {
  kritikEl.value = "";
  saranEl.value = "";
  ratingEl.value = "5";
  kritikEl.classList.remove("is-invalid");
  saranEl.classList.remove("is-invalid");
});
