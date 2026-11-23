import { useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { categories, shelves } from "../data/books.js";
import { catName, inShelf } from "../lib/books.js";
import BookCard from "./BookCard.jsx";

const featured = ["cs", "sci", "lit", "biz"];
const condRank = { "Like new": 0, Good: 1, Fair: 2 };

/* Browse: search bar, a few featured categories, all categories on request */
export default function Browse() {
  const { books } = useApp();
  const [cur, setCur] = useState(null);
  const [query, setQuery] = useState("");
  const [more, setMore] = useState(false);
  const [sort, setSort] = useState("");
  const sectionRef = useRef(null);
  const inputRef = useRef(null);

  const tiles = [...categories, ...shelves];
  const scope = tiles.find((x) => x.id === cur);
  const top = !cur;
  const q = query.trim().toLowerCase();
  const showBooks = !top || !!q;

  const go = (id) => {
    setCur(id);
    setQuery("");
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  };

  const count = (id) => books.filter((b) => inShelf(b, id)).length;
  const tile = (t) => (
    <button key={t.id} className="cat-card" type="button" onClick={() => go(t.id)}>
      <span className="ic"><i className={`fa-solid ${t.icon}`} aria-hidden="true"></i></span>
      <strong>{t.name}</strong>
      <span className="d">{t.desc}</span>
      <em>{count(t.id)} books</em>
    </button>
  );

  const catMatches = top && q ? categories.filter((c) => (c.name + " " + c.desc).toLowerCase().includes(q)) : [];

  const list = useMemo(() => {
    if (!showBooks) return [];
    const l = books.filter((b) => inShelf(b, cur || "all") && (!q || [b.t, b.a, catName(b.c)].some((x) => String(x).toLowerCase().includes(q))));
    if (sort === "low") l.sort((a, b) => a.p - b.p);
    else if (sort === "az") l.sort((a, b) => a.t.localeCompare(b.t));
    else if (sort === "cond") l.sort((a, b) => condRank[a.cond] - condRank[b.cond]);
    return l;
  }, [books, cur, q, sort, showBooks]);

  return (
    <section id="browse" ref={sectionRef}>
      <div className="container">
        <div className="head"><h2>Find a book you'll love</h2><p>Search by title, author or category, or pick a shelf below.</p></div>
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <label htmlFor="searchInput" style={{ position: "absolute", left: -999 }}>Search books</label>
          <input type="search" id="searchInput" ref={inputRef} autoComplete="off" value={query}
            placeholder={scope ? `Search in ${scope.name}` : "Search books, authors or categories"}
            onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn-primary btn-sm" type="submit">Search</button>
        </form>

        {top && (
          <div className="filters" role="group" aria-label="Quick shelves">
            {shelves.map((t) => (
              <button key={t.id} className="chip" type="button" onClick={() => go(t.id)}>
                <i className={`fa-solid ${t.icon}`} aria-hidden="true"></i>{t.name}
              </button>
            ))}
          </div>
        )}

        {scope && (
          <div className="scope">
            <button className="back" type="button" onClick={() => go(null)}><i className="fa-solid fa-arrow-left" aria-hidden="true"></i>All categories</button>
            <div><h3>{scope.name}</h3><p className="muted">{scope.desc}</p></div>
          </div>
        )}

        {top && !q && (
          <div>
            <h3 className="sub-title">Popular categories</h3>
            <div className="cat-grid">
              {(more ? categories : categories.filter((c) => featured.includes(c.id))).map(tile)}
            </div>
            <div className="center" style={{ marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" type="button" aria-expanded={more} onClick={() => setMore(!more)}>
                {more ? "Show fewer categories" : `Show all ${categories.length} categories`}
              </button>
            </div>
          </div>
        )}

        {catMatches.length > 0 && (
          <div id="catMatches">
            <h3 className="sub-title">Matching categories</h3>
            <div className="cat-grid">{catMatches.map(tile)}</div>
          </div>
        )}

        {showBooks && (
          <>
            <div className="toolbar">
              <p className="results" aria-live="polite">
                {list.length} book{list.length === 1 ? "" : "s"} found{q && top ? ` for "${query.trim()}"` : ""}
              </p>
              <label className="sort" htmlFor="sortSel">Sort by
                <select id="sortSel" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="cond">Best condition</option>
                  <option value="az">Title A to Z</option>
                </select>
              </label>
            </div>
            <div className="grid">
              {list.length ? list.map((b) => <BookCard key={b.id} book={b} />) : (
                <div className="empty">
                  <i className="fa-regular fa-face-frown"></i>
                  <p>No books match "{query}" here. Try another title, author or category.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
