let user=null;

const USERS={
  "Cristian":"94",
  "Nayeli":"94",
  "Prueba":"12345"
};

const KEY_200="K200";
const KEY_500="K500";

function login(){
  let u=username.value.trim();
  let p=password.value.trim();

  if(!USERS[u]||USERS[u]!==p){
    error.innerText="Error";
    return;
  }

  user=u;

  if(!localStorage.getItem(user)){
    localStorage.setItem(user,JSON.stringify({
      coins: u==="Prueba"?2000000:2000,
      points:0,
      quetzales:0,
      jackpot:false,
      lastOnline:Date.now()
    }));
  }

  login.style.display="none";
  game.style.display="block";

  offline();
  load();
}

/* OFFLINE */
function offline(){
  let d=JSON.parse(localStorage.getItem(user));
  let diff=Date.now()-d.lastOnline;
  let mins=Math.floor(diff/60000);

  d.coins+=Math.floor(mins/30)*100;
  d.lastOnline=Date.now();

  localStorage.setItem(user,JSON.stringify(d));
}

/* SLOT */
const symbols=["❤️","⭐","🌙","🍒","💎","🍀","🔥","N","A","Y"];

function spin(){
  let d=JSON.parse(localStorage.getItem(user));

  if(d.coins<100)return alert("Sin monedas");

  d.coins-=100;

  roll("c1"); roll("c2"); roll("c3");

  setTimeout(()=>{
    let m1=c1r2.innerText;
    let m2=c2r2.innerText;
    let m3=c3r2.innerText;

    if(m1=="N"&&m2=="A"&&m3=="Y"&&!d.jackpot){
      d.jackpot=true;
      d.points+=2000;
      alert("PREMIO MAYOR");
    }
    else if(m1===m2&&m2===m3){
      d.points+=200;
    }
    else if(m1===m2||m2===m3){
      d.points+=50;
    }

    localStorage.setItem(user,JSON.stringify(d));
    load();
  },1000);
}

function roll(c){
  let ids=["r1","r2","r3"];
  let i=setInterval(()=>{
    ids.forEach(id=>{
      document.getElementById(c+id).innerText=
      symbols[Math.floor(Math.random()*symbols.length)];
    });
  },100);
  setTimeout(()=>clearInterval(i),800);
}

/* CANJE */
function convertPoints(){
  let d=JSON.parse(localStorage.getItem(user));
  if(d.points<1000)return alert("mínimo 1000");

  let g=Math.floor(d.points/1000);
  d.points%=1000;
  d.quetzales+=g;

  localStorage.setItem(user,JSON.stringify(d));
  load();
}

/* CLAVES */
function redeem200(){
  let k=key200.value.trim();
  if(k!==KEY_200)return alert("Clave incorrecta");

  let used=JSON.parse(localStorage.getItem("used")||"[]");
  if(used.includes(k))return alert("Ya usada");

  let d=JSON.parse(localStorage.getItem(user));
  d.coins+=200;

  used.push(k);

  localStorage.setItem(user,JSON.stringify(d));
  localStorage.setItem("used",JSON.stringify(used));

  load();
}

function redeem500(){
  let k=key500.value.trim();
  if(k!==KEY_500)return alert("Clave incorrecta");

  let used=JSON.parse(localStorage.getItem("used")||"[]");
  if(used.includes(k))return alert("Ya usada");

  let d=JSON.parse(localStorage.getItem(user));
  d.coins+=500;

  used.push(k);

  localStorage.setItem(user,JSON.stringify(d));
  localStorage.setItem("used",JSON.stringify(used));

  load();
}

function load(){
  let d=JSON.parse(localStorage.getItem(user));
  coins.innerText=d.coins;
  points.innerText=d.points;
  quetzales.innerText=d.quetzales;
}
