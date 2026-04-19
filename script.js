let user = null;

/* 👤 USUARIOS */
const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

/* 🔑 CLAVES */
const KEY_200 = "K200";
const KEY_500 = "K500";

/* LOGIN */
function login(){
  let u = document.getElementById("username").value.trim();
  let p = document.getElementById("password").value.trim();

  if(!USERS[u] || USERS[u] !== p){
    document.getElementById("error").innerText = "Datos incorrectos";
    return;
  }

  user = u;

  if(!localStorage.getItem(user)){
    localStorage.setItem(user, JSON.stringify({
      coins: u === "Prueba" ? 100000000 : 1000,
      points: 0,
      quetzales: 0,
      jackpot: false,
      lastOnline: Date.now()
    }));
  }

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  applyOfflineCoins();
  load();
  startAutoCoins();
}

/* 💰 MONEDAS OFFLINE */
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

/* ⏱️ MONEDAS ONLINE */
function startAutoCoins(){
  setInterval(()=>{
    let d = JSON.parse(localStorage.getItem(user));
    d.coins += 1;
    localStorage.setItem(user, JSON.stringify(d));
    load();
  }, 30000);
}

/* 🎰 TRAGAPERRAS */
const symbols = ["N","A","Y","🍒","⭐"];

function spin(){
  let d = JSON.parse(localStorage.getItem(user));

  if(d.coins < 100){
    alert("Sin monedas");
    return;
  }

  d.coins -= 100;

  spinColumn("c1");
  spinColumn("c2");
  spinColumn("c3");

  setTimeout(()=>{

    let m1 = document.getElementById("c1r2").innerText;
    let m2 = document.getElementById("c2r2").innerText;
    let m3 = document.getElementById("c3r2").innerText;

    /* 🎯 PREMIO MAYOR */
    if(m1=="N" && m2=="A" && m3=="Y" && !d.jackpot){
      d.jackpot = true;
      d.points += 2000;
      alert("🎉 PREMIO MAYOR 💖");
    }

    /* 🎰 PREMIOS NORMALES */
    else if(m1===m2 && m2===m3 && !["N","A","Y"].includes(m1)){
      d.points += 500;
    }
    else if((m1===m2 || m2===m3) && !["N","A","Y"].includes(m2)){
      d.points += 200;
    }

    localStorage.setItem(user, JSON.stringify(d));
    load();

  }, 1000);
}

function spinColumn(prefix){
  let ids = ["r1","r2","r3"];

  let interval = setInterval(()=>{
    ids.forEach(id=>{
      document.getElementById(prefix+id).innerText =
        symbols[Math.floor(Math.random()*symbols.length)];
    });
  }, 100);

  setTimeout(()=>clearInterval(interval), 800);
}

/* 💱 CONVERTIR PUNTOS */
function convertPoints(){
  let d = JSON.parse(localStorage.getItem(user));

  if(d.points < 1000){
    alert("Necesitas mínimo 1000 puntos");
    return;
  }

  let gained = Math.floor(d.points / 1000);

  d.points = d.points % 1000;
  d.quetzales += gained;

  localStorage.setItem(user, JSON.stringify(d));

  alert("Ganaste " + gained + " quetzales 💵");

  load();
}

/* 🔗 WHATSAPP */
function sendPhoto(){
  window.open("https://w.app/ruqepz","_blank");
}

function sendAudio(){
  window.open("https://w.app/hxpfqw","_blank");
}

/* 🔑 CLAVES */
function redeem200(){
  let input = document.getElementById("key200").value.trim();

  if(input !== KEY_200){
    alert("Clave incorrecta");
    return;
  }

  let used = JSON.parse(localStorage.getItem("used") || "[]");

  if(used.includes(input)){
    alert("Esta clave ya fue usada");
    return;
  }

  let d = JSON.parse(localStorage.getItem(user));
  d.coins += 200;

  used.push(input);

  localStorage.setItem(user, JSON.stringify(d));
  localStorage.setItem("used", JSON.stringify(used));

  alert("Ganaste 200 monedas 💰");

  load();
}

function redeem500(){
  let input = document.getElementById("key500").value.trim();

  if(input !== KEY_500){
    alert("Clave incorrecta");
    return;
  }

  let used = JSON.parse(localStorage.getItem("used") || "[]");

  if(used.includes(input)){
    alert("Esta clave ya fue usada");
    return;
  }

  let d = JSON.parse(localStorage.getItem(user));
  d.coins += 500;

  used.push(input);

  localStorage.setItem(user, JSON.stringify(d));
  localStorage.setItem("used", JSON.stringify(used));

  alert("Ganaste 500 monedas 💰");

  load();
}

/* 📊 CARGAR DATOS */
function load(){
  let d = JSON.parse(localStorage.getItem(user));

  document.getElementById("coins").innerText = d.coins;
  document.getElementById("points").innerText = d.points;
  document.getElementById("quetzales").innerText = d.quetzales;
}
