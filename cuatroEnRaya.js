var canvas = document.getElementById("canvasJuego");
var ctx = canvas.getContext("2d");

var TAMANO_CASILLA = 70;
var FILAS = 6;
var COLUMNAS = 7;

var tablero = [];
var jugadorActual = 1;
var juegoTerminado = false;

canvas.addEventListener("click", manejarClick);

function crearTablero() {
    for (var fila = 0; fila < FILAS; fila++) {
        tablero[fila] = [];
        for (var columna = 0; columna < COLUMNAS; columna++) {
            tablero[fila][columna] = 0;
        }
    }
}

function pintarTablero() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var fila = 0; fila < FILAS; fila++) {
        for (var columna = 0; columna < COLUMNAS; columna++) {
            var x = columna * TAMANO_CASILLA + TAMANO_CASILLA / 2;
            var y = fila * TAMANO_CASILLA + TAMANO_CASILLA / 2;
            var radio = TAMANO_CASILLA / 2 - 5;

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(x, y, radio, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            if (tablero[fila][columna] === 1) {
                ctx.fillStyle = "red";
                ctx.fill();
            } else if (tablero[fila][columna] === 2) {
                ctx.fillStyle = "yellow";
                ctx.fill();
            }
        }
    }
}

function manejarClick(evento) {
    if (juegoTerminado) {
        return;
    }

    var posicionCanvas = canvas.getBoundingClientRect();
    var x = evento.clientX - posicionCanvas.left;
    var columnaClick = Math.floor((x + TAMANO_CASILLA / 2) / TAMANO_CASILLA);


    soltarFicha(columnaClick);
}

function soltarFicha(columna) {
    var columnaValida = obtenerColumnaValida(columna);
    if (columnaValida === -1) {
        return;
    }

    var fila = obtenerFilaDisponible(columnaValida);
    if (fila === -1) {
        return;
    }

    tablero[fila][columna] = jugadorActual;
    pintarTablero();

    if (comprobarGanador(fila, columna)) {
        juegoTerminado = true;
        document.getElementById("mensaje").textContent = "Ha ganado el jugador " + jugadorActual;
    } else if (tableroLleno()) {
        juegoTerminado = true;
        document.getElementById("mensaje").textContent = "¡Empate!";
    }

    jugadorActual = jugadorActual === 1 ? 2 : 1;
}

function obtenerFilaDisponible(columna) {
    for (var fila = FILAS - 1; fila >= 0; fila--) {
        if (tablero[fila][columna] === 0) {
            return fila;
        }
    }
    return -1;
}

function obtenerColumnaValida(columna) {
    var columnaValida = columna;

    // Ajustar la columna si está fuera de los límites del tablero
    if (columnaValida < 0) {
        columnaValida = 0;
    } else if (columnaValida >= COLUMNAS) {
        columnaValida = COLUMNAS - 1;
    }

    return columnaValida;
}

function comprobarGanador(fila, columna) {
    var ficha = tablero[fila][columna];

    // Comprobación horizontal
    var contador = 0;
    for (var c = 0; c < COLUMNAS; c++) {
        if (tablero[fila][c] === ficha) {
            contador++;
            if (contador === 4) {
                return true;
            }
        } else {
            contador = 0;
        }
    }

    // Comprobación vertical
    contador = 0;
    for (var f = 0; f < FILAS; f++) {
        if (tablero[f][columna] === ficha) {
            contador++;
            if (contador === 4) {
                return true;
            }
        } else {
            contador = 0;
        }
    }

    // Comprobación diagonal hacia abajo y a la derecha
    var inicioFila = Math.max(0, fila - 3);
    var inicioColumna = Math.max(0, columna - 3);
    contador = 0;
    for (var i = 0; i < 7; i++) {
        var f = inicioFila + i;
        var c = inicioColumna + i;
        if (f >= FILAS || c >= COLUMNAS) {
            break;
        }
        if (tablero[f][c] === ficha) {
            contador++;
            if (contador === 4) {
                return true;
            }
        } else {
            contador = 0;
        }
    }

    // Comprobación diagonal hacia arriba y a la derecha
    inicioFila = Math.min(FILAS - 1, fila + 3);
    inicioColumna = Math.max(0, columna - 3);
    contador = 0;
    for (var i = 0; i < 7; i++) {
        var f = inicioFila - i;
        var c = inicioColumna + i;
        if (f < 0 || c >= COLUMNAS) {
            break;
        }
        if (tablero[f][c] === ficha) {
            contador++;
            if (contador === 4) {
                return true;
            }
        } else {
            contador = 0;
        }
    }

    return false;
}

function tableroLleno() {
    for (var fila = 0; fila < FILAS; fila++) {
        for (var columna = 0; columna < COLUMNAS; columna++) {
            if (tablero[fila][columna] === 0) {
                return false;
            }
        }
    }
    return true;
}

function reiniciarJuego() {
    crearTablero();
    pintarTablero();
    juegoTerminado = false;
    jugadorActual = 1;
    document.getElementById("mensaje").textContent = "";
}

function aplicarConfiguracion(configuracion) {
    // Aplicar la configuración al juego
    // Ejemplo: Cambiar el color de fondo del canvas
    document.getElementById("canvasJuego").value = configuracion.colorFons;
    document.getElementById("canvasJuego").value = configuracion.idioma;
    document.getElementById("canvasJuego").value = configuracion.colorFitxesJugador1;
    document.getElementById("canvasJuego").value = configuracion.colorFitxesJugador2;
    // Otros cambios de configuración...

    // Volver a pintar el tablero con los cambios aplicados
    pintarTablero();
}

function guardarConfiguracion() {
    // Obtener los valores de configuración del formulario
    var colorFons = document.getElementById("colorFons").value;
    var idioma = document.getElementById("idioma").value;
    var colorFitxesJugador1 = document.getElementById("colorFitxesJugador1").value;
    var colorFitxesJugador2 = document.getElementById("colorFitxesJugador2").value;

    // Otros valores de configuración...

    // Crear un objeto de configuración
    var configuracion = {
        colorFons: colorFons,
        idioma: idioma,
        colorFitxesJugador1: colorFitxesJugador1,
        colorFitxesJugador2: colorFitxesJugador2
        // Otros valores de configuración...
    };

    // Guardar la configuración en el localStorage
    localStorage.setItem("configuracion", JSON.stringify(configuracion));

    // Aplicar los cambios de configuración al juego
    aplicarConfiguracion(configuracion);
}

function cargarConfiguracion() {
    // Obtener la configuración guardada del localStorage
    var configuracionGuardada = localStorage.getItem("configuracion");

    // Si hay una configuración guardada, aplicarla al juego
    if (configuracionGuardada) {
        var configuracion = JSON.parse(configuracionGuardada);
        aplicarConfiguracion(configuracion);
    }
}

crearTablero();
pintarTablero();

var reiniciarBoton = document.getElementById("reiniciarBoton");
if (reiniciarBoton) {
    reiniciarBoton.addEventListener("click", reiniciarJuego);
}

var guardarBoton = document.getElementById("guardarBoton");
if (guardarBoton) {
    guardarBoton.addEventListener("click", guardarConfiguracion);
}

// Cargar la configuración al iniciar el juego
cargarConfiguracion();
