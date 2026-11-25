const items=[
[9,"Aurelia Contrast Work Tote","Bags",139.99,"product_images/MON-001.jpg","NEW"],
[11,"Vela Quilted Crossbody Bag","Bags",112.99,"product_images/MON-003.jpg","NEW"],
[14,"Rosé Heart Crystal Stud Earrings","Jewellery",133.99,"product_images/MON-006.jpg","NEW"],
[17,"Northline Hooded Fleece Jacket","Fashion",76,"product_images/MON-009.jpg","NEW"],
[10,"Noir Quilted Multi-Pocket Backpack","Bags",135.99,"product_images/MON-002.jpg","NEW"],
[12,"Sable Everyday Travel Backpack","Bags",132.99,"product_images/MON-004.jpg","NEW"],
[13,"Silver Edit 45-Piece Jewellery Set","Jewellery",114.99,"product_images/MON-005.jpg","NEW"],
[15,"Celeste Tree Pendant Necklace","Jewellery",146.39,"product_images/MON-007.jpg","NEW"],
[16,"Clover Initial Pendant Necklace","Jewellery",115.99,"product_images/MON-008.jpg","NEW"],
[18,"Trailmark Waterproof Hooded Jacket","Fashion",89,"product_images/MON-010.jpg","NEW"],
[19,"Packlite Lightweight Rain Jacket","Fashion",99,"product_images/MON-011.jpg","NEW"],
[1,"Structured Everyday Blazer","Fashion",89,"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85","BESTSELLER"],
[4,"Soft Form Ceramic Vase","Home",36,"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85","THE EDIT"],
[8,"Natural Linen Cushion Cover","Home",59,"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85","CONSIDERED"]
].map(([id,name,category,price,image,tag])=>({id,name,category,price,image,tag}));
function noImg(i){i.onerror=null;i.parentNode.classList.add("no-image");i.remove()}
let cart=[];const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),cash=n=>"£"+n.toFixed(2);
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function card(p){return `<article class="product-card"><div class="product-image${p.image.startsWith("product_images/")?" photo":""}"><img loading="lazy" src="${p.image}" alt="${p.name}" onerror="noImg(this)"><span class="tag">${p.tag}</span><button class="quick-add" data-add="${p.id}">ADD TO BAG　＋</button></div><div class="product-meta"><small>${p.category.toUpperCase()}</small><h3>${p.name}</h3><span class="price">${cash(p.price)}</span></div></article>`}
function render(filter="All",query=""){let found=items.filter(p=>(filter==="All"||p.category===filter)&&(!query||(p.name+" "+p.category).toLowerCase().includes(query.toLowerCase())));$("#products").innerHTML=found.map(card).join("")||"<p>No matching products found.</p>";}
$("#bestsellerGrid").innerHTML=items.slice(0,4).map(card).join("");$("#moreGrid").innerHTML=items.slice(4).map(card).join("");render();
function add(id){let p=items.find(x=>x.id===id),c=cart.find(x=>x.id===id);c?c.qty++:cart.push({...p,qty:1});renderCart();toast("Added to your shopping bag")}
document.addEventListener("click",e=>{let a=e.target.closest("[data-add]");if(a)add(+a.dataset.add)});
$("#filterTabs").addEventListener("click",e=>{let b=e.target.closest("[data-filter]");if(!b)return;$$(".filter-tabs button").forEach(x=>x.classList.toggle("active",x===b));render(b.dataset.filter)});
$$(".category-tile").forEach(x=>x.addEventListener("click",()=>{let f=x.dataset.filter;$$(".filter-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));render(f)}));
function renderCart(){let n=cart.reduce((a,x)=>a+x.qty,0),sum=cart.reduce((a,x)=>a+x.price*x.qty,0);$("#cartCount").textContent=n;$("#drawerCount").textContent=n;$("#subtotal").textContent=cash(sum);$("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${x.image}" alt="" onerror="noImg(this)"><div><h4>${x.name}</h4><small>${cash(x.price)}</small><div class="qty"><button data-qty="${x.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${x.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${x.id}">×</button></div>`).join(""):'<p>Your shopping bag is empty.</p>'}
$("#cartItems").addEventListener("click",e=>{let q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){let p=cart.find(x=>x.id===+q.dataset.qty);p.qty+=+q.dataset.delta;if(p.qty<1)cart=cart.filter(x=>x.id!==p.id)}if(r)cart=cart.filter(x=>x.id!==+r.dataset.remove);renderCart()});
const overlay=$("#overlay"),drawer=$("#cartDrawer");function closeAll(){overlay.classList.remove("show");drawer.classList.remove("open");$$(".modal").forEach(m=>m.classList.remove("open"));$("#searchPanel").classList.remove("open")}function open(el){overlay.classList.add("show");el.classList.add("open")}overlay.onclick=closeAll;$$("[data-close]").forEach(b=>b.onclick=closeAll);$("#cartOpen").onclick=()=>open(drawer);
function modal(id){open($("#"+id))}$("#sellerOpen").onclick=()=>modal("sellerModal");$("#wholesaleOpen").onclick=()=>modal("wholesaleModal");$("#trackingOpen").onclick=e=>{e.preventDefault();modal("trackingModal")};$("#footerSeller").onclick=e=>{e.preventDefault();modal("sellerModal")};$("#footerWholesale").onclick=e=>{e.preventDefault();modal("wholesaleModal")};
$("#checkoutButton").onclick=async()=>{
  if(!cart.length){toast("Your bag is empty.");return}
  const btn=$("#checkoutButton"),label=btn.textContent;btn.disabled=true;btn.textContent="REDIRECTING TO SECURE CHECKOUT…";
  try{
    const res=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart.map(x=>({id:x.id,qty:x.qty}))})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok||!data.url)throw new Error(data.error||"Could not start checkout.");
    try{localStorage.setItem("moniyoraCart",JSON.stringify(cart))}catch{}
    window.location.href=data.url;
  }catch(err){toast(err.message||"Could not start checkout.");btn.disabled=false;btn.textContent=label}
};
(function(){
  const status=new URLSearchParams(location.search).get("checkout");
  if(status==="success"){try{localStorage.removeItem("moniyoraCart")}catch{}cart=[];renderCart();setTimeout(()=>toast("Thank you! Your order is confirmed — a receipt is on its way."),400)}
  else{try{const saved=JSON.parse(localStorage.getItem("moniyoraCart")||"[]").filter(x=>items.some(p=>p.id===x.id)).map(x=>({...items.find(p=>p.id===x.id),qty:x.qty}));if(Array.isArray(saved)&&saved.length){cart=saved;renderCart()}}catch{}
    if(status==="cancelled")setTimeout(()=>toast("Checkout cancelled — your bag has been saved."),400)}
  if(status)history.replaceState(null,"",location.pathname+location.hash);
})();
function demo(id,msg){$("#"+id).onsubmit=e=>{e.preventDefault();$("#"+msg).textContent="Thank you. This enquiry form is ready to connect to your business email or CRM.";e.target.reset()}}demo("sellerForm","sellerMsg");demo("wholesaleForm","wholesaleMsg");
$("#trackingForm").onsubmit=e=>{e.preventDefault();$("#trackingMsg").textContent="No live order records are connected yet. Tracking will activate after fulfilment integration."};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();$("#newsletterMsg").textContent="Thank you. Connect an email marketing service to activate subscriptions.";e.target.reset()};
$("#menuToggle").onclick=()=>$("#mobileNav").classList.toggle("open");$("#searchToggle").onclick=()=>{$("#searchPanel").classList.add("open");$("#searchInput").focus()};$("#searchClose").onclick=()=>$("#searchPanel").classList.remove("open");$("#searchInput").oninput=e=>{render("All",e.target.value);$("#fresh").scrollIntoView({behavior:"smooth"})};
let slide=0;const slides=$$(".slide");function setSlide(n){slide=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===slide));$("#slideNumber").textContent="0"+(slide+1)+" / 0"+slides.length}$("#prevSlide").onclick=()=>setSlide(slide-1);$("#nextSlide").onclick=()=>setSlide(slide+1);setInterval(()=>setSlide(slide+1),6500);

/* === Graceful motion: scroll reveals + floating actions === */
(function(){
  if(!('IntersectionObserver' in window)) return;
  const targets = [
    '.category-wrap','.product-section','.wide-promo','.seasonal',
    '.social-section','.benefits','.partner-banner','.footer-columns'
  ];
  targets.forEach(sel=>{const el=document.querySelector(sel); if(el) el.classList.add('reveal');});
  document.querySelectorAll('.category-row,.product-grid,.benefits,.social-grid').forEach(el=>el.classList.add('stagger'));
  document.querySelectorAll('.section-title').forEach(el=>el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-scale,.stagger').forEach(el=>io.observe(el));
  // floating actions visibility
  const fa=document.getElementById('floatingActions');
  const btt=document.getElementById('backToTop');
  function onScroll(){ if(!fa) return; if(window.scrollY>400){fa.classList.add('in')}else{fa.classList.remove('in')} }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(btt) btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();
