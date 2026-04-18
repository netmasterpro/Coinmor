let user = null;

const USERS = {
  "Cristian": "94",
  "Nayeli": "94",
  "Prueba": "12345"
};

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
      coins: u === "Prueba" ? 10000000000000 : 1000,
      points:0,
      jackpot:false
    }));
  }

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  load();
}

function load(){
  let d = JSON.parse(localStorage.getItem(user));

  document.getElementById("coins").innerText = d.coins;
  document.getElementById("points").innerText = d.points;
  document.getElementById("quetzales").innerText = Math.floor(d.points/1000);
}

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

    // 🎯 SOLO NAY da premio mayor
    if(m1=="N" && m2=="A" && m3=="Y" && !d.jackpot){
      d.jackpot = true;
      d.points += 2000;
      alert("🎉 PREMIO MAYOR 💖");
    }

    // 🍒⭐ premios normales (SIN letras)
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

/* WHATSAPP */
function sendPhoto(){
  window.open("https://w.app/ruqepz","_blank");
  register("foto",500);
}

function sendAudio(){
  window.open("https://w.app/hxpfqw","_blank");
  register("audio",200);
}

function register(type,reward){
  let p = JSON.parse(localStorage.getItem("pending")||"[]");
  p.push({user,type,reward});
  localStorage.setItem("pending", JSON.stringify(p));
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
  div.innerHTML="";

  let list = JSON.parse(localStorage.getItem("pending")||"[]");

  list.forEach((item,i)=>{
    let box = document.createElement("div");

    box.innerHTML = `${item.user} - ${item.type}`;

    let ok = document.createElement("button");
    ok.innerText="✔";

    let no = document.createElement("button");
    no.innerText="✖";

    ok.onclick=()=>{
      let d = JSON.parse(localStorage.getItem(item.user));
      d.coins += item.reward;

      localStorage.setItem(item.user, JSON.stringify(d));

      list.splice(i,1);
      localStorage.setItem("pending", JSON.stringify(list));
      showAdmin();
    };

    no.onclick=()=>{
      list.splice(i,1);
      localStorage.setItem("pending", JSON.stringify(list));
      showAdmin();
    };

    box.appendChild(ok);
    box.appendChild(no);

    div.appendChild(box);
  });
}
