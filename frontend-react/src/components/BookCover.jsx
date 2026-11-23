import { useEffect, useState } from "react";
import { coverSrc, genCover } from "../lib/books.js";

/* Book cover image that falls back to a generated cover if the photo fails to load */
export default function BookCover({ book, onClick }) {
  const [src, setSrc] = useState(() => coverSrc(book));
  useEffect(() => { setSrc(coverSrc(book)); }, [book.id, book.img, book.isbn]); // eslint-disable-line react-hooks/exhaustive-deps

  const fallback = genCover(book);
  return (
    <img
      src={src}
      alt={`Cover of ${book.t}`}
      loading="lazy"
      onClick={onClick}
      onError={() => { if (src !== fallback) setSrc(fallback); }}
    />
  );
}
