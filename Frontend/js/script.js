/* BookBridge – frontend. Books, accounts, favourites and orders are stored by the backend (see API below).
   The browser only remembers who is logged in. */
const API="http://localhost:8080/api";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove("show"),2400)}
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){toast("Storage is full. Try a smaller photo.")}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};

/* Session: the login token and a copy of the user's details */
let token=store.get("bb_token",null),user=token?store.get("bb_user",null):null;
const setSession=r=>{token=r.token;user=r.user;store.set("bb_token",token);store.set("bb_user",user)};
const clearSession=()=>{token=user=null;store.del("bb_token");store.del("bb_user")};

/* Talks to the backend. Returns the JSON reply, or throws an Error carrying the server's message. */
async function api(method,path,body){
 let res;
 try{res=await fetch(API+path,{method,headers:{...(body?{"Content-Type":"application/json"}:{}),...(token?{Authorization:"Bearer "+token}:{})},body:body?JSON.stringify(body):undefined})}
 catch(e){throw new Error("Can't reach the server. Start the backend, then reload this page.")}
 const data=await res.json().catch(()=>({}));
 if(!res.ok){const err=new Error(data.error||"Something went wrong. Please try again.");err.status=res.status;throw err}
 return data;
}
const logout=async()=>{try{await api("POST","/logout")}catch(e){}clearSession();location.href="index.html"};
const first=n=>String(n||"").trim().split(" ")[0];
const na=$(".nav-actions");
if(na&&user){na.querySelectorAll(".btn,.icon-btn").forEach(b=>b.remove());
 na.insertAdjacentHTML("beforeend",`<a href="profile.html" class="btn btn-outline btn-sm"><i class="fa-regular fa-circle-user"></i>${esc(first(user.name))}</a><a href="settings.html" class="icon-btn" aria-label="Settings"><i class="fa-solid fa-gear"></i></a><button class="btn btn-primary btn-sm" id="logoutBtn" type="button">Log out</button>`);
 $("#logoutBtn").onclick=logout}
if($("#gate")){$("#gate").hidden=!!user;$$("[data-auth]").forEach(e=>e.hidden=!user)}

{const pg=location.pathname.split("/").pop()||"index.html";$$(".nav-links a").forEach(a=>{const h=a.getAttribute("href");if(h===pg||(pg==="index.html"&&h==="#home"))a.setAttribute("aria-current","page")})}

