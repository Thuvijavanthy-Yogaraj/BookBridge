import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, store } from "../lib/api.js";
import { fromApi } from "../lib/books.js";
import { sampleBooks } from "../data/books.js";

/* App-wide state: the session, the book list, favourites, orders, the toast and the open book window. */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => store.get("bb_token", null));
  const [user, setUserState] = useState(() => (store.get("bb_token", null) ? store.get("bb_user", null) : null));
  const [books, setBooks] = useState(sampleBooks);
  const [favs, setFavs] = useState(() => new Set());
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);
  const [toastState, setToastState] = useState({ msg: "", show: false });
  const [openBookId, setOpenBookId] = useState(null);

  const tokenRef = useRef(token);
  const toastTimer = useRef();
  const openerRef = useRef(null);

  /* API call that carries the current login token */
  const call = useCallback((method, path, body) => api(method, path, body, tokenRef.current), []);

  const toast = useCallback((msg) => {
    setToastState({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((t) => ({ ...t, show: false })), 2400);
  }, []);

  const setUser = useCallback((u) => {
    setUserState(u);
    store.set("bb_user", u);
  }, []);

  const setSession = useCallback((r) => {
    tokenRef.current = r.token;
    store.set("bb_token", r.token);
    setToken(r.token);
    setUser(r.user);
  }, [setUser]);

  const clearSession = useCallback(() => {
    tokenRef.current = null;
    store.del("bb_token");
    store.del("bb_user");
    setToken(null);
    setUserState(null);
    setFavs(new Set());
    setOrders([]);
  }, []);

  const logout = useCallback(async () => {
    try { await call("POST", "/logout"); } catch { /* ignore */ }
    clearSession();
  }, [call, clearSession]);

  const loadBooks = useCallback(async () => {
    const list = await call("GET", "/books");
    setBooks(list.map(fromApi));
  }, [call]);

  const loadOrders = useCallback(async () => {
    setOrders(await call("GET", "/orders"));
  }, [call]);

  /* Everything the pages need from the server. Reloads when someone logs in or out. */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const list = await call("GET", "/books");
        if (!live) return;
        setBooks(list.map(fromApi));
        if (token) {
          const me = await call("GET", "/me");
          const fv = await call("GET", "/favourites");
          const od = await call("GET", "/orders");
          if (!live) return;
          setUser(me);
          setFavs(new Set(fv.map((b) => String(b.id))));
          setOrders(od);
        }
      } catch (e) {
        if (!live) return;
        if (e.status === 401) clearSession();
        else toast(e.message);
      } finally {
        if (live) setReady(true);
      }
    })();
    return () => { live = false; };
  }, [token, call, clearSession, setUser, toast]);

  const toggleFav = useCallback((id) => {
    if (!tokenRef.current) { toast("Log in to save books"); return; }
    const had = favs.has(id);
    const flip = (remove) => setFavs((prev) => {
      const next = new Set(prev);
      remove ? next.delete(id) : next.add(id);
      return next;
    });
    flip(had);
    toast(had ? "Removed from favourites" : "Saved to favourites");
    call(had ? "DELETE" : "PUT", "/favourites/" + id).catch((err) => { flip(!had); toast(err.message); });
  }, [favs, call, toast]);

  const removeListing = useCallback(async (id) => {
    await call("DELETE", "/books/" + id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setFavs((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, [call]);

  const openBook = useCallback((id, opener) => {
    openerRef.current = opener || null;
    setOpenBookId(id);
  }, []);

  const closeBook = useCallback(() => {
    setOpenBookId(null);
    const op = openerRef.current;
    if (op && document.body.contains(op)) setTimeout(() => op.focus(), 0);
  }, []);

  const value = useMemo(() => ({
    token, user, books, favs, orders, ready, toastState, openBookId,
    call, toast, setUser, setSession, clearSession, logout,
    loadBooks, loadOrders, toggleFav, removeListing, openBook, closeBook,
  }), [token, user, books, favs, orders, ready, toastState, openBookId,
    call, toast, setUser, setSession, clearSession, logout,
    loadBooks, loadOrders, toggleFav, removeListing, openBook, closeBook]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
