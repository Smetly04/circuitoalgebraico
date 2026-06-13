let nivel_actual = 1;
const maxNiveles = 5;

let valoresActuales = { circulo: 0, cuadrado: 0, triangulo: 0 };
let ecuacionesFilas = [0, 0, 0];
let ecuacionesColumnas = [0, 0, 0];

const mensajesExito = [
    "¡CIRCUITO CORRECTO! Estabilizando energía...",
    "¡SISTEMAS ONLINE! Flujos cuánticos nivelados.",
    "¡CALIBRACIÓN EXITOSA! Núcleo al 100%.",
    "¡CONEXIÓN ESTABLE! Reactores listos.",
    "¡PERFECTO! Escudo de energía recargado."
];

const mensajesError = [
    "⚠️ ALERTA: Error de calibración.",
    "⚠️ CRÍTICO: Sobrecarga en los nodos.",
    "⚠️ ERROR: Desfase electromagnético.",
    "⚠️ ADVERTENCIA: Fluctuación de antimateria.",
    "⚠️ FALLO: Datos incompatibles."
];

let mensajeEstado = { texto: "", color: "", visibleHasta: 0 };
const btnSiguiente = document.getElementById('btnSiguiente');
const canvas = document.getElementById('canvasJuego');
const ctx = canvas.getContext('2d');

function generarNuevoCircuito() {
    valoresActuales.circulo = Math.floor(Math.random() * 9) + 1;
    valoresActuales.cuadrado = Math.floor(Math.random() * 9) + 1;
    valoresActuales.triangulo = Math.floor(Math.random() * 9) + 1;

    ecuacionesFilas[0] = valoresActuales.circulo + valoresActuales.cuadrado + valoresActuales.triangulo;
    ecuacionesFilas[1] = valoresActuales.triangulo + valoresActuales.circulo - valoresActuales.cuadrado;
    ecuacionesFilas[2] = valoresActuales.cuadrado - valoresActuales.triangulo + valoresActuales.circulo;

    ecuacionesColumnas[1] = valoresActuales.cuadrado + valoresActuales.circulo - valoresActuales.triangulo;
    ecuacionesColumnas[2] = valoresActuales.triangulo - valoresActuales.cuadrado + valoresActuales.circulo;
}

function comprobarCalibracion() {
    const resCirculo = parseInt(document.getElementById('inputCirculo').value) || 0;
    const resCuadrado = parseInt(document.getElementById('inputCuadrado').value) || 0;
    const resTriangulo = parseInt(document.getElementById('inputTriangulo').value) || 0;

    if (resCirculo === valoresActuales.circulo && 
        resCuadrado === valoresActuales.cuadrado && 
        resTriangulo === valoresActuales.triangulo) {
        
        btnSiguiente.disabled = false;
        mensajeEstado.texto = mensajesExito[Math.floor(Math.random() * mensajesExito.length)];
        mensajeEstado.color = "#00ffcc";
        mensajeEstado.visibleHasta = Date.now() + 3000;
    } else {
        mensajeEstado.texto = mensajesError[Math.floor(Math.random() * mensajesError.length)];
        mensajeEstado.color = "#ff3333";
        mensajeEstado.visibleHasta = Date.now() + 3000;
    }
}

function avanzarNivel() {
    if (nivel_actual < maxNiveles) {
        nivel_actual++;
        const contenedor = document.getElementById('contenedor-juego');
        contenedor.classList.remove('warp-speed');
        void contenedor.offsetWidth; 
        contenedor.classList.add('warp-speed');
        
        document.getElementById('inputCirculo').value = '';
        document.getElementById('inputCuadrado').value = '';
        document.getElementById('inputTriangulo').value = '';
        
        btnSiguiente.disabled = true;
        generarNuevoCircuito();
    } else {
        mensajeEstado.texto = "¡MISIÓN CUMPLIDA! TODOS LOS CIRCUITOS CALIBRADOS";
        mensajeEstado.color = "#FFCC00";
        mensajeEstado.visibleHasta = Date.now() + 5000;
        nivel_actual = 1;
        btnSiguiente.disabled = true;
        generarNuevoCircuito();
    }
}

function dibujarNodo(tipo, x, y, color) {
    ctx.fillStyle = color; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
    if (tipo === 'circulo') { ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else if (tipo === 'cuadrado') { ctx.beginPath(); ctx.roundRect(x - 18, y - 18, 36, 36, 8); ctx.fill(); ctx.stroke(); }
    else if (tipo === 'triangulo') { ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x - 18, y + 16); ctx.lineTo(x + 18, y + 16); ctx.closePath(); ctx.fill(); ctx.stroke(); }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#040507"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 16px sans-serif"; ctx.fillStyle = "#FFCC00"; ctx.textAlign = "center";
    ctx.fillText(`NIVEL ${nivel_actual} / ${maxNiveles}`, canvas.width / 2, 45);
    ctx.font = "bold 26px sans-serif"; ctx.fillStyle = "#00FFCC";
    ctx.fillText("¡CONECTA EL CIRCUITO!", canvas.width / 2, 85);

    if (Date.now() < mensajeEstado.visibleHasta) {
        ctx.font = "bold 14px sans-serif"; ctx.fillStyle = mensajeEstado.color;
        ctx.fillText(mensajeEstado.texto, canvas.width / 2, 125);
    }

    const inicioX = 240, inicioY = 175, espacioX = 140, espacioY = 110;
    const matriz = [['circulo', 'cuadrado', 'triangulo'], ['triangulo', 'circulo', 'cuadrado'], ['cuadrado', 'triangulo', 'circulo']];
    const colores = { circulo: '#2ecc71', cuadrado: '#3498db', triangulo: '#e74c3c' };

    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            let cx = inicioX + (c * espacioX), cy = inicioY + (f * espacioY);
            dibujarNodo(matriz[f][c], cx, cy, colores[matriz[f][c]]);
            ctx.fillStyle = "#2ecc71";
            if (c < 2) { ctx.fillText((f === 1 && c === 1) || (f === 2 && c === 0) ? "-" : "+", cx + (espacioX / 2), cy + 6); }
            if (f < 2 && c > 0) { ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; ctx.fillText("+", cx, cy + (espacioY / 2) + 6); }
        }
        ctx.font = "bold 22px sans-serif"; ctx.fillStyle = "#00FFCC";
        ctx.fillText(`= ${ecuacionesFilas[f]}`, inicioX + (2 * espacioX) + 60, inicioY + (f * espacioY) + 8);
    }

    ctx.font = "bold 16px sans-serif"; ctx.fillStyle = "#FFCC00";
    ctx.fillText(`[${ecuacionesColumnas[1]}]`, inicioX + espacioX, inicioY + (2 * espacioY) + 55);
    ctx.fillText(`[${ecuacionesColumnas[2]}]`, inicioX + (2 * espacioX), inicioY + (2 * espacioY) + 55);
}

function loop() { dibujar(); requestAnimationFrame(loop); }
generarNuevoCircuito();
requestAnimationFrame(loop);