import { Link } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useApp } from "../context/AppContext.jsx";

/* Header + coloured banner + page body + footer, used by the inner pages */
export function PageLayout({ title, text, children }) {
  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="container"><h1>{title}</h1><p>{text}</p></div>
      </section>
      <main className="page"><div className="container">{children}</div></main>
      <Footer />
    </>
  );
}

/* Shows a "please log in" card instead of the page content when nobody is logged in */
export function AuthGate({ children }) {
  const { user } = useApp();
  if (user) return children;
  return (
    <div className="card empty-card">
      <i className="fa-regular fa-circle-user"></i>
      <p>Please log in to use this page.</p>
      <div className="row-btns">
        <Link to="/login" className="btn btn-primary btn-sm">Log In</Link>
        <Link to="/register" className="btn btn-outline btn-sm">Register</Link>
      </div>
    </div>
  );
}
