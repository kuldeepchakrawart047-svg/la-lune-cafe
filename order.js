const DELIVERY_FEE = 40;

const products = {
  pizza: [
    {name:"Spicy Chicken Pizza", price:299, image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85", desc:"Loaded with spicy chicken, cheese, capsicum & olives."},
    {name:"Classic Margherita", price:249, image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85", desc:"Fresh tomatoes, mozzarella cheese, basil & herbs."},
    {name:"Cheesy Veggie Pizza", price:279, image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85", desc:"Loaded with cheese, bell peppers, olives, onions & more."}
  ],
  burger: [
    {name:"Classic Chicken Burger", price:299, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85", desc:"Juicy grilled chicken, cheese, lettuce & signature sauce."},
    {name:"Double Cheese Burger", price:349, image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85", desc:"Double patty, double cheese and our creamy house sauce."},
    {name:"Crispy Veg Burger", price:229, image:"https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85", desc:"Crispy veggie patty with fresh lettuce and sauce."}
  ],
  noodles: [
    {name:"Hot Wok Noodles", price:229, image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85", desc:"Wok tossed noodles with vegetables and spicy sauce."},
    {name:"Hakka Noodles", price:219, image:"https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85", desc:"Classic hakka noodles with fresh vegetables and herbs."},
    {name:"Chilli Garlic Noodles", price:239, image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85", desc:"Garlic, chilli and wok-fried noodles for extra flavour."}
  ],
  drinks: [
    {name:"Fresh Lime Cooler", price:129, image:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85", desc:"Fresh lime, mint and sparkling refreshment."},
    {name:"Berry Blast", price:159, image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85", desc:"Refreshing mixed berry drink with a fruity finish."},
    {name:"Mint Mojito", price:149, image:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=85", desc:"Cool mint, lime and a sparkling twist."}
  ]
};

function getCart(){
  try{return JSON.parse(localStorage.getItem("laLuneCart"))||[]}
  catch(e){return[]}
}
function saveCart(cart){localStorage.setItem("laLuneCart",JSON.stringify(cart));}

function addToCart(product){
  const cart=getCart();
  const existing=cart.find(x=>x.name===product.name);
  if(existing) existing.qty++;
  else cart.push({...product,qty:1});
  saveCart(cart);
  renderMiniCart();
  const count=document.getElementById("orderCartCount");
  count.textContent=cart.reduce((s,x)=>s+x.qty,0);
  count.style.display="block";
}

function renderProducts(category, query=""){
  const grid=document.getElementById("productGrid");
  const q=query.trim().toLowerCase();

  let list;
  let label;

  if(q){
    list=Object.values(products).flat().filter(p =>
      `${p.name} ${p.desc}`.toLowerCase().includes(q)
    );
    label=`${list.length} item${list.length===1?"":"s"} found for "${query.trim()}"`;
  }else{
    list=products[category] || [];
    label="";
  }

  const status=document.getElementById("searchStatus");
  if(status) status.textContent=label;

  if(!list.length){
    grid.innerHTML=`
      <div class="no-results">
        <div>🔎</div>
        <h3>No item found</h3>
        <p>Try another food name, such as pizza, burger or noodles.</p>
      </div>`;
    return;
  }

  grid.innerHTML=list.map((p)=>`
    <article class="order-product">
      <div class="product-image-wrap"><img src="${p.image}" alt="${p.name}"></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <strong>₹${p.price}</strong>
          <button onclick='addToCart(${JSON.stringify(p).replace(/'/g,"&#39;")})'>🛒 ADD</button>
        </div>
      </div>
    </article>`).join("");
}

function changeMiniQty(index,delta){
  const cart=getCart();
  cart[index].qty += delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart(cart);
  renderMiniCart();
}
function removeMiniItem(index){
  const cart=getCart(); cart.splice(index,1); saveCart(cart); renderMiniCart();
}

function renderMiniCart(){
  const cart=getCart();
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("orderCartCount").textContent=count;
  document.getElementById("orderCartCount").style.display=count?"block":"none";
  document.getElementById("orderItemCount").textContent=`${count} Item${count===1?"":"s"}`;

  const box=document.getElementById("miniCart");
  if(!cart.length){
    box.innerHTML=`<div class="mini-empty"><div>🛒</div><p>Your cart is empty.</p><small>Add something delicious!</small></div>`;
  }else{
    box.innerHTML=cart.map((item,i)=>`
      <div class="mini-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="mini-info"><strong>${item.name}</strong><small>₹${item.price} each</small>
          <div class="mini-qty"><button onclick="changeMiniQty(${i},-1)">−</button><span>${item.qty}</span><button onclick="changeMiniQty(${i},1)">+</button></div>
        </div>
        <div class="mini-right"><b>₹${item.price*item.qty}</b><button onclick="removeMiniItem(${i})">×</button></div>
      </div>`).join("");
  }
  const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("miniSubtotal").textContent=`₹${subtotal}`;
  document.getElementById("miniDelivery").textContent=cart.length?`₹${DELIVERY_FEE}`:"₹0";
  document.getElementById("miniTotal").textContent=`₹${subtotal+(cart.length?DELIVERY_FEE:0)}`;
}

let currentCategory = "pizza";

document.querySelectorAll(".category").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentCategory = btn.dataset.category;
    document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");

    const search=document.getElementById("menuSearch");
    if(search) search.value="";
    const status=document.getElementById("searchStatus");
    if(status) status.textContent="";

    renderProducts(currentCategory);
  });
});

const menuSearch=document.getElementById("menuSearch");
const clearSearch=document.getElementById("clearSearch");

if(menuSearch){
  menuSearch.addEventListener("input",()=>{
    renderProducts(currentCategory, menuSearch.value);
  });
}
if(clearSearch){
  clearSearch.addEventListener("click",()=>{
    menuSearch.value="";
    menuSearch.focus();
    renderProducts(currentCategory);
  });
}

document.getElementById("placeOrderBtn").addEventListener("click",()=>{
  const cart=getCart();
  if(!cart.length){alert("Your cart is empty. Please add an item first.");return;}
  location.href="checkout.html";
});

renderProducts("pizza");
renderMiniCart();
