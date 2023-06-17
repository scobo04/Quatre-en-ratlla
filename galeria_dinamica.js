var textos=[
    "Mis gafas en el escritorio",
    "Camino a la perdición",
    "Paseando en bicicleta",
    "Vias de el tren"
]


function cargarfoto(img, txt){
    document.getElementById("galeria").src="https://picsum.photos/id/"+img+"/400/400";
    document.getElementById("textoImagenGaleria").innerHTML=textos[txt];
}