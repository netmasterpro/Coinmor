let user = null;

function login(){
  user = document.getElementById("username").value;

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

  // convertir puntos a quetzales
  data.quetzales = Math.floor(data.points / 1000);

  // recompensa cada 30 min
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

  if(data.coins < 100) return alert("Sin monedas");

  data.coins -= 100;

  let r = [
    random(),
    random(),
    random()
  ];

  document.getElementById("r1").innerText = r[0];
  document.getElementById("r2").innerText = r[1];
  document.getElementById("r3").innerText = r[2];

  // PREMIO MAYOR NAY
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
  let prob = Math.random();

  if(prob < 0.05) return "N";
  if(prob < 0.10) return "A";
  if(prob < 0.15) return "Y";

  return symbols[Math.floor(Math.random()*symbols.length)];
}

/* SUBIDAS */
let pending = JSON.parse(localStorage.getItem("pending")||"[]");

function uploadPhoto(){
  pending.push({user,type:"foto",reward:500});
  localStorage.setItem("pending", JSON.stringify(pending));
  alert("Foto enviada para revisión");
}

function uploadAudio(){
  pending.push({user,type:"audio",reward:100});
  localStorage.setItem("pending", JSON.stringify(pending));
  alert("Audio enviado");
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
    let btn = document.createElement("button");
    btn.innerText = item.user + " - " + item.type;

    let approve = document.createElement("button");
    approve.innerText = "Aprobar";

    approve.onclick = ()=>{
      let data = JSON.parse(localStorage.getItem(item.user));
      data.coins += item.reward;

      localStorage.setItem(item.user, JSON.stringify(data));

      list.splice(i,1);
      localStorage.setItem("pending", JSON.stringify(list));
      showAdmin();
    };

    div.appendChild(btn);
    div.appendChild(approve);
    div.appendChild(document.createElement("br"));
  });
}
