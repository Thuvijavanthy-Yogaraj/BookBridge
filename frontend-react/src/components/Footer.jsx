import { Link } from "react-router-dom";

/* Big footer on the home page, a one-line footer on the other pages */
export default function Footer({ full = false }) {
  if (!full) {
    return (
      <footer>
        <div className="container">
          <p className="copy" style={{ maxWidth: "none", margin: 0, padding: 0 }}>
            &copy; 2026 BookBridge. Books deserve a second chapter. <Link to="/" style={{ textDecoration: "underline" }}>Back to home</Link>
          </p>
        </div>
      </footer>
    );
  }
  return (
    <footer>
      <div className="container">
        <div className="foot">
          <div>
            <Link to="/" className="logo" aria-label="BookBridge home"><i className="fa-solid fa-book-open" aria-hidden="true"></i>BookBridge</Link>
            <p>A student platform for finding, exchanging and giving away used books. Books deserve a second chapter.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li><Link to="/#browse">Browse Books</Link></li>
              <li><Link to="/#free-shelf">Free Shelf</Link></li>
              <li><Link to="/#how">How It Works</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/list-book">Share a Book</Link></li>
            </ul>
          </div>
          <div>
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Log In</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <p className="copy" style={{ maxWidth: "none", marginTop: 0 }}>&copy; 2026 BookBridge. Books deserve a second chapter.</p>
      </div>
    </footer>
  );
}
