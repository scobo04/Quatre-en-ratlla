var canvas = document.getElementById("canvasJuego");
var ctx = canvas.getContext("2d");

var TAMANO_CASILLA = 70;
var FILAS = 6;
var COLUMNAS = 7;

var tablero = [];
var jugadorActual = 1;
var juegoTerminado = false;
var configuracion;


canvas.addEventListener("click", manejarClick);

function crearTablero() {
    for (var fila = 0; fila < FILAS; fila++) {
        tablero[fila] = new Array(COLUMNAS).fill(0);
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

            var ficha = tablero[fila][columna];

            var fichasJugador1 = configuracion.colorFitxesJugador1;
            var fichasJugador2 = configuracion.colorFitxesJugador2;
            if (ficha === 1) {
                ctx.fillStyle = fichasJugador1;
                ctx.fill();
            } else if (ficha === 2) {
                ctx.fillStyle = fichasJugador2;
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

    if (comprobarCuatroEnRaya(fila, columna)) {
        juegoTerminado = true;
        document.getElementById("mensaje").textContent = `Ha ganado el jugador ${jugadorActual}`;
    } else if (tableroLleno()) {
        juegoTerminado = true;
        document.getElementById("mensaje").textContent = "¡Empate!";
    }

    jugadorActual = jugadorActual === 1 ? 2 : 1;

    pintarTablero();
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


function comprobarCuatroEnRaya() {
    // Comprobar horizontalmente
    for (var fila = 0; fila < FILAS; fila++) {
        for (var columna = 0; columna < COLUMNAS - 3; columna++) {
            if (
                tablero[fila][columna] !== 0 &&
                tablero[fila][columna] === tablero[fila][columna + 1] &&
                tablero[fila][columna] === tablero[fila][columna + 2] &&
                tablero[fila][columna] === tablero[fila][columna + 3]
            ) {
                return true;
            }
        }
    }

    // Comprobar verticalmente
    for (var columna = 0; columna < COLUMNAS; columna++) {
        for (var fila = 0; fila < FILAS - 3; fila++) {
            if (
                tablero[fila][columna] !== 0 &&
                tablero[fila][columna] === tablero[fila + 1][columna] &&
                tablero[fila][columna] === tablero[fila + 2][columna] &&
                tablero[fila][columna] === tablero[fila + 3][columna]
            ) {
                return true;
            }
        }
    }

    // Comprobar diagonales hacia abajo y a la derecha
    for (var fila = 0; fila < FILAS - 3; fila++) {
        for (var columna = 0; columna < COLUMNAS - 3; columna++) {
            if (
                tablero[fila][columna] !== 0 &&
                tablero[fila][columna] === tablero[fila + 1][columna + 1] &&
                tablero[fila][columna] === tablero[fila + 2][columna + 2] &&
                tablero[fila][columna] === tablero[fila + 3][columna + 3]
            ) {
                return true;
            }
        }
    }

    // Comprobar diagonales hacia arriba y a la derecha
    for (var fila = 3; fila < FILAS; fila++) {
        for (var columna = 0; columna < COLUMNAS - 3; columna++) {
            if (
                tablero[fila][columna] !== 0 &&
                tablero[fila][columna] === tablero[fila - 1][columna + 1] &&
                tablero[fila][columna] === tablero[fila - 2][columna + 2] &&
                tablero[fila][columna] === tablero[fila - 3][columna + 3]
            ) {
                return true;
            }
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

var reiniciarBoton = document.getElementById("reiniciarBoton");
reiniciarBoton.addEventListener("click", function() {
    // Lógica para reiniciar el juego
    reiniciarJuego();
});




function obtenerConfiguracion() {
    if (localStorage.getItem("configuracion")) {
        configuracion = JSON.parse(localStorage.getItem("configuracion"));
        // Verificar si los valores almacenados son válidos y asignar colores predeterminados si no lo son
        if (!configuracion.colorFitxesJugador1 || typeof configuracion.colorFitxesJugador1 !== "string") {
            configuracion.colorFitxesJugador1 = "red"; // Asignar un color predeterminado válido
        }
        if (!configuracion.colorFitxesJugador2 || typeof configuracion.colorFitxesJugador2 !== "string") {
            configuracion.colorFitxesJugador2 = "yellow"; // Asignar un color predeterminado válido
        }
    } else {
        configuracion = {
            colorFitxesJugador1: "red",
            colorFitxesJugador2: "yellow"
        };
        localStorage.setItem("configuracion", JSON.stringify(configuracion));
    }
}

obtenerConfiguracion();

crearTablero();
pintarTablero();
