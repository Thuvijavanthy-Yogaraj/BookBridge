import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useForm, useTitle } from "../lib/hooks.js";
import { emailCheck, first, nameCheck } from "../lib/books.js";

export default function Register() {
  useBodyClass("bg-register");
  useTitle("Register – BookBridge");
  const { call, setSession, toast } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const form = useForm({ name: "", email: "", password: "", confirm: "" }, {
    name: nameCheck,
    email: emailCheck,
    password: (v) => (v.length < 8 ? "Use at least 8 characters." : !/\d/.test(v) ? "Include at least one number." : ""),
    confirm: (v, all) => (!v ? "Confirm your password." : v !== all.password ? "Passwords do not match." : ""),
  });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.validate()) return;
    setBusy(true);
    const v = form.trimmed();
    try {
      const r = await call("POST", "/register", { name: v.name, email: v.email, password: form.values.password });
      setSession(r);
      setMsg(`Welcome to BookBridge, ${first(r.user.name)}! Your account is ready.`);
      setTimeout(() => navigate("/"), 1100);
    } catch (err) {
      if (!err.status) toast(err.message);
      else {
        const id = err.status === 409 ? "email" : "password";
        form.setError(id, err.message);
        document.getElementById(id)?.focus();
      }
    }
    setBusy(false);
  };

  return (
    <AuthLayout
      chips={[["fa-hand-holding-heart", "Lend a book today"], ["fa-repeat", "Swap with a classmate"]]}
      heading="Give your books a second chapter"
      text="Join students who share, swap and save."
      title="Join BookBridge"
      sub="Create an account to start swapping books."
      footer={<p className="switch">Already have an account? <Link to="/login">Log in</Link></p>}
    >
      <form noValidate onSubmit={submit}>
        <Field form={form} id="name" label="Full Name" type="text" autoComplete="name" />
        <Field form={form} id="email" label="Email" type="email" autoComplete="email" />
        <Field form={form} id="password" label="Password" password meter autoComplete="new-password" />
        <Field form={form} id="confirm" label="Confirm Password" password autoComplete="new-password" />
        <button type="submit" className="btn btn-primary" disabled={busy}>Create Account</button>
        {msg && <p className="form-msg" role="status">{msg}</p>}
      </form>
    </AuthLayout>
  );
}
