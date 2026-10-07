let cartCount = 0;

function getCart(){
  try { return JSON.parse(localStorage.getItem("laLuneCart")) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem("laLuneCart", JSON.stringify(cart)); }

function updateCartCount(){
  cartCount = getCart().reduce((sum,item)=>sum+item.qty,0);
  const badge=document.querySelector(".cart-btn b");
  if(badge) badge.textContent=cartCount;
}

document.querySelectorAll(".food-card .add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const card=btn.closest(".food-card");
    const product={
      name:card.dataset.product,
      price:Number(card.dataset.price),
      image:card.dataset.image,
      qty:1
    };
    const cart=getCart();
    const existing=cart.find(item=>item.name===product.name);
    if(existing) existing.qty++;
    else cart.push(product);
    saveCart(cart);
    updateCartCount();
    btn.textContent="✓";
    setTimeout(()=>btn.textContent="+",900);
  });
});

function bookTable(event){
  if(event) event.preventDefault();
  const name=document.getElementById("guestName")?.value || "Guest";
  alert(`Thank you ${name}! Your table request has been received.`);
}

const sections=document.querySelectorAll("main section[id]");
const links=document.querySelectorAll("nav a");
let navClickLock=false;

links.forEach(link=>{
  link.addEventListener("click",()=>{
    navClickLock=true;
    links.forEach(item=>item.classList.remove("active"));
    link.classList.add("active");
    setTimeout(()=>navClickLock=false,700);
  });
});

const observer=new IntersectionObserver(entries=>{
  if(navClickLock) return;
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible) return;
  links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+visible.target.id));
},{rootMargin:"-25% 0px -60% 0px",threshold:[0.1,0.25,0.5]});
sections.forEach(section=>observer.observe(section));

updateCartCount();
