// ARRAY DE OBJETOS
// Cada dragón tiene su id (para identificarlo desde el select), nombre, precio y autonomía
let catalogoDragones = [
  { id: 1, nombre: "Lagartija Urbana", precio: 50, autonomia: 150 },
  { id: 2, nombre: "Furia Mística", precio: 150, autonomia: 500 },
  { id: 3, nombre: "Titán de Hierro", precio: 250, autonomia: 750 },
  { id: 4, nombre: "Sombra Ancestral", precio: 300, autonomia: 800 },
  { id: 5, nombre: "Destructor de Reinos", precio: 500, autonomia: 1000 },
  { id: 6, nombre: "Soberano Dorado", precio: 1200, autonomia: 2000 },
];

// DECLARACIONES
let botonReserva = document.getElementById("btnCalcularDias"); // Botón Calcular cotización
let dragonesSelect = document.getElementById("selectorDragon"); // select
let dragonesDias = document.getElementById("diasAlquiler"); // Input de los días de alquiler
let inputDistancia = document.getElementById("distanciaViaje"); // Input de la distancia en km
let resultadoReserva = document.getElementById("resultadoReserva"); // Caja resultado
let btnRestaurar = document.getElementById("btnRestaurar"); // Botón "Restablecer"

// Bóton dia / noche
let btnModoDia = document.getElementById("btnModoDia");

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

// Para alternar el modo día/noche
btnModoDia.addEventListener("click", () => {
  document.body.classList.toggle("modo-dia");

  // Cambiamos el icono según el modo activo
  let icono = btnModoDia.querySelector(".icono-tema");

  if (document.body.classList.contains("modo-dia")) {
    icono.textContent = "☀️";
  } else {
    icono.textContent = "🌙";
  }
});

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
}); // Función auxiliar para cerrar el menú en eventos secundarios

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

// Busca en el array el dragón cuyo id coincide con el que le pasamos
function buscarDragonPorId(id) {
  // BUCLE FOR
  // Recorremos el catálogo de dragones posición por posición desde el principio hasta el final
  for (let i = 0; i < catalogoDragones.length; i++) {
    // Comprobar si el dragón actual es el que buscamos
    if (catalogoDragones[i].id === id) {
      // Devolver el dragón encontrado
      return catalogoDragones[i]; // Lo encontramos, lo devolvemos
    }
    // Fin de la comprobación
  }
  // FIN DEL BUCLE
  return null; // Si no lo encontramos, devolvemos null
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

  // Todo correcto: buscamos el dragón en el array por su id
  let idSeleccionado = Number(dragonesSelect.value);
  let dragonSeleccionado = buscarDragonPorId(idSeleccionado);

  // Si no reconocemos el dragón
  if (dragonSeleccionado === null) {
    resultadoReserva.style.display = "block";
    resultadoReserva.classList.add("es-error");
    resultadoReserva.innerHTML = "<p><span class='resaltado'>Error:</span> No se reconoce este dragón.</p>";
    btnRestaurar.style.display = "block";
    return;
  }

  let costeTotal = dragonSeleccionado.precio * dias; // Precio por día por número de días

  // Resultado final
  generarHojaDeRuta(distanciaUsuario, dragonSeleccionado.autonomia, costeTotal);
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
