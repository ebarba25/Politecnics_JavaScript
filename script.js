// Declaraciones
let botonReserva = document.getElementById("btnCalcularDias");
let dragonesSelect = document.getElementById("selectorDragon");
let dragonesDias = document.getElementById("diasAlquiler");
let inputDistancia = document.getElementById("distanciaViaje");
let resultadoReserva = document.getElementById("resultadoReserva");

// Listeners
// Ratón
botonReserva.addEventListener("click", procesarReserva);
// Teclado
dragonesSelect.addEventListener("keydown", comprobarTeclaDragon);
dragonesDias.addEventListener("keydown", comprobarTeclaDragon);
inputDistancia.addEventListener("keydown", comprobarTeclaDragon);

// Precios y autonomia dragones con if/else
function obtenerAutonomia(precioPorDia) {
  if (precioPorDia === 50) {
    return 150;
  } else if (precioPorDia === 150) {
    return 500;
  } else if (precioPorDia === 250) {
    return 750;
  } else if (precioPorDia === 500) {
    return 1000;
  } else if (precioPorDia === 1200) {
    return 2000;
  } else {
    return 0;
  }
}

// Ruta
function generarHojaDeRuta(distancia, autonomia, coste) {
  // Prepara el sitio
  resultadoReserva.style.display = "block";
  resultadoReserva.classList.remove("es-error", "es-alerta", "es-exito");
  // Cuanto aguanta el dragon
  if (distancia > autonomia) {
    resultadoReserva.classList.add("es-alerta");
    resultadoReserva.innerHTML = `
      <p><span class='resaltado'>El coste total es de ${coste} monedas.</span></p>
      <p><span class='resaltado'>Vuelo con paradas:</span> Tu destino está a ${distancia} km, pero este dragón solo vuela ${autonomia} km seguidos.</p>
      <p class='titulo-paradas'><span class='resaltado'>Hoja de ruta recomendada:</span></p>
      <ul class='lista-paradas' id='listaParadas'></ul>`;

    let listaParadas = document.getElementById("listaParadas");
    let kmRecorridos = autonomia;
    let numeroParada = 1;
    // Para mirar los km recorridos
    while (kmRecorridos < distancia) {
      listaParadas.innerHTML += `<li>Parada ${numeroParada}: En el kilómetro ${kmRecorridos} para descansar.</li>`;
      // Sumar lo que aguanta el dragón
      kmRecorridos += autonomia;
      // Le sumamos 1 parada
      numeroParada++;
    }
    // Ultimo trozo de viaje hasta el final
    let kmRestantes = distancia - (kmRecorridos - autonomia);
    listaParadas.innerHTML += `<li>Tramo final: Volás los últimos ${kmRestantes} km hasta llegar a tu destino.</li>`;
  } else {
    // Si la distancia es menor
    resultadoReserva.classList.add("es-exito");
    resultadoReserva.innerHTML = `
    <p>El Presupuesto para tu viaje <span class='resaltado'>es de ${coste} monedas de oro.</span></p>
    <p><span class='resaltado'>Vuelo directo:</span> ¡Excelente! Como tu destino está a menos de ${autonomia} km, 
    llegarás sin necesidad de paradas.</p>`;
  }
}

// Mensajes para confirmar los datos de input
function procesarReserva() {
  // Limpiar pantalla
  resultadoReserva.textContent = "";
  resultadoReserva.style.display = "none";
  resultadoReserva.classList.remove("es-error", "es-alerta", "es-exito");
  // Hay dragón
  if (dragonesSelect.value === "") {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, elige un dragón de la lista.</p>";
    return;
  }
  // Comprobar días
  let dias = Number(dragonesDias.value);
  //  Si esta vacío o no es un número entero
  if (dragonesDias.value === "" || !Number.isInteger(dias)) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, introduce un número entero de días.</p>";
    return; // No deja seguir
  }
  //0 o un número negativo
  if (dias <= 0) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> Los días deben ser mayores a cero.</p>";
    return; // No deja seguir
  }
  // Que no sea mayor a 15
  if (dias > 15) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML =
      "<p><span class='resaltado'>Límite excedido:</span> No se permite alquilar dragones por más de 15 días seguidos. ¡Necesitan descansar!</p>";
    return; // No deja seguir
  }
  //Convertimos el texto de la distancia a número
  let distanciaUsuario = Number(inputDistancia.value);
  //  Si esta vacío o no es un número entero
  if (inputDistancia.value === "" || !Number.isInteger(distanciaUsuario)) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, introduce un número entero de kilómetros.</p>";
    return;
  }
  //0 o un número negativo
  if (distanciaUsuario <= 0) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> La distancia debe ser mayor a cero.</p>";
    return;
  }
  // Que no sea mayor a 2250
  if (distanciaUsuario > 2250) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML =
      "<p><span class='resaltado'>Límite de vuelo excedido:</span> No se permiten viajes de más de 2,250km para evitar el agotamiento del dragón.</p>";
    return;
  }
  // Todo correcto
  let precioPorDia = Number(dragonesSelect.value);
  let autonomiaDragon = obtenerAutonomia(precioPorDia);
  let costeTotal = precioPorDia * dias;
  // Resultado final
  generarHojaDeRuta(distanciaUsuario, autonomiaDragon, costeTotal);
}

// Para el enter
function comprobarTeclaDragon(event) {
  if (event.key === "Enter") {
    procesarReserva();
  }
}
