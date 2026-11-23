import { useState } from "react";

/* A labelled form field wired to useForm. as = "input" | "select" | "textarea".
   Fields that have a check get an error line underneath. */
export default function Field({ form, id, label, as = "input", children, password, meter, ...rest }) {
  const error = form.errors[id];
  const checked = id in form.checks;
  const common = {
    id,
    value: form.values[id] ?? "",
    onChange: form.onChange,
    ...(checked ? { "aria-describedby": id + "-err", "aria-invalid": !!error } : {}),
    ...rest,
  };

  let control;
  if (as === "select") control = <select {...common}>{children}</select>;
  else if (as === "textarea") control = <textarea {...common} />;
  else if (password) control = <PasswordInput {...common} meter={meter} />;
  else control = <input {...common} />;

  return (
    <div className={"field" + (error ? " invalid" : "")}>
      <label htmlFor={id}>{label}</label>
      {control}
      {checked && <p className="err" id={id + "-err"}>{error || ""}</p>}
    </div>
  );
}

/* Password input with a show/hide button and an optional strength meter */
function PasswordInput({ meter, value, ...rest }) {
  const [show, setShow] = useState(false);
  const v = value || "";
  const score = v
    ? Math.min(4, (v.length >= 8) + /\d/.test(v) + (/[A-Z]/.test(v) && /[a-z]/.test(v)) + (/[^A-Za-z0-9]/.test(v) || v.length >= 12))
    : 0;
  return (
    <>
      <div className="pw">
        <input {...rest} value={v} type={show ? "text" : "password"} />
        <button className="eye" type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>
          <i className={`fa-regular fa-eye${show ? "-slash" : ""}`}></i>
        </button>
      </div>
      {meter && (
        <>
          <div className={"meter" + (score ? " s" + score : "")}><span></span><span></span><span></span><span></span></div>
          <small className="meter-t">{v ? ["Weak", "Fair", "Good", "Strong"][Math.max(0, score - 1)] + " password" : ""}</small>
        </>
      )}
    </>
  );
}
