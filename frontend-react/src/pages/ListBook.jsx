import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthGate, PageLayout } from "../components/Layout.jsx";
import Field from "../components/Field.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useForm, useTitle } from "../lib/hooks.js";
import { categories } from "../data/books.js";

export default function ListBook() {
  useBodyClass("bg-share");
  useTitle("Share a Book – BookBridge");
  return (
    <PageLayout title="Share a book" text="Sell it, swap it or give it to a student who needs it.">
      <AuthGate><ListForm /></AuthGate>
    </PageLayout>
  );
}

/* Shrinks a chosen photo to 360px wide and returns it as a JPEG data URL */
function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const s = Math.min(1, 360 / im.width);
        const c = document.createElement("canvas");
        c.width = im.width * s;
        c.height = im.height * s;
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.75));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const types = [
  { value: "sell", icon: "fa-tag", label: "Sell" },
  { value: "free", icon: "fa-gift", label: "Give away" },
  { value: "swap", icon: "fa-repeat", label: "Exchange" },
];

function ListForm() {
  const { call, loadBooks, toast } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const start = params.get("type");
  const [type, setType] = useState(["free", "swap"].includes(start) ? start : "sell");
  const [img, setImg] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const form = useForm(
    { title: "", author: "", category: "", condition: "Good", price: "", wants: "", description: "", place: "Campus library entrance" },
    {
      title: (v) => (v.length < 2 ? "Enter the book title." : ""),
      author: (v) => (v.length < 2 ? "Enter the author." : ""),
      category: (v) => (v ? "" : "Choose a category."),
      price: (v) => (type === "sell" && !(+v > 0) ? "Enter a price above 0." : ""),
      wants: (v) => (type === "swap" && v.length < 2 ? "Say what you'd like in return." : ""),
    }
  );

  const onPhoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { setImg(await resizePhoto(f)); } catch { toast("That photo couldn't be read. Try another one."); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.validate()) return;
    const v = form.trimmed();
    setBusy(true);
    try {
      await call("POST", "/books", {
        title: v.title, author: v.author, category: v.category, condition: v.condition, type,
        price: type === "sell" ? Math.round(+v.price) : 0,
        wants: type === "swap" ? v.wants : "",
        description: v.description,
        place: v.place || "Campus library entrance",
        image: img,
      });
      setMsg("Your book is now listed! Taking you to your listings...");
      loadBooks().catch(() => {});
      setTimeout(() => navigate("/profile#listings"), 1200);
    } catch (err) {
      toast(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="narrow">
      <form className="card form-card" noValidate onSubmit={submit}>
        <fieldset className="types">
          <legend className="lbl">What would you like to do?</legend>
          {types.map((t) => (
            <label key={t.value}>
              <input type="radio" name="ltype" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} />
              <span><i className={`fa-solid ${t.icon}`}></i><br />{t.label}</span>
            </label>
          ))}
        </fieldset>
        <Field form={form} id="title" label="Book title" type="text" />
        <Field form={form} id="author" label="Author" type="text" />
        <div className="two">
          <Field form={form} id="category" label="Category" as="select">
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Field>
          <Field form={form} id="condition" label="Condition" as="select">
            <option>Like new</option><option>Good</option><option>Fair</option>
          </Field>
        </div>
        {type === "sell" && <Field form={form} id="price" label="Price (USD)" type="number" min="1" step="1" />}
        {type === "swap" && <Field form={form} id="wants" label="What would you like in return?" type="text" />}
        <Field form={form} id="description" label="Description (optional)" as="textarea" rows={3}
          placeholder="Edition, highlights, notes, anything a buyer should know" />
        <Field form={form} id="place" label="Pickup place" type="text" />
        <div className="field">
          <label htmlFor="cover">Cover photo (optional)</label>
          <input id="cover" type="file" accept="image/*" onChange={onPhoto} />
          {img && <img className="preview" src={img} alt="Preview of your book cover" />}
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}><i className="fa-solid fa-upload"></i>List my book</button>
        {msg && <p className="form-msg" role="status">{msg}</p>}
      </form>
    </div>
  );
}
