import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Browse from "../components/Browse.jsx";
import BookCover from "../components/BookCover.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useBodyClass, useTitle } from "../lib/hooks.js";

export default function Home() {
  useBodyClass("home");
  useTitle("BookBridge – Books deserve a second chapter");
  const { books, ready, openBook } = useApp();
  const freeStack = ready ? books.filter((b) => b.type === "free").slice(0, 4) : [];
  /* Real covers of books on the site, shown in the hero */
  const wall = books.filter((b) => b.isbn || b.img).slice(0, 6);

  return (
    <>
      <a className="skip" href="#browse">Skip to books</a>
      <Header />
      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div>
              <span className="badge"><i className="fa-solid fa-leaf" aria-hidden="true"></i>Give books a second life</span>
              <h1>Books deserve a second chapter.</h1>
              <p className="lead">BookBridge connects students who want to find, buy, swap or give away used books, so study materials stay affordable and good books never gather dust.</p>
              <div className="hero-btns">
                <Link to="/#browse" className="btn btn-primary"><i className="fa-solid fa-magnifying-glass"></i>Find a Book</Link>
                <Link to="/list-book" className="btn btn-outline"><i className="fa-solid fa-hand-holding-heart"></i>Share a Book</Link>
              </div>
              <div className="community">
                <div className="avatars" aria-hidden="true">
                  <span style={{ background: "#3f7d58" }}>A</span><span style={{ background: "#c98a4b" }}>M</span>
                  <span style={{ background: "#2f4a5c" }}>S</span><span style={{ background: "#8a5a44" }}>R</span>
                </div>
                Made for students, by students
              </div>
            </div>
            <div className="hero-visual">
              <div className="cover-wall" aria-label="Books listed on BookBridge">
                {wall.map((b) => (
                  <button key={b.id} type="button" onClick={(e) => openBook(b.id, e.currentTarget)} aria-label={`View ${b.t}`}>
                    <BookCover book={b} />
                  </button>
                ))}
              </div>
              <div className="float-card b"><span className="ic"><i className="fa-solid fa-recycle"></i></span><div><strong>Reuse, don't waste</strong><small>Every swap saves a book</small></div></div>
              <div className="float-card a"><span className="ic"><i className="fa-solid fa-people-group"></i></span><div><strong>Student community</strong><small>Swap with classmates</small></div></div>
            </div>
          </div>
        </section>

        <section className="impact" aria-labelledby="impactT">
          <div className="container">
            <h2 id="impactT" className="sr" style={{ position: "absolute", left: -999 }}>Our impact</h2>
            <div className="impact-box">
              <div><i className="fa-solid fa-book" aria-hidden="true"></i><strong>248+</strong>Books Reused</div>
              <div><i className="fa-solid fa-user-graduate" aria-hidden="true"></i><strong>126+</strong>Students Helped</div>
              <div><i className="fa-solid fa-gift" aria-hidden="true"></i><strong>85+</strong>Free Books</div>
            </div>
          </div>
        </section>

        <Browse />

        <section className="how" id="how">
          <div className="container">
            <div className="head"><h2>How BookBridge works</h2><p>Three simple steps from shelf to student.</p></div>
            <div className="steps">
              <article className="step"><span className="num">01</span><div className="ic"><i className="fa-solid fa-magnifying-glass"></i></div><h3>Find a Book</h3><p>Search or browse listings for the textbooks and novels you need, sorted by condition and price.</p></article>
              <article className="step"><span className="num">02</span><div className="ic"><i className="fa-solid fa-comments"></i></div><h3>Connect</h3><p>Message the student who listed it and agree to buy, swap or collect it on campus.</p></article>
              <article className="step"><span className="num">03</span><div className="ic"><i className="fa-solid fa-house-chimney"></i></div><h3>Give It a New Home</h3><p>Pass on books you have finished with, so the next student can start their chapter.</p></article>
            </div>
          </div>
        </section>

        <section id="free-shelf" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="shelf">
              <div>
                <h2>The Free Shelf</h2>
                <p>Finished your course? Give your books away for free. Someone in your community is looking for exactly what is gathering dust on your shelf.</p>
                <ul>
                  <li><i className="fa-solid fa-circle-check"></i>List a book in under a minute</li>
                  <li><i className="fa-solid fa-circle-check"></i>Choose who gets it</li>
                  <li><i className="fa-solid fa-circle-check"></i>Help a classmate save money</li>
                </ul>
                <Link to="/list-book?type=free" className="btn btn-primary"><i className="fa-solid fa-hand-holding-heart"></i>Share a Free Book</Link>
              </div>
              <div className="shelf-visual">
                <div className="float-card b" style={{ right: -10, top: 18 }}><span className="ic"><i className="fa-solid fa-hand-holding-heart"></i></span><div><strong>Give it away</strong><small>Free for a fellow student</small></div></div>
                <div className="stack">
                  {freeStack.map((b) => (
                    <button key={b.id} type="button" onClick={(e) => openBook(b.id, e.currentTarget)} aria-label={`View ${b.t}`}>
                      <BookCover book={b} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-wrap">
          <div className="container">
            <div className="cta">
              <h2>Got books gathering dust?</h2>
              <p>List them in a minute. Sell, swap or give them away to a student who needs them.</p>
              <div className="hero-btns" style={{ justifyContent: "center", margin: 0 }}>
                <Link to="/list-book" className="btn btn-amber"><i className="fa-solid fa-plus"></i>Share a Book</Link>
                <Link to="/#browse" className="btn btn-light">Browse Books</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer full />
    </>
  );
}
