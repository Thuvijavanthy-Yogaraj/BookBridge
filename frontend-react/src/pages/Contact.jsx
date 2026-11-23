import { useEffect, useState } from "react";
import { PageLayout } from "../components/Layout.jsx";
import Field from "../components/Field.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useForm, useTitle } from "../lib/hooks.js";
import { emailCheck, first, nameCheck } from "../lib/books.js";

const blank = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  useTitle("Contact Us – BookBridge");
  const { user, call, toast } = useApp();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const form = useForm(blank, {
    name: nameCheck,
    email: emailCheck,
    subject: (v) => (v ? "" : "Choose a topic."),
    message: (v) => (v.length < 10 ? "Write at least 10 characters." : ""),
  });

  // Fill in the name and email of a logged-in user
  useEffect(() => {
    if (user) form.setValues((v) => ({ ...v, name: v.name || user.name, email: v.email || user.email }));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.validate()) return;
    const v = form.trimmed();
    setBusy(true);
    try {
      await call("POST", "/contact", v);
      form.setValues(blank);
      setMsg(`Thanks, ${first(v.name)}! We've got your message and will reply within 2 working days.`);
    } catch (err) {
      toast(err.message);
    }
    setBusy(false);
  };

  return (
    <PageLayout title="Contact us" text="Questions, feedback or a book you'd like to see? Send us a note.">
      <div className="contact-grid">
        <form className="card form-card" noValidate onSubmit={submit}>
          <Field form={form} id="name" label="Full name" type="text" autoComplete="name" />
          <Field form={form} id="email" label="Email" type="email" autoComplete="email" />
          <Field form={form} id="subject" label="Topic" as="select">
            <option value="">Choose a topic</option>
            <option>Buying a book</option><option>Giving a book away</option><option>Report a problem</option><option>Other</option>
          </Field>
          <Field form={form} id="message" label="Message" as="textarea" rows={5} />
          <button className="btn btn-primary" type="submit" disabled={busy}><i className="fa-solid fa-paper-plane"></i>Send message</button>
          {msg && <p className="form-msg" role="status">{msg}</p>}
        </form>
        <div className="side">
          <div className="card info-card"><i className="fa-solid fa-envelope"></i><div><strong>Email</strong><br />hello@bookbridge.example</div></div>
          <div className="card info-card"><i className="fa-solid fa-location-dot"></i><div><strong>Campus meet-up point</strong><br />Library entrance</div></div>
          <div className="card info-card"><i className="fa-solid fa-clock"></i><div><strong>Reply time</strong><br />Within 2 working days</div></div>
          <div className="card faq">
            <h2>Quick answers</h2>
            <details><summary>Is BookBridge free to use?</summary><p>Yes. Listing and giving away books is free.</p></details>
            <details><summary>How do exchanges work?</summary><p>Message the owner, agree on a swap, and meet on campus.</p></details>
            <details><summary>How do I list a book?</summary><p>Log in, open Share a Book, add a few details and a photo, and you are done.</p></details>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
