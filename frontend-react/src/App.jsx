import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BookModal from "./components/BookModal.jsx";
import Toast from "./components/Toast.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Contact from "./pages/Contact.jsx";
import ListBook from "./pages/ListBook.jsx";

/* Scrolls to #section links (e.g. /#browse, /profile#orders), or to the top on a new page */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0, timer;
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (tries++ < 20) timer = setTimeout(go, 50);
    };
    go();
    return () => clearTimeout(timer);
  }, [pathname, hash, key]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/list-book" element={<ListBook />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
      <BookModal />
      <Toast />
    </>
  );
}

/* Old addresses like /login.html still work; anything unknown goes home */
function Fallback() {
  const { pathname, search, hash } = useLocation();
  const page = /^\/([a-z-]+)\.html$/.exec(pathname)?.[1];
  const to = page && page !== "index" ? "/" + page : "/";
  return <Navigate to={to + search + hash} replace />;
}
