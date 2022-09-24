let WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let API_KEY= '&APPID=31866de011ff86c40a246fed7ea08ab5&lang=es';
let gradosC = '&units=metric'
let gradosF = '&units=imperial'
let displayC
let input = document.getElementById("buscador");
let btnCambiar = document.getElementById("cambiar");

async function getData(ciudad,grados){
    try{
       let response = await fetch(WEATHER_URL + ciudad + API_KEY + grados, {mode: "cors"});
        let datos = await response.json();
        return datos;
    }
    catch(err){
        console.log("oopss" + err);
    }
}

async function dataObj(ciudad,grados){
   let data = await getData(ciudad,grados);
   let main = await data.main;
   let city = await data.name;
   let country = await data.sys.country;
   let weather = await data.weather[0];
   return {main, city, country, weather};
};

document.getElementById("buscar").addEventListener("click",()=>{
    dataObj(input.value,gradosC).then((datos) =>{
        console.log(datos);
        displayC = true;
        display(datos,"C");
        document.getElementById("contenedor").scrollIntoView({ 
            behavior: 'smooth' 
          });
    })
    .catch(err =>{
        alert("No se encontro resultado, ingrese una ciudad valida");
    })
});

btnCambiar.addEventListener("click",()=>{
    if(displayC){
        dataObj(input.value,gradosF).then((datos) =>{
            displayC = false;
            display(datos,"F");
            btnCambiar.innerHTML = '°C / <span class="fw-bold">°F</span>';
        })
    }else{
        dataObj(input.value,gradosC).then((datos) =>{
            displayC = true;
            display(datos,"C");
            btnCambiar.innerHTML = '<span class="fw-bold">°C</span> / °F';
        })
    }
})

function display(datos,letra){
    let contenedor = document.querySelector(".container");
    contenedor.innerHTML = `
    <div class="container vh-100">
      <div class="d-flex mb-2 mt-5">
        <div class="me-auto p-2 fs-2"> <span class="text-muted">Ciudad:</span> ${datos.city}</div>
        <div  class="p-2 fs-2"><span class="text-muted">Pais:</span> ${datos.country}</div>
    </div>
    <div class="d-flex mb-2 justify-content-center h-50 fs-1">
        <div class="align-self-center"><p class="text-center text-muted">Temperatura:</p> <p class="text-center">${datos.main.temp} °${letra}</p></div>
    </div>
    <div class="d-flex mb-2 justify-content-between h-25 fs-2">
        <div class="align-self-center"><span class="text-muted">Condición:</span> ${datos.weather.description}
        <img src="http://openweathermap.org/img/wn/${datos.weather.icon}@2x.png" alt="weather condition icon"></div>
        <div class="align-self-center"> <p><span class="text-muted">Temperatura Máxima:</span> ${datos.main.temp_max} °${letra}</p>
          <p><span class="text-muted">Temperatura Mínima:</span> ${datos.main.temp_min} °${letra}</p></div>
    </div>
    </div>
    `
}

