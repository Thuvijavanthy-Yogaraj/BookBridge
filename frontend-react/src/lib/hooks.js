import { useCallback, useEffect, useRef, useState } from "react";

/* Adds a class to <body> while a page is shown (pages use it for their backgrounds). */
export function useBodyClass(cls) {
  useEffect(() => {
    if (!cls) return;
    const list = cls.split(" ");
    document.body.classList.add(...list);
    return () => document.body.classList.remove(...list);
  }, [cls]);
}

export function useTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}

/* Small form helper.
   checks: { fieldId: (trimmedValue, allValues) => "error message" or "" }
   Errors show after the first submit and update as the user types. */
export function useForm(initial, checks = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const checksRef = useRef(checks);
  checksRef.current = checks;

  const run = (id, v, all) => checksRef.current[id](typeof v === "string" ? v.trim() : v, all);

  const onChange = useCallback((e) => {
    const { id, type, checked, value } = e.target;
    const v = type === "checkbox" ? checked : value;
    setValues((prev) => {
      const next = { ...prev, [id]: v };
      setErrors((er) => (er[id] && checksRef.current[id] ? { ...er, [id]: run(id, v, next) } : er));
      return next;
    });
  }, []);

  /* Checks every field, shows the errors, focuses the first bad one. Returns true when all is fine. */
  const validate = () => {
    const errs = {};
    for (const id of Object.keys(checksRef.current)) errs[id] = run(id, values[id] ?? "", values);
    setErrors(errs);
    const bad = Object.keys(errs).find((k) => errs[k]);
    if (bad) document.getElementById(bad)?.focus();
    return !bad;
  };

  const setError = useCallback((id, msg) => setErrors((e) => ({ ...e, [id]: msg })), []);

  const trimmed = () =>
    Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));

  return { values, setValues, errors, setError, onChange, validate, trimmed, checks: checksRef.current };
}
