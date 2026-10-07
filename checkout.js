const DELIVERY_FEE = 40;
const getCart = () => { try { return JSON.parse(localStorage.getItem('laLuneCart')) || []; } catch(e){ return []; } };

function updateBadge(){
  const count = getCart().reduce((sum,item)=>sum + Number(item.qty || 0),0);
  const badge = document.getElementById('checkoutCartCount');
  badge.textContent = count;
  badge.style.display = count ? 'block' : 'none';
}
function renderOrder(){
  const cart=getCart();
  if(!cart.length){ location.href='cart.html'; return; }
  document.getElementById('checkoutItems').innerHTML=cart.map(item=>`<div class="checkout-item"><div><strong>${item.name}</strong><small>Qty: ${item.qty}</small></div><strong>₹${item.price*item.qty}</strong></div>`).join('');
  const subtotal=cart.reduce((s,x)=>s+Number(x.price)*Number(x.qty),0);
  document.getElementById('checkoutSubtotal').textContent=`₹${subtotal}`;
  document.getElementById('checkoutDelivery').textContent=`₹${DELIVERY_FEE}`;
  document.getElementById('checkoutTotal').textContent=`₹${subtotal+DELIVERY_FEE}`;
}

document.querySelectorAll('input[name="payment"]').forEach(r=>r.addEventListener('change',()=>{
  document.querySelectorAll('.payment-card').forEach(c=>c.classList.remove('active'));
  r.closest('.payment-card').classList.add('active');
  document.getElementById('paymentExtra').style.display=r.value==='UPI'?'block':'none';
}));

document.getElementById('checkoutForm').addEventListener('submit',e=>{
  e.preventDefault();
  const method=document.querySelector('input[name="payment"]:checked').value;
  if(method==='UPI' && !document.getElementById('upiId').value.trim()){
    alert('Please enter your UPI ID.'); return;
  }
  alert(`Order placed successfully!\nPayment: ${method}`);
});
updateBadge(); renderOrder();
