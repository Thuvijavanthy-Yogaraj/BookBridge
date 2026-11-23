import { categories, OL } from "../data/books.js";

/* Converts a book from the API into the shape the UI uses */
export const fromApi = (b) => ({
  id: String(b.id), t: b.title, a: b.author, c: b.category, cond: b.condition, p: b.price,
  isbn: b.isbn, type: b.type, wants: b.wants, desc: b.description, place: b.place,
  img: b.image, owner: b.ownerId, ownerName: b.ownerName,
});

export const first = (n) => String(n || "").trim().split(" ")[0];
export const catIndex = (id) => Math.max(0, categories.findIndex((c) => c.id === id));
export const catName = (id) => categories.find((c) => c.id === id)?.name || "";
export const priceLabel = (b) => (b.type === "sell" ? "$" + b.p : b.type === "free" ? "Free" : "Swap");
export const typeLabel = (b) => ({ sell: "For sale", free: "Free", swap: "Exchange" })[b.type];
export const inShelf = (b, id) => id === "all" || (id === "free" || id === "swap" ? b.type === id : b.c === id);

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const cloth = ["#2f6446", "#7a2e2e", "#24405a", "#9a6a1c", "#5a3a5e", "#1f5c5c", "#9a4a24", "#3d4a52"];

/* Draws a cloth-bound cover with the title and author, used when there is no photo */
export function genCover(b) {
  if (!b) return "";
  const col = cloth[catIndex(b.c) % cloth.length];
  const lines = [];
  let cur = "";
  String(b.t).split(/\s+/).forEach((w) => {
    if ((cur + " " + w).trim().length > 13 && cur) { lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(0, 5), fs = L.length > 3 ? 27 : 32, lh = fs * 1.2, y0 = 118;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect width="300" height="450" fill="${col}"/><rect width="20" height="450" fill="#000" opacity=".2"/><rect x="38" y="24" width="238" height="402" fill="none" stroke="#f6ecd6" stroke-opacity=".5" stroke-width="1.5"/><rect x="44" y="30" width="226" height="390" fill="none" stroke="#f6ecd6" stroke-opacity=".25"/><g font-family="Georgia,'Times New Roman',serif" fill="#f6ecd6"><text x="60" font-size="${fs}" font-weight="700">${L.map((l, i) => `<tspan x="60" y="${y0 + i * lh}">${esc(l)}</tspan>`).join("")}</text><rect x="60" y="${y0 + L.length * lh - 12}" width="44" height="3" fill="#f0c674"/><text x="60" y="388" font-size="16" opacity=".9">${esc(String(b.a).slice(0, 24))}</text></g></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export const coverSrc = (b) => b.img || (b.isbn ? OL(b.isbn) : genCover(b));

/* Form checks shared by several pages */
export const emailCheck = (v) =>
  !v ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email, like name@school.edu.";
export const nameCheck = (v) => (v.length < 2 ? "Enter your full name." : "");
