const API = "http://localhost:3000/api";

// LOGIN
function login() {
  fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(res=>res.text())
  .then(data=>{
    if(data.includes("Invalid")){
      msg.innerText=data;
    } else {
      localStorage.setItem("user", data);
      window.location="booking.html";
    }
  });
}

// REGISTER
function register() {
  fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name:"User",
      email: email.value,
      password: password.value
    })
  })
  .then(res=>res.text())
  .then(data=>msg.innerText=data);
}

// LOAD DOCTORS
if(document.getElementById("doctor")){
  fetch(`${API}/doctors`)
  .then(res=>res.json())
  .then(data=>{
    data.forEach(d=>{
      doctor.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
  });
}

// GENERATE SLOTS
date.onchange = loadSlots;

function loadSlots(){
  time.innerHTML="";
  const selectedDate = date.value;

  fetch(`${API}/appointments?doctor_id=${doctor.value}&date=${selectedDate}`)
  .then(res=>res.json())
  .then(booked=>{
    for(let h=9;h<17;h++){
      ["00","15","30","45"].forEach(m=>{
        const t = `${h}:${m}:00`;

        const isBooked = booked.find(b=>b.time===t);

        if(!isBooked){
          time.innerHTML += `<option>${t}</option>`;
        }
      });
    }
  });
}

function book(){
  console.log("Book clicked");  // 👈 ADD THIS

  const user = JSON.parse(localStorage.getItem("user"));

  fetch("http://localhost:3000/api/book", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      user_id:user.id,
      doctor_id:doctor.value,
      date:date.value,
      time:time.value
    })
  })
  .then(res=>res.text())
  .then(data=>{
    console.log(data);          // 👈 ADD THIS
    msg.innerText=data;
  });
}