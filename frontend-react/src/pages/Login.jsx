import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useForm, useTitle } from "../lib/hooks.js";
import { emailCheck, first } from "../lib/books.js";

export default function Login() {
  useBodyClass("bg-login");
  useTitle("Log In – BookBridge");
  const { call, setSession, toast } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const form = useForm({ email: "", password: "" }, {
    email: emailCheck,
    password: (v) => (v ? "" : "Enter your password."),
  });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.validate()) return;
    setBusy(true);
    try {
      const r = await call("POST", "/login", { email: form.values.email.trim(), password: form.values.password });
      setSession(r);
      setMsg(`Welcome back, ${first(r.user.name)}! Taking you to BookBridge...`);
      setTimeout(() => navigate("/"), 1100);
    } catch (err) {
      if (!err.status) toast(err.message);
      else { form.setError("password", err.message); document.getElementById("password")?.focus(); }
    }
    setBusy(false);
  };

  return (
    <AuthLayout
      chips={[["fa-gift", "Free books this week"], ["fa-book-open-reader", "Your next read is waiting"]]}
      heading="Welcome back to the shelf"
      text="Pick up where you left off and find your next read."
      title="Welcome back"
      sub="Log in to find and share books."
      footer={<p className="switch">Don't have an account? <Link to="/register">Register</Link></p>}
    >
      <form noValidate onSubmit={submit}>
        <Field form={form} id="email" label="Email" type="email" autoComplete="email" />
        <Field form={form} id="password" label="Password" password autoComplete="current-password" />
        <button type="submit" className="btn btn-primary" disabled={busy}>Log In</button>
        {msg && <p className="form-msg" role="status">{msg}</p>}
      </form>
    </AuthLayout>
  );
}
