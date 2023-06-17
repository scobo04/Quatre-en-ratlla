var mapa = document.getElementById("mapa");

function init() {
    navigator.geolocation.getCurrentPosition(function (posicion) {
        var latitud = posicion.coords.latitude;
        var longitud = posicion.coords.longitude;
        var precision = posicion.coords.accuracy;

        var googleMarcador = google.maps.Marker;
        var googleCirculo = google.maps.Circle;
        var googleInfoPersonalizadaMarcador = google.maps.InfoWindow;

        var colorRojo = "#FF0000";


        var mapaPropiedades = {lat: latitud, lng: longitud};
        var mapa = new google.maps.Map(document.getElementById("mapa"), {
            zoom: 15,
            center: mapaPropiedades,
        });

        var marcador = new googleMarcador({
            position: mapaPropiedades,
            map: mapa,
            acurracy: precision
        });

        var circulo = new googleCirculo({
            center: mapaPropiedades,
            radius: precision,
            map: mapa,
            strokeColor: colorRojo,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colorRojo,
            fillOpacity: 0.35,
        });
        map.fitBounds(circulo.getBounds());

        // añado la información personalizada al marcador
        var informacionMarcador = new googleInfoPersonalizadaMarcador({
            content: "Información personalizada"
        });

        marcador.addEventListener("click", function () {
            informacionMarcador.open(mapa, marcador);
        });

    })
}

init();