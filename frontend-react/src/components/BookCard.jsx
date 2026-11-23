import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { catName, priceLabel } from "../lib/books.js";
import BookCover from "./BookCover.jsx";

export default function BookCard({ book: b }) {
  const { favs, toggleFav, openBook } = useApp();
  const titleRef = useRef(null);
  const f = favs.has(b.id);
  const open = () => openBook(b.id, titleRef.current);

  return (
    <article className="book">
      <div className="cover">
        <BookCover book={b} onClick={open} />
        {b.type === "free" && <span className="free-tag">Free</span>}
        {b.type === "swap" && <span className="free-tag swap">Swap</span>}
        <button
          className="heart"
          type="button"
          aria-pressed={f}
          aria-label={`${f ? "Remove" : "Save"} ${b.t} ${f ? "from" : "to"} favourites`}
          onClick={() => toggleFav(b.id)}
        >
          <i className={`${f ? "fa-solid" : "fa-regular"} fa-heart`}></i>
        </button>
      </div>
      <div className="info">
        <span className="cat">{catName(b.c)}</span>
        <h3><button className="open" type="button" ref={titleRef} onClick={open}>{b.t}</button></h3>
        <span className="author">by {b.a}</span>
        <div className="meta">
          <span className="cond">{b.cond}</span>
          <span className={"price" + (b.type !== "sell" ? " free" : "")}>{priceLabel(b)}</span>
        </div>
      </div>
    </article>
  );
}
