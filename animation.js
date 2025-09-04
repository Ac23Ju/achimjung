// Konstanten in Großbuchstaben als beste Praxis
const CANVAS_SIZE = 600;
const POINT_SPACING = 2;
const FRAME_RATE = 30;
const START_POSITION = 99;
const ANIMATION_SPEED = Math.PI / 60;

// Konfigurationsobjekt für bessere Wartbarkeit
const config = {
    background: 0,
    strokeColor: [255, 96],
    pointCalculation: {
        xDivisor: 8,
        yDivisor: 8,
        offset: 25,
        hypotDivisor: 99,
        timeOffset: 8,
        xMultiplier: 3,
        yMultiplier: 5,
        dMultiplier: 9
    }
};

// Hilfsfunktion für Punkt-Berechnung
const calculateAnimationPoint = (x, y, t) => {
    const { xDivisor, yDivisor, offset, hypotDivisor, timeOffset, xMultiplier, yMultiplier, dMultiplier } = config.pointCalculation;
    
    // Skalierungsfaktor basierend auf der aktuellen Canvas-Größe
    const scale = Math.min(canvas.width, canvas.height) / CANVAS_SIZE;
    const scaledX = x * scale;
    const scaledY = y * scale;
    
    const kx = scaledX / xDivisor - offset;
    const ky = scaledY / yDivisor - offset;
    const d = Math.hypot(kx, ky) ** 2 / hypotDivisor;
    const c = d / 2 - t / timeOffset;
    const q = scaledX / xMultiplier + kx * 0.5 / Math.cos(scaledY * yMultiplier) * Math.sin(d * d - t);
    
    return [
        q * Math.sin(c) + ky * Math.sin(d + kx - t) + canvas.width / 2,
        (q + scaledY / yDivisor + d * dMultiplier) * Math.cos(c) + canvas.height / 2
    ];
};

// Zeit-Variable außerhalb der Draw-Funktion
let time = 0;
let canvas;

function setup() {
    canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('animation-canvas');
    frameRate(FRAME_RATE);
    
    // Event-Listener für Responsiveness
    window.addEventListener('resize', handleResize);
    handleResize();
}

function draw() {
    background(config.background);
    stroke(...config.strokeColor);

    time += ANIMATION_SPEED;
    
    // Punkt-Abstand an die Canvas-Größe anpassen
    const scale = Math.min(canvas.width, canvas.height) / CANVAS_SIZE;
    const adjustedSpacing = POINT_SPACING / scale;
    
    const maxY = canvas.height / (0.8 * adjustedSpacing) + adjustedSpacing;
    const maxX = canvas.width / (0.8 * adjustedSpacing) + adjustedSpacing;
    
    for (let y = START_POSITION; y < maxY; y += adjustedSpacing) {
        for (let x = START_POSITION; x < maxX; x += adjustedSpacing) {
            point(...calculateAnimationPoint(x, y, time));
        }
    }
}

// Verbesserte Resize-Funktion
function handleResize() {
    const container = document.getElementById('animation-canvas');
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    resizeCanvas(width, height, true);
}

// Aufräumen beim Verlassen der Seite
window.addEventListener('unload', () => {
    window.removeEventListener('resize', handleResize);
});