/* Books, favourites, orders */
const fromApi=b=>({id:String(b.id),t:b.title,a:b.author,c:b.category,cond:b.condition,p:b.price,isbn:b.isbn,type:b.type,wants:b.wants,desc:b.description,place:b.place,img:b.image,owner:b.ownerId,ownerName:b.ownerName});
const byId=id=>books.find(b=>b.id===id);
const favs=new Set();let orders=[];
/* Everything the pages need from the server. Until it arrives, books.js supplies the sample list. */
const ready=(async()=>{
 try{
  const list=await api("GET","/books");books.length=0;books.push(...list.map(fromApi));
  if(user){
   user=await api("GET","/me");store.set("bb_user",user);
   (await api("GET","/favourites")).forEach(b=>favs.add(String(b.id)));
   orders=await api("GET","/orders");
  }
 }catch(e){
  if(e.status===401){clearSession();location.reload();return}
  toast(e.message);
 }
})();
const fb=b=>Math.max(0,categories.findIndex(c=>c.id===b.c))%4+1;
const catName=id=>categories.find(c=>c.id===id)?.name||"";
const cloth=["#2f6446","#7a2e2e","#24405a","#9a6a1c","#5a3a5e","#1f5c5c","#9a4a24","#3d4a52"];
function genCover(b){
 if(!b)return "images/book-1.jpg";
 const x=s=>esc(s),col=cloth[Math.max(0,categories.findIndex(c=>c.id===b.c))%cloth.length],lines=[];let cur="";
 String(b.t).split(/\s+/).forEach(w=>{if((cur+" "+w).trim().length>13&&cur){lines.push(cur);cur=w}else cur=(cur+" "+w).trim()});if(cur)lines.push(cur);
 const L=lines.slice(0,5),fs=L.length>3?27:32,lh=fs*1.2,y0=118;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect width="300" height="450" fill="${col}"/><rect width="20" height="450" fill="#000" opacity=".2"/><rect x="38" y="24" width="238" height="402" fill="none" stroke="#f6ecd6" stroke-opacity=".5" stroke-width="1.5"/><rect x="44" y="30" width="226" height="390" fill="none" stroke="#f6ecd6" stroke-opacity=".25"/><g font-family="Georgia,'Times New Roman',serif" fill="#f6ecd6"><text x="60" font-size="${fs}" font-weight="700">${L.map((l,i)=>`<tspan x="60" y="${y0+i*lh}">${x(l)}</tspan>`).join("")}</text><rect x="60" y="${y0+L.length*lh-12}" width="44" height="3" fill="#f0c674"/><text x="60" y="388" font-size="16" opacity=".9">${x(String(b.a).slice(0,24))}</text></g></svg>`;
 return "data:image/svg+xml,"+encodeURIComponent(svg);
}
const cover=b=>b.img||(b.isbn?OL(b.isbn):genCover(b));
const priceLabel=b=>b.type==="sell"?"$"+b.p:b.type==="free"?"Free":"Swap";
const typeLabel=b=>({sell:"For sale",free:"Free",swap:"Exchange"}[b.type]);
const imgTag=(b,alt)=>`<img src="${esc(cover(b))}" onerror="this.onerror=null;this.src=genCover(byId('${b.id}'))" alt="${alt}" loading="lazy">`;
const card=b=>{const f=favs.has(b.id);return `
 <article class="book" data-id="${b.id}"><div class="cover">${imgTag(b,"Cover of "+esc(b.t))}
  ${b.type==="free"?'<span class="free-tag">Free</span>':b.type==="swap"?'<span class="free-tag swap">Swap</span>':""}
  <button class="heart" data-id="${b.id}" aria-pressed="${f}" aria-label="${f?"Remove":"Save"} ${esc(b.t)} ${f?"from":"to"} favourites"><i class="${f?"fa-solid":"fa-regular"} fa-heart"></i></button></div>
  <div class="info"><span class="cat">${esc(catName(b.c))}</span><h3><button class="open" type="button">${esc(b.t)}</button></h3><span class="author">by ${esc(b.a)}</span>
  <div class="meta"><span class="cond">${esc(b.cond)}</span><span class="price ${b.type!=="sell"?"free":""}">${priceLabel(b)}</span></div></div></article>`};
document.addEventListener("click",e=>{
 const h=e.target.closest(".heart");
 if(h){const id=h.dataset.id,had=favs.has(id);
  if(!user){toast("Log in to save books");return}
  const show=()=>{window.refresh&&refresh();document.querySelector(`.heart[data-id="${id}"]`)?.focus()};
  had?favs.delete(id):favs.add(id);show();toast(had?"Removed from favourites":"Saved to favourites");
  api(had?"DELETE":"PUT","/favourites/"+id).catch(err=>{had?favs.add(id):favs.delete(id);show();toast(err.message)});return}
 const o=e.target.closest(".book .open,.book .cover img");if(o)openBook(o.closest(".book").dataset.id,o.closest(".book").querySelector(".open"));
});

/* Book detail, buy / request / exchange */
function detail(b){
 const mine=user&&b.owner===user.id,verb=b.type==="sell"?"buy":b.type==="free"?"request":"swap for";
 let action;
 if(mine)action='<p class="notice">This is your listing.</p>';
 else if(!user)action=`<p class="muted" style="margin-bottom:12px">Log in or create an account to ${verb} this book.</p><div class="row-btns"><a class="btn btn-primary btn-sm" href="login.html">Log in</a><a class="btn btn-outline btn-sm" href="register.html">Register</a></div>`;
 else action=`<form id="orderForm" novalidate>
  ${b.type==="swap"?`<div class="field"><label for="offer">Book you'll offer in exchange</label><input id="offer" type="text" aria-describedby="offer-err"><p class="err" id="offer-err"></p></div>`:""}
  <div class="field"><label for="pickup">Pickup</label><select id="pickup"><option>Meet on campus</option><option>Courier delivery</option></select></div>
  <div class="field"><label for="note">Message to ${esc(first(b.ownerName)||"the owner")} (optional)</label><textarea id="note" rows="2"></textarea></div>
  <button class="btn btn-primary" type="submit"><i class="fa-solid ${b.type==="sell"?"fa-bag-shopping":b.type==="free"?"fa-hand-holding-heart":"fa-repeat"}"></i>${b.type==="sell"?"Place order for $"+b.p:b.type==="free"?"Request this book":"Propose exchange"}</button>
  ${b.type==="sell"?'<p class="muted small">You pay the seller when you collect the book.</p>':""}</form>`;
 return `<div class="detail"><div class="d-cover">${imgTag(b,"Cover of "+esc(b.t))}</div><div class="d-info"><span class="cat">${esc(catName(b.c))}</span><h2 id="mTitle">${esc(b.t)}</h2><p class="author">by ${esc(b.a)}</p>
  <div class="tags"><span class="cond">${esc(b.cond)}</span><span class="cond">${typeLabel(b)}</span></div>
  <p class="desc">${esc(b.desc||"A well-kept copy, ready for its next reader.")}</p>
  <ul class="facts"><li><i class="fa-solid fa-user"></i>Listed by ${esc(b.ownerName||"a BookBridge student")}</li><li><i class="fa-solid fa-location-dot"></i>${esc(b.place||"Campus library entrance")}</li>${b.type==="swap"?`<li><i class="fa-solid fa-repeat"></i>Wants: ${esc(b.wants||"open to offers")}</li>`:""}</ul>
  <div class="d-price">${priceLabel(b)}</div>${action}</div></div>`;
}
function openBook(id,opener){
 const b=byId(id);if(!b)return;let m=$("#modal");
 if(!m){document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal" hidden><div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="mTitle" tabindex="-1"><button class="modal-x" id="mClose" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><div id="mBody"></div></div></div>');
  m=$("#modal");m._close=()=>{m.hidden=true;document.body.classList.remove("noscroll");m._op&&m._op.focus()};
  $("#mClose").onclick=m._close;m.onclick=e=>{if(e.target===m)m._close()};document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)m._close()})}
 m._op=opener;$("#mBody").innerHTML=detail(b);m.hidden=false;document.body.classList.add("noscroll");$(".modal-box").scrollTop=0;$(".modal-box").focus();
 const f=$("#orderForm");if(!f)return;
 f.onsubmit=async e=>{e.preventDefault();
  if(b.type==="swap"&&!setErr("offer",$("#offer").value.trim()?"":"Tell them which book you'd offer."))return;
  const status=b.type==="sell"?"Order placed":b.type==="free"?"Request sent":"Exchange proposed";
  const o={bookId:+b.id,pickup:$("#pickup").value,note:$("#note").value.trim(),offer:$("#offer")?.value.trim()||""};
  const btn=f.querySelector("[type=submit]");btn.disabled=true;
  try{await api("POST","/orders",o);orders=await api("GET","/orders")}catch(err){btn.disabled=false;toast(err.message);return}
  const who=esc(first(b.ownerName)||"the owner");
  $("#mBody").innerHTML=`<div class="success"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><h2 id="mTitle">${status}!</h2><p>${b.type==="sell"?`${esc(b.t)} is reserved for you. Agree a time with ${who} and pay when you collect it.`:b.type==="free"?`We've let ${who} know you'd love ${esc(b.t)}. They'll get in touch to arrange pickup.`:`${who} will look at your offer of ${esc(o.offer)}. Watch your orders for their reply.`}</p><div class="row-btns"><a class="btn btn-primary btn-sm" href="profile.html#orders">View my orders</a><button class="btn btn-outline btn-sm" id="mDone" type="button">Keep browsing</button></div></div>`;
  $("#mDone").onclick=m._close;$("#mTitle").tabIndex=-1;$("#mTitle").focus();toast(status);window.refresh&&refresh()};
}

/* Mobile nav */
const menuBtn=$("#menuBtn"),menu=$("#navMenu");
if(menuBtn){
 const setMenu=o=>{menu.classList.toggle("open",o);menuBtn.setAttribute("aria-expanded",o);menuBtn.innerHTML=`<i class="fa-solid ${o?"fa-xmark":"fa-bars"}"></i>`;menuBtn.setAttribute("aria-label",o?"Close menu":"Open menu")};
 menuBtn.onclick=()=>setMenu(!menu.classList.contains("open"));
 menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
}

/* Browse: search bar, a few featured categories, all categories on request */
if($("#catGrid")){
 const shelves=[{id:"all",name:"All books",icon:"fa-book-open-reader",desc:"Search everything on the shelf."},{id:"free",name:"Free Shelf",icon:"fa-gift",desc:"Books students are giving away."},{id:"swap",name:"Exchange Shelf",icon:"fa-repeat",desc:"Swap a book you have for one you need."}];
 const tiles=[...categories,...shelves],feat=["cs","sci","lit","biz"];
 const inCat=(b,id)=>id==="all"||(id==="free"||id==="swap"?b.type===id:b.c===id);
 const tile=t=>`<button class="cat-card" data-id="${t.id}" type="button"><span class="ic"><i class="fa-solid ${t.icon}" aria-hidden="true"></i></span><strong>${t.name}</strong><span class="d">${t.desc}</span><em>${books.filter(b=>inCat(b,t.id)).length} books</em></button>`;
 let cur=null,query="",more=false;
 $("#quick").innerHTML=shelves.map(t=>`<button class="chip" data-id="${t.id}" type="button"><i class="fa-solid ${t.icon}" aria-hidden="true"></i>${t.name}</button>`).join("");
 const render=()=>{
  const q=query.trim().toLowerCase(),t=tiles.find(x=>x.id===cur),top=!cur;
  $("#scopeBar").hidden=top;$("#quick").hidden=!top;
  if(t){$("#scopeTitle").textContent=t.name;$("#scopeDesc").textContent=t.desc}
  $("#searchInput").placeholder=t?`Search in ${t.name}`:"Search books, authors or categories";
  $("#catGrid").innerHTML=(more?categories:categories.filter(c=>feat.includes(c.id))).map(tile).join("");
  $("#moreCats").textContent=more?"Show fewer categories":`Show all ${categories.length} categories`;$("#moreCats").setAttribute("aria-expanded",more);
  $("#catSection").hidden=!top||!!q;
  const cm=top&&q?categories.filter(c=>(c.name+" "+c.desc).toLowerCase().includes(q)):[];
  $("#catMatches").hidden=!cm.length;$("#catMatchGrid").innerHTML=cm.map(tile).join("");
  const show=!top||!!q;$("#bookGrid").hidden=$("#results").hidden=$("#toolbar").hidden=!show;
  if(!show)return;
  const list=books.filter(b=>inCat(b,cur||"all")&&(!q||[b.t,b.a,catName(b.c)].some(x=>x.toLowerCase().includes(q))));
  const so=$("#sortSel").value,rank={"Like new":0,Good:1,Fair:2};
  if(so==="low")list.sort((a,b)=>a.p-b.p);else if(so==="az")list.sort((a,b)=>a.t.localeCompare(b.t));else if(so==="cond")list.sort((a,b)=>rank[a.cond]-rank[b.cond]);
  $("#results").textContent=`${list.length} book${list.length===1?"":"s"} found${q&&top?` for "${query.trim()}"`:""}`;
  $("#bookGrid").innerHTML=list.length?list.map(card).join(""):`<div class="empty"><i class="fa-regular fa-face-frown"></i><p>No books match "${esc(query)}" here. Try another title, author or category.</p></div>`};
 const go=id=>{cur=id;query="";$("#searchInput").value="";render();$("#browse").scrollIntoView({behavior:"smooth"});$("#searchInput").focus({preventScroll:true})};
 $("#browse").addEventListener("click",e=>{const b=e.target.closest(".cat-card,.chip");if(b?.dataset.id)go(b.dataset.id)});
 $("#backBtn").onclick=()=>go(null);
 $("#moreCats").onclick=()=>{more=!more;render()};
 $("#sortSel").onchange=render;
 $("#searchInput").addEventListener("input",e=>{query=e.target.value;render()});
 $("#searchForm").onsubmit=e=>{e.preventDefault();render()};
 window.refresh=render;
 ready.then(()=>{render();const st=$("#stack");if(st)st.innerHTML=books.filter(b=>b.type==="free").slice(0,4).map(b=>imgTag(b,"Cover of "+esc(b.t))).join("")});
}

/* Form helpers */
function setErr(id,msg){const el=$("#"+id);el.closest(".field").classList.toggle("invalid",!!msg);$("#"+id+"-err").textContent=msg||"";el.setAttribute("aria-invalid",!!msg);return !msg}
const emailCheck=v=>!v?"Enter your email address.":/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"":"Enter a valid email, like name@school.edu.";
function handle(formId,checks,onOk){
 const f=$("#"+formId);if(!f)return;
 f.addEventListener("submit",async e=>{e.preventDefault();const pw=$("#password")?.value,msg=$("#formMsg"),btn=f.querySelector("[type=submit]");
  const res=Object.entries(checks).map(([id,fn])=>setErr(id,fn($("#"+id).value.trim(),pw)));msg.hidden=true;
  const bad=Object.keys(checks).find((id,i)=>!res[i]);if(bad){$("#"+bad).focus();return}
  btn.disabled=true;
  try{const m=await onOk(Object.fromEntries(Object.keys(checks).map(id=>[id,$("#"+id).value.trim()])),pw);if(m){msg.textContent=m;msg.hidden=false}}
  catch(err){toast(err.message)}
  btn.disabled=false});
 f.addEventListener("input",e=>{const id=e.target.id;if(id in checks&&e.target.closest(".field").classList.contains("invalid"))setErr(id,checks[id](e.target.value.trim(),$("#password")?.value))});
}
const goHome=()=>setTimeout(()=>location.href="index.html",1100);

/* Password show/hide and strength meter */
$$("input[type=password]").forEach(inp=>{
 const w=document.createElement("div");w.className="pw";inp.parentNode.insertBefore(w,inp);w.appendChild(inp);
 const b=document.createElement("button");b.type="button";b.className="eye";b.setAttribute("aria-label","Show password");b.innerHTML='<i class="fa-regular fa-eye"></i>';w.appendChild(b);
 b.onclick=()=>{const on=inp.type==="password";inp.type=on?"text":"password";b.innerHTML=`<i class="fa-regular fa-eye${on?"-slash":""}"></i>`;b.setAttribute("aria-label",on?"Hide password":"Show password")};
 if(inp.id==="password"&&$("#registerForm")){
  w.insertAdjacentHTML("afterend",'<div class="meter" id="meter"><span></span><span></span><span></span><span></span></div><small class="meter-t" id="meterT"></small>');
  inp.addEventListener("input",()=>{const v=inp.value,sc=v?Math.min(4,(v.length>=8)+/\d/.test(v)+(/[A-Z]/.test(v)&&/[a-z]/.test(v))+(/[^A-Za-z0-9]/.test(v)||v.length>=12)):0;
   $("#meter").className="meter"+(sc?" s"+sc:"");$("#meterT").textContent=v?["Weak","Fair","Good","Strong"][Math.max(0,sc-1)]+" password":""})}
});

/* Login / Register */
handle("loginForm",{email:emailCheck,password:v=>v?"":"Enter your password."},async(v,pw)=>{
 try{setSession(await api("POST","/login",{email:v.email,password:pw}))}
 catch(err){if(!err.status)throw err;setErr("password",err.message);$("#password").focus();return}
 goHome();return `Welcome back, ${first(user.name)}! Taking you to BookBridge...`});
handle("registerForm",{
 name:v=>v.length<2?"Enter your full name.":"",email:emailCheck,
 password:v=>v.length<8?"Use at least 8 characters.":!/\d/.test(v)?"Include at least one number.":"",
 confirm:(v,p)=>!v?"Confirm your password.":v!==p?"Passwords do not match.":""
},async(v,pw)=>{
 try{setSession(await api("POST","/register",{name:v.name,email:v.email,password:pw}))}
 catch(err){if(!err.status)throw err;setErr(err.status===409?"email":"password",err.message);$(err.status===409?"#email":"#password").focus();return}
 goHome();return `Welcome to BookBridge, ${first(user.name)}! Your account is ready.`});

/* Contact */
if($("#contactForm")&&user){$("#name").value=user.name;$("#email").value=user.email}
handle("contactForm",{name:v=>v.length<2?"Enter your full name.":"",email:emailCheck,subject:v=>v?"":"Choose a topic.",message:v=>v.length<10?"Write at least 10 characters.":""},
 async v=>{await api("POST","/contact",v);$("#contactForm").reset();return `Thanks, ${first(v.name)}! We've got your message and will reply within 2 working days.`});

/* Profile */
if($("#pName")&&user){
 $("#pName").textContent=user.name;$("#pMeta").textContent=user.email+(user.uni?", "+user.uni:"");$("#avatar").textContent=user.name.trim()[0]?.toUpperCase()||"?";
 const empty=(ic,t,link)=>`<li class="card empty-card"><i class="${ic}"></i><p>${t}</p>${link||""}</li>`;
 window.refresh=()=>{
  const saved=[...favs].map(byId).filter(Boolean),mine=books.filter(b=>b.owner===user.id).reverse(),ord=orders;
  const day=o=>{const d=new Date(o.created);return isNaN(d)?"":d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})+" · "};
  $("#statSaved").textContent=saved.length;$("#statOrders").textContent=ord.length;$("#statList").textContent=mine.length;
  $("#savedGrid").innerHTML=saved.length?saved.map(card).join(""):`<div class="card empty-card" style="grid-column:1/-1"><i class="fa-regular fa-heart"></i><p>No saved books yet. Tap the heart on any book to keep it here.</p><a href="index.html#browse" class="btn btn-primary btn-sm">Browse books</a></div>`;
  $("#ordersList").innerHTML=ord.length?ord.map(o=>`<li class="row"><div><strong>${esc(o.title)}</strong><span class="muted">${day(o)}${esc(o.pickup)}${o.offer?" · Offering "+esc(o.offer):""}${o.type==="sell"?" · $"+o.price:""}</span></div><span class="status">${esc(o.status)}</span></li>`).join(""):empty("fa-solid fa-bag-shopping","You haven't ordered or requested a book yet.",'<a href="index.html#browse" class="btn btn-primary btn-sm">Find a book</a>');
  $("#listingsList").innerHTML=mine.length?mine.map(b=>`<li class="row">${imgTag(b,"Cover of "+esc(b.t))}<div><strong>${esc(b.t)}</strong><span class="muted">${typeLabel(b)}${b.type==="sell"?" · $"+b.p:""} · ${esc(b.cond)}</span></div><button class="btn btn-outline btn-sm" data-del="${b.id}" type="button" aria-label="Remove ${esc(b.t)}"><i class="fa-solid fa-trash"></i>Remove</button></li>`).join(""):empty("fa-solid fa-box-open","You haven't listed a book yet.",'<a href="list-book.html" class="btn btn-primary btn-sm">Share a book</a>');
 };
 $("#listingsList").onclick=async e=>{const d=e.target.closest("[data-del]");if(!d)return;d.disabled=true;
  try{await api("DELETE","/books/"+d.dataset.del)}catch(err){d.disabled=false;toast(err.message);return}
  books.splice(books.findIndex(b=>b.id===d.dataset.del),1);favs.delete(d.dataset.del);toast("Listing removed");refresh()};
 ready.then(()=>{if(!user)return;$("#pMeta").textContent=user.email+(user.uni?", "+user.uni:"");refresh()});
}

