const loader=document.getElementById("loader");
window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("hide"),900));

const house=document.querySelector(".house-image");
const scenes=[...document.querySelectorAll(".scene")];
let ticking=false;
function updateWorld(){
  const y=window.scrollY;
  const max=Math.max(1,document.body.scrollHeight-window.innerHeight);
  const p=Math.min(1,y/max);
  const scale=1.08 + p*.22;
  const x=Math.sin(p*Math.PI*2)*1.8;
  const pos=34 + p*14;
  house.style.transform=`translate3d(${x}%,${p*-1.5}%,0) scale(${scale})`;
  house.style.backgroundPosition=`${50+x}% ${pos}%`;
  house.style.filter=`saturate(${.95+p*.18}) contrast(${1.04+p*.08}) brightness(${.72+p*.12})`;
  if(!ticking) requestAnimationFrame(()=>{ticking=false;});
  ticking=true;
}
window.addEventListener("scroll",updateWorld,{passive:true});
updateWorld();

const observer=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      e.target.style.transitionDelay=`${Math.min(i*35,180)}ms`;
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const roomCards=[...document.querySelectorAll(".room-card")];
const summaryRoom=document.getElementById("summaryRoom");
const summaryTotal=document.getElementById("summaryTotal");
const roomInput=document.getElementById("roomInput");
let selectedPrice=35;
roomCards.forEach(card=>{
  card.querySelector(".select-room").addEventListener("click",()=>{
    roomCards.forEach(c=>c.querySelector(".select-room").classList.remove("active"));
    card.querySelector(".select-room").classList.add("active");
    const name=card.dataset.room, price=Number(card.dataset.price);
    selectedPrice=price;
    summaryRoom.textContent=name;
    summaryTotal.textContent=`$${price}`;
    roomInput.value=name;
    document.getElementById("booking").scrollIntoView({behavior:"smooth"});
  });
});

const checkin=document.querySelector('[name="checkin"]');
const checkout=document.querySelector('[name="checkout"]');
function totalNights(){
  if(!checkin.value||!checkout.value)return 1;
  const a=new Date(checkin.value),b=new Date(checkout.value);
  const n=Math.ceil((b-a)/86400000);
  return n>0?n:1;
}
[checkin,checkout].forEach(input=>input.addEventListener("change",()=>{
  summaryTotal.textContent=`$${selectedPrice*totalNights()}`;
}));

const form=document.getElementById("bookingForm"),toast=document.getElementById("toast");
form.addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(form);
  const nights=totalNights();
  const subject=encodeURIComponent(`Golden Gate Hotel reservation — ${data.get("room")}`);
  const body=encodeURIComponent(
`New reservation request

Guest: ${data.get("name")}
Email: ${data.get("email")}
Phone: ${data.get("phone")}
Room: ${data.get("room")}
Check-in: ${data.get("checkin")}
Check-out: ${data.get("checkout")}
Guests: ${data.get("guests")}
Estimated total: $${selectedPrice*nights}

Please confirm availability and final booking details.`
  );
  window.location.href=`mailto:goldenhotelhawassa@gmail.com?subject=${subject}&body=${body}`;
  toast.textContent="Opening your email app with the reservation request…";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),4500);
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const el=document.querySelector(a.getAttribute("href"));
    if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});
