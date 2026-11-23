import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import BookCover from "./BookCover.jsx";

/* Full-screen split layout for Log in and Register: a green panel of book covers and the form */
export default function AuthLayout({ chips, heading, text, title, sub, children, footer }) {
  const { books } = useApp();
  const covers = books.filter((b) => b.isbn || b.img).slice(6, 18);
  return (
    <main className="auth-page">
      <div className="auth-split">
        <aside className="auth-art">
          <div className="art-covers" aria-hidden="true">{covers.map((b) => <BookCover key={b.id} book={b} />)}</div>
          <Link to="/" className="art-back"><i className="fa-solid fa-arrow-left" aria-hidden="true"></i>Back to home</Link>
          <span className="art-chip c1"><i className={`fa-solid ${chips[0][0]}`}></i>{chips[0][1]}</span>
          <span className="art-chip c2"><i className={`fa-solid ${chips[1][0]}`}></i>{chips[1][1]}</span>
          <div className="art-bottom">
            <h2>{heading}</h2>
            <p>{text}</p>
            <ul>
              <li><i className="fa-solid fa-tag"></i>Affordable used books</li>
              <li><i className="fa-solid fa-gift"></i>Free books from students</li>
              <li><i className="fa-solid fa-repeat"></i>Swap with your classmates</li>
            </ul>
            <div className="mini-stats">
              <div><strong>248+</strong><small>Books reused</small></div>
              <div><strong>126+</strong><small>Students helped</small></div>
              <div><strong>85+</strong><small>Free books</small></div>
            </div>
          </div>
        </aside>
        <div className="auth-card">
          <Link to="/" className="logo" aria-label="BookBridge home"><i className="fa-solid fa-book-open" aria-hidden="true"></i>BookBridge</Link>
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
          {children}
          {footer}
        </div>
      </div>
    </main>
  );
}