/* Settings */
if($("#settingsForm")&&user){
 Object.entries(user).forEach(([k,v])=>{const el=$("#"+k);if(el)el.type==="checkbox"?el.checked=v:el.value=v});
 $("#settingsForm").addEventListener("submit",async e=>{e.preventDefault();
  const em=$("#email").value.trim().toLowerCase(),ok=[setErr("name",$("#name").value.trim().length<2?"Enter your full name.":""),setErr("email",emailCheck(em))];
  if(ok.includes(false)){$(".invalid input").focus();return}
  const d={name:$("#name").value.trim(),email:em,uni:$("#uni").value.trim(),contactPref:$("#contactPref").value,n1:$("#n1").checked,n2:$("#n2").checked,n3:$("#n3").checked};
  try{user=await api("PUT","/me",d)}
  catch(err){if(err.status===409){setErr("email",err.message);$("#email").focus()}else toast(err.message);return}
  store.set("bb_user",user);toast("Settings saved")});
 $("#deleteBtn").onclick=async()=>{if(!confirm("Delete your account and everything linked to it?"))return;
  try{await api("DELETE","/me")}catch(err){toast(err.message);return}
  clearSession();location.href="index.html"};
}

/* Share a book */
if($("#listForm")&&user){
 $("#category").innerHTML='<option value="">Choose a category</option>'+categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
 const type=()=>document.querySelector("input[name=ltype]:checked").value;let img="";
 const sync=()=>{$("#priceField").hidden=type()!=="sell";$("#wantsField").hidden=type()!=="swap"};
 $$("input[name=ltype]").forEach(r=>r.onchange=sync);
 const q=new URLSearchParams(location.search).get("type");if(["free","swap"].includes(q)){document.querySelector(`input[value=${q}]`).checked=true}sync();
 $("#cover").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,360/im.width),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);img=c.toDataURL("image/jpeg",.75);$("#preview").src=img;$("#preview").hidden=false};im.src=r.result};r.readAsDataURL(f)};
 handle("listForm",{title:v=>v.length<2?"Enter the book title.":"",author:v=>v.length<2?"Enter the author.":"",category:v=>v?"":"Choose a category.",
  price:v=>type()==="sell"&&!(+v>0)?"Enter a price above 0.":"",wants:v=>type()==="swap"&&v.length<2?"Say what you'd like in return.":""},async v=>{
  await api("POST","/books",{title:v.title,author:v.author,category:v.category,condition:$("#condition").value,type:type(),price:type()==="sell"?Math.round(+v.price):0,wants:type()==="swap"?v.wants:"",
   description:$("#description").value.trim(),place:$("#place").value.trim()||"Campus library entrance",image:img});
  setTimeout(()=>location.href="profile.html#listings",1200);
  return `Your book is now listed! Taking you to your listings...`});
}