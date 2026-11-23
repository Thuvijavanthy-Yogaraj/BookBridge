import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthGate, PageLayout } from "../components/Layout.jsx";
import BookCard from "../components/BookCard.jsx";
import BookCover from "../components/BookCover.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useTitle } from "../lib/hooks.js";
import { typeLabel } from "../lib/books.js";

export default function Profile() {
  useBodyClass("bg-profile");
  useTitle("My Profile – BookBridge");
  return (
    <PageLayout
      title="My profile"
      text="Your saved books, orders and listings."
     
    >
      <AuthGate><ProfileBody /></AuthGate>
    </PageLayout>
  );
}

const day = (o) => {
  const d = new Date(o.created);
  return isNaN(d) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) + " · ";
};

function ProfileBody() {
  const { user, books, favs, orders, removeListing, toast } = useApp();
  const [removing, setRemoving] = useState(null);

  const saved = [...favs].map((id) => books.find((b) => b.id === id)).filter(Boolean);
  const mine = books.filter((b) => b.owner === user.id).reverse();

  const remove = async (id) => {
    setRemoving(id);
    try { await removeListing(id); toast("Listing removed"); }
    catch (err) { toast(err.message); }
    setRemoving(null);
  };

  return (
    <>
      <div className="card profile-head">
        <div className="avatar" aria-hidden="true">{user.name?.trim()[0]?.toUpperCase() || "?"}</div>
        <div className="grow"><h2>{user.name}</h2><p className="muted">{user.email}{user.uni ? ", " + user.uni : ""}</p></div>
        <Link to="/settings" className="btn btn-outline btn-sm"><i className="fa-solid fa-gear"></i>Edit profile</Link>
        <Link to="/list-book" className="btn btn-primary btn-sm"><i className="fa-solid fa-plus"></i>Share a book</Link>
      </div>

      <div className="stats3">
        <div className="card"><strong>{saved.length}</strong>Saved books</div>
        <div className="card"><strong>{orders.length}</strong>Orders and requests</div>
        <div className="card"><strong>{mine.length}</strong>Books listed</div>
      </div>

      <h2 className="sec-title">Saved books</h2>
      <div className="grid">
        {saved.length ? saved.map((b) => <BookCard key={b.id} book={b} />) : (
          <div className="card empty-card" style={{ gridColumn: "1/-1" }}>
            <i className="fa-regular fa-heart"></i>
            <p>No saved books yet. Tap the heart on any book to keep it here.</p>
            <Link to="/#browse" className="btn btn-primary btn-sm">Browse books</Link>
          </div>
        )}
      </div>

      <h2 className="sec-title" id="orders">My orders and requests</h2>
      <ul className="rows">
        {orders.length ? orders.map((o, i) => (
          <li className="row" key={o.id ?? i}>
            <div>
              <strong>{o.title}</strong>
              <span className="muted">{day(o)}{o.pickup}{o.offer ? " · Offering " + o.offer : ""}{o.type === "sell" ? " · $" + o.price : ""}</span>
            </div>
            <span className="status">{o.status}</span>
          </li>
        )) : (
          <li className="card empty-card">
            <i className="fa-solid fa-bag-shopping"></i>
            <p>You haven't ordered or requested a book yet.</p>
            <Link to="/#browse" className="btn btn-primary btn-sm">Find a book</Link>
          </li>
        )}
      </ul>

      <h2 className="sec-title" id="listings">My listings</h2>
      <ul className="rows">
        {mine.length ? mine.map((b) => (
          <li className="row" key={b.id}>
            <BookCover book={b} />
            <div>
              <strong>{b.t}</strong>
              <span className="muted">{typeLabel(b)}{b.type === "sell" ? " · $" + b.p : ""} · {b.cond}</span>
            </div>
            <button className="btn btn-outline btn-sm" type="button" aria-label={`Remove ${b.t}`} disabled={removing === b.id} onClick={() => remove(b.id)}>
              <i className="fa-solid fa-trash"></i>Remove
            </button>
          </li>
        )) : (
          <li className="card empty-card">
            <i className="fa-solid fa-box-open"></i>
            <p>You haven't listed a book yet.</p>
            <Link to="/list-book" className="btn btn-primary btn-sm">Share a book</Link>
          </li>
        )}
      </ul>
    </>
  );
}
