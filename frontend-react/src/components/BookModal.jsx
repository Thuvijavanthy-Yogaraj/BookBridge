import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { catName, first, priceLabel, typeLabel } from "../lib/books.js";
import BookCover from "./BookCover.jsx";

/* Book detail window with buy / request / exchange */
export default function BookModal() {
  const { openBookId, books, closeBook } = useApp();
  const book = books.find((b) => b.id === openBookId);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!book) return;
    document.body.classList.add("noscroll");
    const onKey = (e) => e.key === "Escape" && closeBook();
    document.addEventListener("keydown", onKey);
    boxRef.current?.focus();
    return () => {
      document.body.classList.remove("noscroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [book?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!book) return null;
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && closeBook()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="mTitle" tabIndex={-1} ref={boxRef}>
        <button className="modal-x" type="button" aria-label="Close" onClick={closeBook}><i className="fa-solid fa-xmark"></i></button>
        <Detail key={book.id} b={book} />
      </div>
    </div>
  );
}

function Detail({ b }) {
  const { user, call, loadOrders, toast, closeBook } = useApp();
  const [offer, setOffer] = useState("");
  const [offerErr, setOfferErr] = useState("");
  const [pickup, setPickup] = useState("Meet on campus");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const doneRef = useRef(null);

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  const mine = user && b.owner === user.id;
  const verb = b.type === "sell" ? "buy" : b.type === "free" ? "request" : "swap for";
  const who = first(b.ownerName) || "the owner";

  const submit = async (e) => {
    e.preventDefault();
    if (b.type === "swap" && !offer.trim()) {
      setOfferErr("Tell them which book you'd offer.");
      document.getElementById("offer")?.focus();
      return;
    }
    const status = b.type === "sell" ? "Order placed" : b.type === "free" ? "Request sent" : "Exchange proposed";
    setBusy(true);
    try {
      await call("POST", "/orders", { bookId: +b.id, pickup, note: note.trim(), offer: offer.trim() });
      await loadOrders();
    } catch (err) {
      setBusy(false);
      toast(err.message);
      return;
    }
    toast(status);
    setDone({ status, offer: offer.trim() });
  };

  if (done) {
    return (
      <div className="success">
        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
        <h2 id="mTitle" tabIndex={-1} ref={doneRef}>{done.status}!</h2>
        <p>
          {b.type === "sell"
            ? `${b.t} is reserved for you. Agree a time with ${who} and pay when you collect it.`
            : b.type === "free"
              ? `We've let ${who} know you'd love ${b.t}. They'll get in touch to arrange pickup.`
              : `${who} will look at your offer of ${done.offer}. Watch your orders for their reply.`}
        </p>
        <div className="row-btns">
          <Link className="btn btn-primary btn-sm" to="/profile#orders" onClick={closeBook}>View my orders</Link>
          <button className="btn btn-outline btn-sm" type="button" onClick={closeBook}>Keep browsing</button>
        </div>
      </div>
    );
  }

  let action;
  if (mine) action = <p className="notice">This is your listing.</p>;
  else if (!user) {
    action = (
      <>
        <p className="muted" style={{ marginBottom: 12 }}>Log in or create an account to {verb} this book.</p>
        <div className="row-btns">
          <Link className="btn btn-primary btn-sm" to="/login" onClick={closeBook}>Log in</Link>
          <Link className="btn btn-outline btn-sm" to="/register" onClick={closeBook}>Register</Link>
        </div>
      </>
    );
  } else {
    action = (
      <form noValidate onSubmit={submit}>
        {b.type === "swap" && (
          <div className={"field" + (offerErr ? " invalid" : "")}>
            <label htmlFor="offer">Book you'll offer in exchange</label>
            <input id="offer" type="text" aria-describedby="offer-err" aria-invalid={!!offerErr} value={offer}
              onChange={(e) => { setOffer(e.target.value); if (offerErr && e.target.value.trim()) setOfferErr(""); }} />
            <p className="err" id="offer-err">{offerErr}</p>
          </div>
        )}
        <div className="field">
          <label htmlFor="pickup">Pickup</label>
          <select id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)}>
            <option>Meet on campus</option><option>Courier delivery</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="note">Message to {who} (optional)</label>
          <textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          <i className={`fa-solid ${b.type === "sell" ? "fa-bag-shopping" : b.type === "free" ? "fa-hand-holding-heart" : "fa-repeat"}`}></i>
          {b.type === "sell" ? "Place order for $" + b.p : b.type === "free" ? "Request this book" : "Propose exchange"}
        </button>
        {b.type === "sell" && <p className="muted small">You pay the seller when you collect the book.</p>}
      </form>
    );
  }

  return (
    <div className="detail">
      <div className="d-cover"><BookCover book={b} /></div>
      <div className="d-info">
        <span className="cat">{catName(b.c)}</span>
        <h2 id="mTitle">{b.t}</h2>
        <p className="author">by {b.a}</p>
        <div className="tags"><span className="cond">{b.cond}</span><span className="cond">{typeLabel(b)}</span></div>
        <p className="desc">{b.desc || "A well-kept copy, ready for its next reader."}</p>
        <ul className="facts">
          <li><i className="fa-solid fa-user"></i>Listed by {b.ownerName || "a BookBridge student"}</li>
          <li><i className="fa-solid fa-location-dot"></i>{b.place || "Campus library entrance"}</li>
          {b.type === "swap" && <li><i className="fa-solid fa-repeat"></i>Wants: {b.wants || "open to offers"}</li>}
        </ul>
        <div className="d-price">{priceLabel(b)}</div>
        {action}
      </div>
    </div>
  );
}
