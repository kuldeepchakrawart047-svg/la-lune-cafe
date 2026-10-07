const DELIVERY_FEE = 40;

function getCart(){
  try { return JSON.parse(localStorage.getItem("laLuneCart")) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem("laLuneCart", JSON.stringify(cart)); }

function renderCart(){
  const cart=getCart();
  const box=document.getElementById("cartItems");
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const badge=document.getElementById("cartCount");
  badge.textContent=count;
  badge.style.display=count?"block":"none";

  if(!cart.length){
    box.innerHTML=`<div class="empty-cart"><div class="empty-icon">🛒</div><h2>Your cart is empty</h2><p>Add something delicious from our menu.</p><a class="primary-btn" href="index.html#menu">EXPLORE MENU →</a></div>`;
  } else {
    box.innerHTML=cart.map((item,i)=>`
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-product"><h3>${item.name}</h3><p>₹${item.price} each</p></div>
        <strong class="item-price">₹${item.price*item.qty}</strong>
        <div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${i},1)">+</button></div>
        <button class="remove" onclick="removeItem(${i})" aria-label="Remove item">♲</button>
      </article>`).join("");
  }

  const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("subtotal").textContent=`₹${subtotal}`;
  document.getElementById("delivery").textContent=cart.length?`₹${DELIVERY_FEE}`:"₹0";
  document.getElementById("total").textContent=`₹${subtotal+(cart.length?DELIVERY_FEE:0)}`;
}

function changeQty(index,delta){
  const cart=getCart();
  cart[index].qty+=delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart(cart); renderCart();
}
function removeItem(index){
  const cart=getCart(); cart.splice(index,1); saveCart(cart); renderCart();
}
function checkout(){
  const cart=getCart();
  if(!cart.length){ alert("Your cart is empty."); return; }
  window.location.href="checkout.html";
}
renderCart();
