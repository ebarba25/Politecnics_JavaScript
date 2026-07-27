// DECLARACIONES
let botonReserva = document.getElementById("btnCalcularDias"); // Botón Calcular cotización
let dragonesSelect = document.getElementById("selectorDragon"); // select
let dragonesDias = document.getElementById("diasAlquiler"); // Input de los días de alquiler
let inputDistancia = document.getElementById("distanciaViaje"); // Input de la distancia en km
let resultadoReserva = document.getElementById("resultadoReserva"); // Caja resultado
let btnRestaurar = document.getElementById("btnRestaurar"); // Botón "Restablecer"

//Menú hamburguesa
let btnHamburguesa = document.getElementById("btnHamburguesa"); // Botón hamburguesa
let menuNavegacion = document.getElementById("menuNavegacion"); // El nav con los enlaces
let enlacesMenu = document.querySelectorAll(".menu-links a"); // Todos los a

// Guardamos el texto original del botón para poder devolverlo tal cual estaba
let textoOriginalBoton = botonReserva.textContent;


// LISTENERS
// Ratón
botonReserva.addEventListener("click", procesarReserva); // Al hacer clic procesarReserva

// Teclado
dragonesSelect.addEventListener("keydown", comprobarTeclaDragon); // Detecta teclas en el select
dragonesDias.addEventListener("keydown", comprobarTeclaDragon); // Detecta teclas en el input de días
inputDistancia.addEventListener("keydown", comprobarTeclaDragon); // Detecta teclas en el input de distancia

// Efecto al pasar el ratón por encima del botón de calcular
botonReserva.addEventListener("mouseover", function () {
  botonReserva.textContent = "Calcula"; // Cambiamos el texto temporalmente
});
botonReserva.addEventListener("mouseout", function () {
  botonReserva.textContent = textoOriginalBoton; // Texto original
});

// Botón de restaurar
btnRestaurar.addEventListener("click", restaurarFormulario); // Limpia todo el formulario

// Limpiar el mensaje de error 
dragonesSelect.addEventListener("change", limpiarError); // "change" al elegir otra opción del select
dragonesDias.addEventListener("input", limpiarError); // "input" cada vez que se escribe algo
inputDistancia.addEventListener("input", limpiarError); // Igual, pero en el campo de distancia

//Menú
btnHamburguesa.addEventListener("click", () => {
  btnHamburguesa.classList.toggle("activo");
  menuNavegacion.classList.toggle("menu-abierto");
});// Función auxiliar para cerrar el menú en eventos secundarios

// Cerrar el menú si se hace clic fuera de él
document.addEventListener("click", function (event) {
  let clicDentroDelMenu = menuNavegacion.contains(event.target);
  let clicEnElBoton = btnHamburguesa.contains(event.target);

  if (menuNavegacion.classList.contains("menu-abierto") && !clicDentroDelMenu && !clicEnElBoton) {
    cerrarMenu();
  }
});

// Cerrar el menú al pulsar cualquier enlace
enlacesMenu.forEach((enlace) => enlace.addEventListener("click", cerrarMenu));

// FUNCIONES
// Para el menú
function cerrarMenu() {
  btnHamburguesa.classList.remove("activo");
  menuNavegacion.classList.remove("menu-abierto");
}

// Precios y autonomia dragones con if/else 
function obtenerAutonomia(precioPorDia) {
  if (precioPorDia === 50) {
    return 150; // Lagartija Urbana
  } else if (precioPorDia === 150) {
    return 500; // Furia Mística
  } else if (precioPorDia === 250) {
    return 750; // Titán de Hierro
  } else if (precioPorDia === 300) {
    return 800; // Sombra Ancestral
  } else if (precioPorDia === 500) {
    return 1000; // Destructor de Reinos
  } else if (precioPorDia === 1200) {
    return 2000; // Soberano Dorado
  } else {
    return 0; // Precio no reconocido
  }
}


// Ruta
function generarHojaDeRuta(distancia, autonomia, coste) {
  resultadoReserva.style.display = "block"; 
  resultadoReserva.classList.remove("es-error", "es-alerta", "es-exito");

  // Cuanto aguanta el dragon
  if (distancia > autonomia) {
    // El dragón no llega en un solo tramo
    resultadoReserva.classList.add("es-alerta");
    resultadoReserva.innerHTML = `
      <p><span class='resaltado'>El coste total es de ${coste} monedas.</span></p>
      <p><span class='resaltado'>Vuelo con paradas:</span> Tu destino está a ${distancia} km, pero este dragón solo vuela ${autonomia} km seguidos.</p>
      <p class='titulo-paradas'><span class='resaltado'>Hoja de ruta recomendada:</span></p>
      <ul class='lista-paradas' id='listaParadas'></ul>`;

    let listaParadas = document.getElementById("listaParadas"); // Cogemos la lista que acabamos de crear
    let kmRecorridos = autonomia; // Variable de control del bucle
    let numeroParada = 1; // Contador de paradas

    // BUCLE WHILE
    // Mientras aún no hayamos llegado a la distancia total, seguimos añadiendo paradas.
    while (kmRecorridos < distancia) {
      listaParadas.innerHTML += `<li>Parada ${numeroParada}: En el kilómetro ${kmRecorridos} para descansar.</li>`;
      // Sumar lo que aguanta el dragón
      kmRecorridos += autonomia; // Avanzamos otro tramo
      // Le sumamos 1 parada
      numeroParada++; // Contamos una parada más
    }
    // FIN DEL BUCLE

    // Ultimo trozo de viaje hasta el final
    let kmRestantes = distancia - (kmRecorridos - autonomia); // Lo que queda del último tramo
    listaParadas.innerHTML += `<li>Tramo final: Volás los últimos ${kmRestantes} km hasta llegar a tu destino.</li>`;
  } else {
    // Si la distancia es menor o igual a la autonomía
    resultadoReserva.classList.add("es-exito");
    resultadoReserva.innerHTML = `
    <p>El Presupuesto para tu viaje <span class='resaltado'>es de ${coste} monedas de oro.</span></p>
    <p><span class='resaltado'>Vuelo directo:</span> ¡Excelente! Como tu destino está a menos de ${autonomia} km, 
    llegarás sin necesidad de paradas.</p>`;
  }

  btnRestaurar.style.display = "block";
}

