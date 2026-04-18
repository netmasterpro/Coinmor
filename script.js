let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "94"
};

document.getElementById("loginBtn").addEventListener("click", login);

function login(){
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if(!USERS[u] || USERS[u] !== p){
    document.getElementById("error").innerText = "Datos incorrectos";
    return;
  }

  user = u;

  if(!localStorage.getItem(user)){
    localStorage.setItem(user, JSON.stringify({
      coins:1000,
      points:0,
      quetzales:0,
      jackpot:false,
      lastReward:0,
      daily:0
    }));
  }

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  load();
}

function load(){
  let data = JSON.parse(localStorage.getItem(user));

  data.quetzales = Math.floor(data.points / 1000);

  let now = Date.now();

  if(data.coins <= 0){
    if(now - data.lastReward > 1800000 && data.daily < 1000){
      data.coins += 100;
      data.daily += 100;
      data.lastReward = now;
    }
  }

  localStorage.setItem(user, JSON.stringify(data));
  updateUI(data);
}

function updateUI(d){
  document.getElementById("coins").innerText = d.coins;
  document.getElementById("points").innerText = d.points;
  document.getElementById("quetzales").innerText = d.quetzales;
}

const symbols = ["N","A","Y","🍒","⭐"];

function spin(){
  let data = JSON.parse(localStorage.getItem(user));

  if(data.coins < 100){
    alert("Sin monedas");
    return;
  }

  data.coins -= 100;

  let r = [random(), random(), random()];

  document.getElementById("r1").innerText = r[0];
  document.getElementById("r2").innerText = r[1];
  document.getElementById("r3").innerText = r[2];

  if(r[0]=="N" && r[1]=="A" && r[2]=="Y" && !data.jackpot){
    data.jackpot = true;
    data.points += 1000;
    alert("🎉 PREMIO MAYOR: TINTE MENSUAL 🎉");
  }
  else if(r[0]==r[1] && r[1]==r[2]){
    data.points += 500;
  }
  else if(r[0]==r[1] || r[1]==r[2]){
    data.points += 100;
  }

  localStorage.setItem(user, JSON.stringify(data));
  load();
}

function random(){
  let p = Math.random();

  if(p < 0.05) return "N";
  if(p < 0.10) return "A";
  if(p < 0.15) return "Y";

  return symbols[Math.floor(Math.random()*symbols.length)];
}

/* WHATSAPP */
function sendPhoto(){
  let msg = encodeURIComponent("Hola, soy " + user + " envío foto para +500 monedas 📸");
  window.open("https://wa.me/573026782036?text=" + msg, "_blank");

  registerPending("foto", 500);
}

function sendAudio(){
  let msg = encodeURIComponent("Hola, soy " + user + " envío audio para +200 monedas 🎤");
  window.open("https://wa.me/573026782036?text=" + msg, "_blank");

  registerPending("audio", 200);
}

function registerPending(type, reward){
  let pending = JSON.parse(localStorage.getItem("pending") || "[]");

  pending.push({user, type, reward});

  localStorage.setItem("pending", JSON.stringify(pending));
}

/* ADMIN */
function openAdmin(){
  document.getElementById("adminPanel").style.display="block";
}

function checkAdmin(){
  let pass = document.getElementById("adminPass").value;

  if(pass === "cristiannayeli"){
    showAdmin();
  }else{
    alert("Clave incorrecta");
  }
}

function showAdmin(){
  let div = document.getElementById("adminContent");
  div.innerHTML = "";

  let list = JSON.parse(localStorage.getItem("pending")||"[]");

  list.forEach((item,i)=>{

    let box = document.createElement("div");

    box.innerHTML = `<p>${item.user} - ${item.type}</p>`;

    let approve = document.createElement("button");
    approve.innerText = "✅ Aprobar";

    let reject = document.createElement("button");
    reject.innerText = "❌ Rechazar";

    approve.onclick = ()=>{
      let data = JSON.parse(localStorage.getItem(item.user));
      data.coins += item.reward;

      localStorage.setItem(item.user, JSON.stringify(data));

      list.splice(i,1);
      localStorage.setItem("pending", JSON.stringify(list));

      showAdmin();
    };

    reject.onclick = ()=>{
      list.splice(i,1);
      localStorage.setItem("pending", JSON.stringify(list));
      showAdmin();
    };

    box.appendChild(approve);
    box.appendChild(reject);

    div.appendChild(box);
  });
}
