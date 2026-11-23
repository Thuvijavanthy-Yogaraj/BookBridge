import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGate, PageLayout } from "../components/Layout.jsx";
import Field from "../components/Field.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useForm, useTitle } from "../lib/hooks.js";
import { emailCheck, nameCheck } from "../lib/books.js";

export default function Settings() {
  useBodyClass("bg-settings");
  useTitle("Settings – BookBridge");
  return (
    <PageLayout title="Settings" text="Manage your details and preferences.">
      <AuthGate><SettingsBody /></AuthGate>
    </PageLayout>
  );
}

const fromUser = (u) => ({
  name: u.name || "", email: u.email || "", uni: u.uni || "", contactPref: u.contactPref || "Email",
  n1: !!u.n1, n2: !!u.n2, n3: !!u.n3,
});

function SettingsBody() {
  const { user, call, setUser, toast, clearSession } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const form = useForm(fromUser(user), { name: nameCheck, email: emailCheck });

  // Fill the form again when fresh details arrive from the server
  useEffect(() => { form.setValues(fromUser(user)); }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    if (!form.validate()) return;
    const v = form.trimmed();
    setBusy(true);
    try {
      const u = await call("PUT", "/me", { ...v, email: v.email.toLowerCase() });
      setUser(u);
      toast("Settings saved");
    } catch (err) {
      if (err.status === 409) { form.setError("email", err.message); document.getElementById("email")?.focus(); }
      else toast(err.message);
    }
    setBusy(false);
  };

  const del = async () => {
    if (!window.confirm("Delete your account and everything linked to it?")) return;
    try { await call("DELETE", "/me"); } catch (err) { toast(err.message); return; }
    clearSession();
    navigate("/");
  };

  const toggle = (id, children) => (
    <label className="toggle" key={id}>
      <input type="checkbox" id={id} checked={!!form.values[id]} onChange={form.onChange} />
      <span></span>{children}
    </label>
  );

  return (
    <div className="narrow">
      <form className="card form-card" noValidate onSubmit={submit}>
        <h2>Your details</h2>
        <Field form={form} id="name" label="Full name" type="text" autoComplete="name" />
        <Field form={form} id="email" label="Email" type="email" autoComplete="email" />
        <Field form={form} id="uni" label="University or school" type="text" autoComplete="organization" />
        <Field form={form} id="contactPref" label="Preferred way to be contacted" as="select">
          <option>Email</option><option>Phone</option><option>In-app message</option>
        </Field>
        <h2>Preferences</h2>
        {toggle("n1", "Email me when a saved book is available")}
        {toggle("n2", "Show my first name on my listings")}
        {toggle("n3", "Send me the monthly BookBridge newsletter")}
        <button className="btn btn-primary" type="submit" style={{ marginTop: 22 }} disabled={busy}>
          <i className="fa-solid fa-floppy-disk"></i>Save changes
        </button>
      </form>
      <div className="card form-card danger">
        <h2>Delete account</h2>
        <p className="muted">Removes your account, listings, orders and saved books.</p>
        <button className="btn btn-outline btn-sm" type="button" onClick={del}><i className="fa-solid fa-trash"></i>Delete my account</button>
      </div>
    </div>
  );
}