// Mensajes para confirmar los datos de input
function procesarReserva() {
  resultadoReserva.textContent = ""; 
  resultadoReserva.style.display = "none"; 
  resultadoReserva.classList.remove("es-error", "es-alerta", "es-exito"); // Quitamos colores anteriores

  // Hay dragón
  if (dragonesSelect.value === "") {
    // El valor está vacío si sigue puesta la opción "Escoge tu transporte"
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, elige un dragón de la lista.</p>";
    btnRestaurar.style.display = "block";
    return; // Cortamos aquí
  }

  // Comprobar días
  let dias = Number(dragonesDias.value); // Convertimos el texto del input a número
  //  Si esta vacío o no es un número entero
  if (dragonesDias.value === "" || !Number.isInteger(dias)) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, introduce un número entero de días.</p>";
    btnRestaurar.style.display = "block";
    return; // No deja seguir
  }
  //0 o un número negativo
  if (dias <= 0) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> Los días deben ser mayores a cero.</p>";
    btnRestaurar.style.display = "block";
    return; // No deja seguir
  }
  // Que no sea mayor a 15
  if (dias > 15) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML =
      "<p><span class='resaltado'>Límite excedido:</span> No se permite alquilar dragones por más de 15 días seguidos. ¡Necesitan descansar!</p>";
    btnRestaurar.style.display = "block";
    return; // No deja seguir
  }

  //Convertimos el texto de la distancia a número
  let distanciaUsuario = Number(inputDistancia.value);

  //  Si esta vacío o no es un número entero
  if (inputDistancia.value === "" || !Number.isInteger(distanciaUsuario)) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Atención:</span> Por favor, introduce un número entero de kilómetros.</p>";
    btnRestaurar.style.display = "block";
    return;
  }
  //0 o un número negativo
  if (distanciaUsuario <= 0) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> La distancia debe ser mayor a cero.</p>";
    btnRestaurar.style.display = "block";
    return;
  }
  // Menor que el mínimo permitido
  if (distanciaUsuario < 5) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> La distancia mínima es de 5 km.</p>";
    btnRestaurar.style.display = "block";
    return;
  }
  // Que no sea mayor a 2250
  if (distanciaUsuario > 2250) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML =
      "<p><span class='resaltado'>Límite de vuelo excedido:</span> No se permiten viajes de más de 2,250km para evitar el agotamiento del dragón.</p>";
    btnRestaurar.style.display = "block";
    return;
  }

  // Todo correcto
  let precioPorDia = Number(dragonesSelect.value); 
  let autonomiaDragon = obtenerAutonomia(precioPorDia); 

  // Si no reconocemos el dragón
  if (autonomiaDragon <= 0) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> No se reconoce este dragón.</p>";
    btnRestaurar.style.display = "block";
    return;
  }

  let costeTotal = precioPorDia * dias; // Precio por día por número de días

  // Resultado final
  generarHojaDeRuta(distanciaUsuario, autonomiaDragon, costeTotal);
}

// Para el enter
function comprobarTeclaDragon(event) {
  if (event.key === "Enter") {
    procesarReserva();
  }
}

// Si el usuario está corrigiendo un campo, quita el error 
function limpiarError() {
  if (resultadoReserva.classList.contains("es-error")) {
    // Solo si se ha mostrando un error
    resultadoReserva.textContent = ""; 
    resultadoReserva.style.display = "none"; 
    resultadoReserva.classList.remove("es-error"); 
    btnRestaurar.style.display = "none";
  }
}

// Restaura el formulario
function restaurarFormulario() {
  dragonesSelect.value = ""; 
  dragonesDias.value = ""; 
  inputDistancia.value = ""; 

  resultadoReserva.textContent = "";
  resultadoReserva.style.display = "none"; 
  resultadoReserva.classList.remove("es-error", "es-alerta", "es-exito");

  btnRestaurar.style.display = "none"; 

  dragonesSelect.focus();
}
