/* Sample book data. Shown until the backend replies (and if it can't be reached).
   Covers load from Open Library by ISBN; a generated cover is the fallback. */
export const OL = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

export const categories = [
  { id: "cs", name: "Computer Science", icon: "fa-laptop-code", desc: "Programming, algorithms and software craft." },
  { id: "sci", name: "Science", icon: "fa-flask", desc: "Biology, chemistry, space and evolution." },
  { id: "math", name: "Math & Physics", icon: "fa-square-root-variable", desc: "Calculus, physics and the universe." },
  { id: "biz", name: "Business & Economics", icon: "fa-chart-line", desc: "Startups, money and how markets think." },
  { id: "lit", name: "Literature", icon: "fa-feather-pointed", desc: "Classic and modern novels for every reading list." },
  { id: "life", name: "Learning & Life", icon: "fa-seedling", desc: "Habits, thinking and design for everyday life." },
  { id: "hist", name: "History & Society", icon: "fa-landmark", desc: "How the world got here." },
  { id: "eng", name: "Engineering", icon: "fa-gears", desc: "Circuits, mechanics and materials." },
  { id: "med", name: "Medicine & Health", icon: "fa-stethoscope", desc: "Anatomy, physiology and clinical basics." },
  { id: "law", name: "Law & Politics", icon: "fa-scale-balanced", desc: "Justice, government and big ideas." },
  { id: "art", name: "Arts & Design", icon: "fa-palette", desc: "Art history, design and creativity." },
  { id: "lang", name: "Languages", icon: "fa-language", desc: "Grammar, writing and learning languages." },
  { id: "psy", name: "Psychology", icon: "fa-brain", desc: "Behaviour, motivation and the mind." },
];

/* Special shelves shown alongside the categories */
export const shelves = [
  { id: "all", name: "All books", icon: "fa-book-open-reader", desc: "Search everything on the shelf." },
  { id: "free", name: "Free Shelf", icon: "fa-gift", desc: "Books students are giving away." },
  { id: "swap", name: "Exchange Shelf", icon: "fa-repeat", desc: "Swap a book you have for one you need." },
];

const raw = [
  ["Introduction to Algorithms", "Thomas Cormen", "cs", "Like new", 28, "9780262033848"],
  ["Clean Code", "Robert C. Martin", "cs", "Good", 14, "9780132350884"],
  ["The Pragmatic Programmer", "Andrew Hunt", "cs", "Good", 16, "9780135957059"],
  ["Python Crash Course", "Eric Matthes", "cs", "Fair", 0, "9781593279288"],
  ["Cracking the Coding Interview", "Gayle McDowell", "cs", "Good", 18, "9780984782857"],
  ["Campbell Biology", "Lisa Urry", "sci", "Fair", 22, "9780321775658"],
  ["Cosmos", "Carl Sagan", "sci", "Good", 0, "9780345539434"],
  ["The Selfish Gene", "Richard Dawkins", "sci", "Like new", 0, "9780198788607"],
  ["Organic Chemistry", "Jonathan Clayden", "sci", "Good", 30, "9780199270293"],
  ["Calculus", "James Stewart", "math", "Good", 20, "9781285741550"],
  ["Fundamentals of Physics", "David Halliday", "math", "Fair", 24, "9781118230718"],
  ["A Brief History of Time", "Stephen Hawking", "math", "Good", 8, "9780553380163"],
  ["Zero to One", "Peter Thiel", "biz", "Like new", 10, "9780804139298"],
  ["The Lean Startup", "Eric Ries", "biz", "Good", 9, "9780307887894"],
  ["Freakonomics", "Steven Levitt", "biz", "Fair", 0, "9780060731335"],
  ["Rich Dad Poor Dad", "Robert Kiyosaki", "biz", "Good", 7, "9781612680194"],
  ["Pride and Prejudice", "Jane Austen", "lit", "Like new", 0, "9780141439518"],
  ["To Kill a Mockingbird", "Harper Lee", "lit", "Good", 0, "9780061120084"],
  ["1984", "George Orwell", "lit", "Good", 6, "9780451524935"],
  ["The Great Gatsby", "F. Scott Fitzgerald", "lit", "Fair", 5, "9780743273565"],
  ["Atomic Habits", "James Clear", "life", "Like new", 12, "9780735211292"],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "life", "Good", 11, "9780374533557"],
  ["The Design of Everyday Things", "Don Norman", "life", "Good", 13, "9780465050659"],
  ["Sapiens", "Yuval Noah Harari", "hist", "Good", 12, "9780062316097"],
  ["Guns, Germs, and Steel", "Jared Diamond", "hist", "Fair", 0, "9780393317558"],
  ["The Diary of a Young Girl", "Anne Frank", "hist", "Good", 0, "9780553296983"],
  ["The Art of Electronics", "Paul Horowitz", "eng", "Good", 32, "9780521809269"],
  ["Engineering Mechanics: Statics", "R. C. Hibbeler", "eng", "Fair", 21, "9780133918922"],
  ["Mechanics of Materials", "R. C. Hibbeler", "eng", "Good", 0, "9780134319650"],
  ["Gray's Anatomy for Students", "Richard Drake", "med", "Good", 34, "9780323393041"],
  ["Textbook of Medical Physiology", "Arthur Guyton", "med", "Fair", 26, "9781455770052"],
  ["Atlas of Human Anatomy", "Frank Netter", "med", "Like new", 38, "9780323393225"],
  ["Justice", "Michael Sandel", "law", "Good", 9, "9780374532505"],
  ["The Prince", "Niccolò Machiavelli", "law", "Fair", 0, "9780140449150"],
  ["The Republic", "Plato", "law", "Good", 6, "9780140455113"],
  ["The Story of Art", "E. H. Gombrich", "art", "Good", 17, "9780714832470"],
  ["Don't Make Me Think", "Steve Krug", "art", "Like new", 12, "9780321965516"],
  ["Steal Like an Artist", "Austin Kleon", "art", "Good", 0, "9780761169253"],
  ["English Grammar in Use", "Raymond Murphy", "lang", "Good", 10, "9780521189064"],
  ["The Elements of Style", "William Strunk Jr.", "lang", "Fair", 0, "9780205309023"],
  ["Fluent Forever", "Gabriel Wyner", "lang", "Like new", 14, "9780385348119"],
  ["Man's Search for Meaning", "Viktor Frankl", "psy", "Good", 7, "9780807014295"],
  ["Influence", "Robert Cialdini", "psy", "Good", 11, "9780061241895"],
  ["The Power of Habit", "Charles Duhigg", "psy", "Fair", 0, "9780812981605"],
];

const swaps = {
  "Fundamentals of Physics": "Any calculus or chemistry textbook",
  "1984": "A modern fiction novel",
  "The Lean Startup": "Any business or marketing book",
};

export const sampleBooks = raw.map(([t, a, c, cond, p, isbn], i) => {
  const b = {
    id: "s" + i, t, a, c, cond, p, isbn,
    type: p ? "sell" : "free",
    ownerName: ["Nimal", "Sara", "Kavindu", "Amaya", "Ravi"][i % 5],
    owner: "community" + i,
  };
  if (swaps[t]) Object.assign(b, { type: "swap", p: 0, wants: swaps[t] });
  return b;
});
