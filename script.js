let user = null;

/* USUARIOS */
const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

/* CLAVES */
const KEY_200 = "K200";
const KEY_500 = "K500";

/* LOGIN */
function login(){
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if(!USERS[u] || USERS[u] !== p){
    error.innerText = "Datos incorrectos";
    return;
  }

  user = u;

  let data = JSON.parse(localStorage.getItem(user));

  /* SI NO EXISTE → CREAR */
  if(!data){
    data = {
      coins: u === "Prueba" ? 2000000 : 2000,
      points: 0,
      quetzales: 0,
      jackpot: false,
      lastOnline: Date.now()
    };
    localStorage.setItem(user, JSON.stringify(data));
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  applyOfflineCoins();
  load();
}

/* MONEDAS OFFLINE */
function applyOfflineCoins(){
  let d = JSON.parse(localStorage.getItem(user));

  if(!d) return;

  let now = Date.now();
  let diff = now - d.lastOnline;

  let mins = Math.floor(diff / 60000);

  let earned = Math.floor(mins / 30) * 100;

  d.coins += earned;
  d.lastOnline = now;

  localStorage.setItem(user, JSON.stringify(d));
}

/* SLOT */
const symbols = ["❤️","⭐","🌙","🍒","💎","🍀","🔥","N","A","Y"];

function spin(){
  let d = JSON.parse(localStorage.getItem(user));

  if(!d || d.coins < 100){
    alert("Sin monedas");
    return;
  }

  d.coins -= 100;

  spinCol("c1");
  spinCol("c2");
  spinCol("c3");

  setTimeout(()=>{

    const m1 = document.getElementById("c1r2").innerText;
    const m2 = document.getElementById("c2r2").innerText;
    const m3 = document.getElementById("c3r2").innerText;

    /* PREMIO MAYOR */
    if(m1==="N" && m2==="A" && m3==="Y" && !d.jackpot){
      d.jackpot = true;
      d.points += 2000;
      alert("🎉 PREMIO MAYOR");
    }
    else if(m1===m2 && m2===m3){
      d.points += 200;
    }
    else if(m1===m2 || m2===m3){
      d.points += 50;
    }

    localStorage.setItem(user, JSON.stringify(d));
    load();

  }, 1000);
}

function spinCol(prefix){
  const ids = ["r1","r2","r3"];

  const interval = setInterval(()=>{
    ids.forEach(id=>{
      document.getElementById(prefix + id).innerText =
        symbols[Math.floor(Math.random()*symbols.length)];
    });
  },100);

  setTimeout(()=>clearInterval(interval),800);
}

/* CANJEAR */
function convertPoints(){
  let d = JSON.parse(localStorage.getItem(user));

  if(!d || d.points < 1000){
    alert("Necesitas 1000 puntos");
    return;
  }

  let g = Math.floor(d.points / 1000);

  d.points = d.points % 1000;
  d.quetzales += g;

  localStorage.setItem(user, JSON.stringify(d));
  load();
}

/* CLAVES */
function redeem200(){
  const input = document.getElementById("key200").value.trim();

  if(input !== KEY_200){
    alert("Clave incorrecta");
    return;
  }

  let used = JSON.parse(localStorage.getItem("used") || "[]");

  if(used.includes(input)){
    alert("Ya usada");
    return;
  }

  let d = JSON.parse(localStorage.getItem(user));
  d.coins += 200;

  used.push(input);

  localStorage.setItem(user, JSON.stringify(d));
  localStorage.setItem("used", JSON.stringify(used));

  load();
}

function redeem500(){
  const input = document.getElementById("key500").value.trim();

  if(input !== KEY_500){
    alert("Clave incorrecta");
    return;
  }

  let used = JSON.parse(localStorage.getItem("used") || "[]");

  if(used.includes(input)){
    alert("Ya usada");
    return;
  }

  let d = JSON.parse(localStorage.getItem(user));
  d.coins += 500;

  used.push(input);

  localStorage.setItem(user, JSON.stringify(d));
  localStorage.setItem("used", JSON.stringify(used));

  load();
}

/* LOAD */
function load(){
  let d = JSON.parse(localStorage.getItem(user));

  if(!d) return;

  document.getElementById("coins").innerText = d.coins;
  document.getElementById("points").innerText = d.points;
  document.getElementById("quetzales").innerText = d.quetzales;
}
