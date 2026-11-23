import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { first } from "../lib/books.js";

const links = [
  { to: "/", label: "Home", page: "/" },
  { to: "/#browse", label: "Browse Books" },
  { to: "/#free-shelf", label: "Free Shelf" },
  { to: "/#how", label: "How It Works" },
  { to: "/contact", label: "Contact", page: "/contact" },
  { to: "/list-book", label: "Share a Book", page: "/list-book" },
];

export default function Header() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);
  const doLogout = async () => { close(); await logout(); navigate("/"); };

  return (
    <header>
      <div className="container nav">
        <Link to="/" className="logo" aria-label="BookBridge home"><i className="fa-solid fa-book-open" aria-hidden="true"></i>BookBridge</Link>
        <button className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="navMenu" onClick={() => setOpen(!open)}>
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
        <nav className={"nav-menu" + (open ? " open" : "")} id="navMenu" aria-label="Main">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close} aria-current={l.page === pathname ? "page" : undefined}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline btn-sm" onClick={close}><i className="fa-regular fa-circle-user"></i>{first(user.name)}</Link>
                <Link to="/settings" className="icon-btn" aria-label="Settings" onClick={close}><i className="fa-solid fa-gear"></i></Link>
                <button className="btn btn-primary btn-sm" type="button" onClick={doLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/profile" className="icon-btn" aria-label="My profile" onClick={close}><i className="fa-regular fa-user"></i></Link>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={close}>Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
