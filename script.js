let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

function login(){
  let u = username.value.trim();
  let p = password.value.trim();

  if(!USERS[u] || USERS[u] !== p){
    error.innerText = "Error";
    return;
  }

  user = u;

  if(!localStorage.getItem(user)){
    localStorage.setItem(user, JSON.stringify({
      coins: u==="Prueba"?100000000:1000,
      points:0,
      quetzales:0,
      jackpot:false,
      lastOnline: Date.now()
    }));
  }

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  applyOfflineCoins();
  load();
  startAutoCoins();
}

/* 💰 OFFLINE */
function applyOfflineCoins(){
  let d = JSON.parse(localStorage.getItem(user));

  let now = Date.now();
  let diff = now - d.lastOnline;

  let minutes = Math.floor(diff / 60000);

  let coinsEarned = Math.floor(minutes / 30) * 100;

  d.coins += coinsEarned;
  d.lastOnline = now;

  localStorage.setItem(user, JSON.stringify(d));
}

/* ⏱️ ONLINE */
function startAutoCoins(){
  setInterval(()=>{
    let d = JSON.parse(localStorage.getItem(user));
    d.coins += 1;
    localStorage.setItem(user, JSON.stringify(d));
    load();
  },30000);
}

/* 🎰 JUEGO */
const symbols = ["N","A","Y","🍒","⭐"];

function spin(){
  let d = JSON.parse(localStorage.getItem(user));

  if(d.coins < 100) return alert("Sin monedas");

  d.coins -= 100;

  spinCol("c1");
  spinCol("c2");
  spinCol("c3");

  setTimeout(()=>{
    let m1=c1r2.innerText;
    let m2=c2r2.innerText;
    let m3=c3r2.innerText;

    if(m1=="N"&&m2=="A"&&m3=="Y"&&!d.jackpot){
      d.jackpot=true;
      d.points+=2000;
      alert("PREMIO MAYOR");
    }
    else if(m1===m2&&m2===m3&&!["N","A","Y"].includes(m1)){
      d.points+=500;
    }
    else if((m1===m2||m2===m3)&&!["N","A","Y"].includes(m2)){
      d.points+=200;
    }

    localStorage.setItem(user,JSON.stringify(d));
    load();
  },1000);
}

function spinCol(p){
  let ids=["r1","r2","r3"];
  let i=setInterval(()=>{
    ids.forEach(id=>{
      document.getElementById(p+id).innerText =
      symbols[Math.floor(Math.random()*symbols.length)];
    });
  },100);
  setTimeout(()=>clearInterval(i),800);
}

/* 💱 */
function convertPoints(){
  let d=JSON.parse(localStorage.getItem(user));
  if(d.points<1000)return alert("mínimo 1000");
  let g=Math.floor(d.points/1000);
  d.points%=1000;
  d.quetzales+=g;
  localStorage.setItem(user,JSON.stringify(d));
  load();
}

/* 🔑 CLAVES */
const KEY_200="K200";
const KEY_500="K500";

function used(key){
  let u=JSON.parse(localStorage.getItem("used")||"[]");
  return u.includes(key);
}

function saveKey(key){
  let u=JSON.parse(localStorage.getItem("used")||"[]");
  u.push(key);
  localStorage.setItem("used",JSON.stringify(u));
}

function redeem200(){
  let k=key200.value;
  if(k!==KEY_200)return alert("Clave incorrecta");
  if(used(k))return alert("Ya usada");

  let d=JSON.parse(localStorage.getItem(user));
  d.coins+=200;

  localStorage.setItem(user,JSON.stringify(d));
  saveKey(k);
  load();
}

function redeem500(){
  let k=key500.value;
  if(k!==KEY_500)return alert("Clave incorrecta");
  if(used(k))return alert("Ya usada");

  let d=JSON.parse(localStorage.getItem(user));
  d.coins+=500;

  localStorage.setItem(user,JSON.stringify(d));
  saveKey(k);
  load();
}

/* LOAD */
function load(){
  let d=JSON.parse(localStorage.getItem(user));
  coins.innerText=d.coins;
  points.innerText=d.points;
  quetzales.innerText=d.quetzales;
}
