'use strict';

const conceptos = [
    { nombre: "Alquiler", precio: 650 },
    { nombre: "Luz", precio: 55 },
    { nombre: "Agua", precio: 15 },
    { nombre: "Gas", precio: 30 },
    { nombre: "Basura y comunidad", precio: 15 },
    { nombre: "Seguros del hogar", precio: 50 },
    { nombre: "Internet", precio: 25 },
    { nombre: "Cesta de la compra", precio: 100 },
    { nombre: "Transporte", precio: 25 },
    { nombre: "Ocio", precio: 50 }
];

let pagos = [];
let dineroGastado = 0;


function registrarPago(indice) {
    if (isNaN(indice) || indice < 0 || indice >= conceptos.length) {
        throw new Error("Índice de concepto no válido: " + indice);
    }

    pagos.push(indice);
    dineroGastado += conceptos[indice].precio;
}

function limpiarResumen() {
    const seccion = document.getElementById('resumen');
    if (!seccion) return;

    Array.from(seccion.children)
        .filter(elemento => elemento.tagName !== 'H2')
        .forEach(elemento => elemento.remove());
}

function reiniciarTramite() {
    pagos = [];
    dineroGastado = 0;
}

function contarPagosPorConcepto() {
    const conteo = [];
    for (let i = 0; i < conceptos.length; i++) {
        conteo[i] = 0;
    }
    for (let i = 0; i < pagos.length; i++) {
        conteo[pagos[i]]++;
    }
    return conteo;
}

function ordenarFilasResumen(conteo) {
    const filas = [];
    for (let i = 0; i < conceptos.length; i++) {
        if (conteo[i] > 0) {
            filas.push({ nombre: conceptos[i].nombre, cantidad: conteo[i] });
        }
    }

    filas.sort(function (fila1, fila2) {
        if (fila1.cantidad < fila2.cantidad) {
            return 1;
        }
        if (fila1.cantidad > fila2.cantidad) {
            return -1;
        }
        if (fila1.nombre > fila2.nombre) {
            return 1;
        }
        if (fila1.nombre < fila2.nombre) {
            return -1;
        }
        return 0;
    });

    return filas;
}

function mostrarResumen() {
    const seccion = document.getElementById('resumen');
    if (!seccion) return;

    limpiarResumen();

    if (pagos.length === 0) {
        const aviso = document.createElement('p');
        aviso.className = 'aviso';
        aviso.textContent = 'No se ha registrado ningún pago';
        seccion.appendChild(aviso);
        return;
    }

    const filas = ordenarFilasResumen(contarPagosPorConcepto());

    filas.forEach(fila => {
        const linea = document.createElement('p');
        linea.textContent = fila.nombre + " ---- " + fila.cantidad +
            (fila.cantidad === 1 ? " pago" : " pagos");
        seccion.appendChild(linea);
    });

    const separador = document.createElement('p');
    separador.textContent = '----';
    seccion.appendChild(separador);

    const gastoFinal = document.createElement('p');
    gastoFinal.className = 'destacado';
    gastoFinal.textContent = 'Gasto final: ' + dineroGastado.toFixed(2) + ' €';
    seccion.appendChild(gastoFinal);

    const mediaGasto = document.createElement('p');
    mediaGasto.className = 'destacado';
    mediaGasto.textContent = 'Gasto medio: ' +
        (dineroGastado / pagos.length).toFixed(2) + ' €/concepto';
    seccion.appendChild(mediaGasto);

    reiniciarTramite();
}

function inicializar() {
    const tarjetas = Array.from(document.querySelectorAll('.concepto'));

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            limpiarResumen();

            const indice = tarjetas.indexOf(tarjeta);
            try {
                registrarPago(indice);
            } catch (error) {
                console.log(error.message);
            }
        });
    });

    const boton = document.getElementById('finalizar');
    if (boton) {
        boton.addEventListener('click', mostrarResumen);
    }
}

document.addEventListener('DOMContentLoaded', inicializar);
