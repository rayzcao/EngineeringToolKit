// --- Navigation Helper ---
function scrollToApp(id, navButton) {
    const element = document.getElementById(id);
    
    // 1. Scroll Logic
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Visual bounce effect
        element.style.transform = "scale(1.02)";
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 300);
    }

    // 2. Update Active Tab State
    if (navButton) {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        navButton.classList.add('active');
    }
}

// --- APP 1: Inertia (Formerly App 2) ---
function updateInertiaInputs() {
    const shape = document.getElementById("shapeSelect").value;
    const radiusGroup = document.getElementById("radiusGroup");
    const lengthGroup = document.getElementById("lengthGroup");
    const widthGroup = document.getElementById("widthGroup");
    const heightGroup = document.getElementById("heightGroup");

    radiusGroup.classList.add("hidden");
    lengthGroup.classList.add("hidden");
    widthGroup.classList.add("hidden");
    heightGroup.classList.add("hidden");

    if (shape === "solidSphere" || shape === "hollowSphere" || shape === "solidCylinder") {
        radiusGroup.classList.remove("hidden");
    } else if (shape === "rodCenter") {
        lengthGroup.classList.remove("hidden");
    } else if (shape === "rectPlate") {
        widthGroup.classList.remove("hidden");
        heightGroup.classList.remove("hidden");
    }
}

function calculateInertia() {
    const shape = document.getElementById("shapeSelect").value;
    const mass = parseFloat(document.getElementById("massInput").value);
    const resultBox = document.getElementById("inertiaResult");
    
    if (isNaN(mass) || mass <= 0) {
        resultBox.textContent = "Enter positive mass";
        resultBox.style.color = "#d9534f";
        return;
    }

    let I = 0;
    let r, L, w, h;

    try {
        switch (shape) {
            case "solidSphere":
                r = parseFloat(document.getElementById("radiusInput").value);
                if (isNaN(r)) throw "Invalid Radius";
                I = (2/5) * mass * Math.pow(r, 2);
                break;
            case "hollowSphere":
                r = parseFloat(document.getElementById("radiusInput").value);
                if (isNaN(r)) throw "Invalid Radius";
                I = (2/3) * mass * Math.pow(r, 2);
                break;
            case "solidCylinder":
                r = parseFloat(document.getElementById("radiusInput").value);
                if (isNaN(r)) throw "Invalid Radius";
                I = 0.5 * mass * Math.pow(r, 2);
                break;
            case "rodCenter":
                L = parseFloat(document.getElementById("lengthInput").value);
                if (isNaN(L)) throw "Invalid Length";
                I = (1/12) * mass * Math.pow(L, 2);
                break;
            case "rectPlate":
                w = parseFloat(document.getElementById("widthInput").value);
                h = parseFloat(document.getElementById("heightInput").value);
                if (isNaN(w) || isNaN(h)) throw "Invalid Dimensions";
                I = (1/12) * mass * (Math.pow(h, 2) + Math.pow(w, 2));
                break;
        }

        resultBox.style.color = "#1c1c1c";
        if (I > 1000 || I < 0.01) {
             resultBox.textContent = `I = ${I.toExponential(4)} kg·m²`;
        } else {
             resultBox.textContent = `I = ${I.toFixed(4)} kg·m²`;
        }
    } catch (e) {
        resultBox.textContent = "Check dimensions";
        resultBox.style.color = "#d9534f";
    }
}

// --- APP 2: Normal Distribution Calculator ---
function calculateProbability() {
    const mean = parseFloat(document.getElementById("meanInput").value);
    const std = parseFloat(document.getElementById("stdInput").value);
    const x = parseFloat(document.getElementById("xInput").value);
    const resultBox = document.getElementById("probResult");

    if (isNaN(mean) || isNaN(std) || isNaN(x)) {
        resultBox.textContent = "Please check inputs";
        resultBox.style.color = "#d9534f";
        return;
    }

    if (std <= 0) {
        resultBox.textContent = "Std Dev must be > 0";
        resultBox.style.color = "#d9534f";
        return;
    }

    const variance = std * std;
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * exponent;

    const z = (x - mean) / std;
    
    function getStandardCDF(z) {
        if (z < -6) return 0;
        if (z > 6) return 1;

        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989422804014337 * Math.exp(-z * z / 2);
        const prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        
        return z >= 0 ? 1 - prob : prob;
    }

    const cdf = getStandardCDF(z);

    resultBox.style.color = "#1c1c1c";
    resultBox.innerHTML = `PDF: ${pdf.toFixed(4)} <br> CDF: ${cdf.toFixed(4)}`;
}

// --- APP 3: Mohr's Circle Calculator ---
function calculateMohrsCircle() {
    const sx = parseFloat(document.getElementById("sigmaX").value);
    const sy = parseFloat(document.getElementById("sigmaY").value);
    const txy = parseFloat(document.getElementById("tauXY").value);
    const resultBox = document.getElementById("mohrResult");

    if (isNaN(sx) || isNaN(sy) || isNaN(txy)) {
        resultBox.textContent = "Enter stress values";
        resultBox.style.color = "#d9534f";
        return;
    }

    const sigmaAvg = (sx + sy) / 2;
    const R = Math.sqrt(Math.pow((sx - sy) / 2, 2) + Math.pow(txy, 2));

    const sigma1 = sigmaAvg + R;
    const sigma2 = sigmaAvg - R;
    const tauMax = R;

    resultBox.style.color = "#1c1c1c";
    resultBox.innerHTML = 
        `σ<sub>1</sub> = ${sigma1.toFixed(2)} <br>` +
        `σ<sub>2</sub> = ${sigma2.toFixed(2)} <br>` +
        `τ<sub>max</sub> = ${tauMax.toFixed(2)}`;
}

// --- APP 4: Truth Table Calculator ---

function computeGate(gate, a, b) {
    switch(gate) {
        case "AND": return (a && b) ? 1 : 0;
        case "OR": return (a || b) ? 1 : 0;
        case "XOR": return (a !== b) ? 1 : 0;
        case "NAND": return !(a && b) ? 1 : 0;
        case "NOR": return !(a || b) ? 1 : 0;
        case "XNOR": return (a === b) ? 1 : 0;
        case "NOT": return (!a) ? 1 : 0;
        default: return 0;
    }
}

function updateLogicInputs() {
    const gate = document.getElementById("gateSelect").value;
    const groupB = document.getElementById("inputBGroup");
    
    // Hide Input B if NOT gate is selected (Unary operator)
    if (gate === "NOT") {
        groupB.classList.add("hidden");
    } else {
        groupB.classList.remove("hidden");
    }
    
    // Recalculate to update the table immediately
    calculateLogic();
}

function renderTruthTable(gate, activeA, activeB) {
    const container = document.getElementById("tableContainer");
    let html = '<table class="shack-table"><thead><tr><th>A</th>';
    
    const isUnary = (gate === "NOT");
    
    if (!isUnary) {
        html += '<th>B</th>';
    }
    html += `<th>${gate}</th></tr></thead><tbody>`;
    
    const combinations = isUnary ? [[0], [1]] : [[0,0], [0,1], [1,0], [1,1]];
    
    combinations.forEach(combo => {
        const a = combo[0];
        const b = isUnary ? null : combo[1];
        const res = computeGate(gate, a, b);
        
        // Check if this row matches user selection
        let isActive = false;
        if (isUnary) {
            if (a === activeA) isActive = true;
        } else {
            if (a === activeA && b === activeB) isActive = true;
        }
        
        const rowClass = isActive ? 'class="active-row"' : '';
        
        html += `<tr ${rowClass}><td>${a}</td>`;
        if (!isUnary) {
            html += `<td>${b}</td>`;
        }
        html += `<td><strong>${res}</strong></td></tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function calculateLogic() {
    const gate = document.getElementById("gateSelect").value;
    const a = parseInt(document.getElementById("inputA").value);
    const b = parseInt(document.getElementById("inputB").value);
    const resultBox = document.getElementById("logicResult");
    
    const res = computeGate(gate, a, b);
    resultBox.style.color = "#1c1c1c";
    resultBox.textContent = `Output: ${res}`;
    
    renderTruthTable(gate, a, b);
}

// --- APP 5: Number System Converter ---
function convertNumberSystem() {
    const numInput = document.getElementById("numInput").value.trim();
    const fromBase = parseInt(document.getElementById("fromBase").value);
    const toBase = parseInt(document.getElementById("toBase").value);
    const resultBox = document.getElementById("numResult");

    if (numInput === "") {
        resultBox.textContent = "Enter a value";
        resultBox.style.color = "#d9534f";
        return;
    }

    let isValid = false;
    switch(fromBase) {
        case 2: isValid = /^[01]+$/.test(numInput); break;
        case 8: isValid = /^[0-7]+$/.test(numInput); break;
        case 10: isValid = /^[0-9]+$/.test(numInput); break;
        case 16: isValid = /^[0-9A-Fa-f]+$/.test(numInput); break;
    }

    if (!isValid) {
        resultBox.textContent = `Invalid base-${fromBase} input`;
        resultBox.style.color = "#d9534f";
        return;
    }

    const decimalValue = parseInt(numInput, fromBase);
    const resultValue = decimalValue.toString(toBase).toUpperCase();

    resultBox.style.color = "#1c1c1c";
    resultBox.textContent = `${resultValue}`;
}

// --- APP 6: Computer Vision (Image Convolution) ---
let originalImageData = null; 

function loadImage() {
    const fileInput = document.getElementById('imageUpload');
    const canvas = document.getElementById('visionCanvas');
    const ctx = canvas.getContext('2d');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const maxWidth = canvas.parentElement.clientWidth; 
                const scale = maxWidth / img.width;
                const h = img.height * scale;
                
                canvas.width = maxWidth;
                canvas.height = h;
                
                ctx.drawImage(img, 0, 0, maxWidth, h);
                originalImageData = ctx.getImageData(0, 0, maxWidth, h);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function applyKernel() {
    const filterType = document.getElementById('kernelSelect').value;
    const canvas = document.getElementById('visionCanvas');
    const ctx = canvas.getContext('2d');

    if (!originalImageData) {
        alert("Please upload an image first.");
        return;
    }

    ctx.putImageData(originalImageData, 0, 0);
    
    if (filterType === 'identity') return;

    const width = canvas.width;
    const height = canvas.height;
    const src = ctx.getImageData(0, 0, width, height);
    const dst = ctx.createImageData(width, height);
    
    let kernel = [];
    let weight = 1; 

    if (filterType === 'edge') {
        kernel = [ -1, -1, -1,
                   -1,  8, -1,
                   -1, -1, -1 ];
    } else if (filterType === 'sharpen') {
        kernel = [  0, -1,  0,
                   -1,  5, -1,
                    0, -1,  0 ];
    } else if (filterType === 'blur') {
        kernel = [ 1, 1, 1,
                   1, 1, 1,
                   1, 1, 1 ];
        weight = 9;
    } else if (filterType === 'emboss') {
        kernel = [ -2, -1,  0,
                   -1,  1,  1,
                    0,  1,  2 ];
    }

    const side = Math.round(Math.sqrt(kernel.length));
    const halfSide = Math.floor(side / 2);
    const srcData = src.data;
    const dstData = dst.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = 0; ky < side; ky++) {
                for (let kx = 0; kx < side; kx++) {
                    const cy = y + ky - halfSide;
                    const cx = x + kx - halfSide;

                    if (cy >= 0 && cy < height && cx >= 0 && cx < width) {
                        const srcOffset = (cy * width + cx) * 4;
                        const kWeight = kernel[ky * side + kx];

                        r += srcData[srcOffset] * kWeight;
                        g += srcData[srcOffset + 1] * kWeight;
                        b += srcData[srcOffset + 2] * kWeight;
                    }
                }
            }

            const dstOffset = (y * width + x) * 4;
            dstData[dstOffset] = r / weight;
            dstData[dstOffset + 1] = g / weight;
            dstData[dstOffset + 2] = b / weight;
            dstData[dstOffset + 3] = 255; 
        }
    }
    
    ctx.putImageData(dst, 0, 0);
}

// --- APP 7: ML Metrics Calculator ---
function calculateMLEvaluation() {
    const tp = parseFloat(document.getElementById("tpInput").value);
    const fp = parseFloat(document.getElementById("fpInput").value);
    const tn = parseFloat(document.getElementById("tnInput").value);
    const fn = parseFloat(document.getElementById("fnInput").value);
    const resultBox = document.getElementById("mlResult");

    if (isNaN(tp) || isNaN(fp) || isNaN(tn) || isNaN(fn)) {
        resultBox.textContent = "Please enter all fields";
        resultBox.style.color = "#d9534f";
        return;
    }

    const total = tp + fp + tn + fn;
    if (total === 0) {
        resultBox.textContent = "Total samples cannot be 0";
        return;
    }

    const accuracy = (tp + tn) / total;
    const precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
    const recall = (tp + fn) === 0 ? 0 : tp / (tp + fn);
    const f1 = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);

    resultBox.style.color = "#1c1c1c";
    resultBox.innerHTML = 
        `Acc: ${(accuracy * 100).toFixed(1)}% | F1: ${f1.toFixed(3)}<br>` +
        `Prec: ${precision.toFixed(3)} | Rec: ${recall.toFixed(3)}`;
}

// --- APP 8: PID Controller Simulation ---
function runPIDSimulation() {
    const kp = parseFloat(document.getElementById("kpInput").value);
    const ki = parseFloat(document.getElementById("kiInput").value);
    const kd = parseFloat(document.getElementById("kdInput").value);
    const canvas = document.getElementById("pidCanvas");
    const ctx = canvas.getContext("2d");

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ensure canvas size
    const width = canvas.parentElement.clientWidth;
    canvas.width = width;
    canvas.height = 200;

    // Simulation Parameters
    const setpoint = 150; // Target Y value (visual height)
    let output = 0;       // Current system value
    let integral = 0;
    let prevError = 0;
    
    // Physics variables (Simple inertia system)
    let velocity = 0;
    const dt = 0.1;

    // Draw Setpoint Line (Green)
    ctx.beginPath();
    ctx.strokeStyle = "#28a745";
    ctx.lineWidth = 2;
    // Note: Canvas coordinates 0,0 is top-left. We map setpoint to height-setpoint for visual "up"
    const targetY = canvas.height - setpoint;
    ctx.moveTo(0, targetY);
    ctx.lineTo(width, targetY);
    ctx.stroke();

    // Simulation Loop
    ctx.beginPath();
    ctx.strokeStyle = "#d9534f"; // Red line for Process
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height); // Start at bottom

    for (let t = 0; t < width; t++) {
        // 1. Calculate Error
        const error = setpoint - output;

        // 2. PID Terms
        integral += error * dt;
        const derivative = (error - prevError) / dt;

        // 3. Control Output (Force applied to system)
        const controlSignal = (kp * error) + (ki * integral) + (kd * derivative);

        // 4. Apply Physics (Simple Mass-Spring-Damper approx)
        const damping = 0.5;
        const acceleration = controlSignal - (damping * velocity);
        
        velocity += acceleration * dt;
        output += velocity * dt;

        prevError = error;

        // 5. Draw
        const plotY = canvas.height - output;
        ctx.lineTo(t, plotY);
    }
    ctx.stroke();
}

// --- APP 9: Robot Kinematics (Forward) ---
function updateRobotArm() {
    const l1 = parseFloat(document.getElementById("l1Input").value);
    const l2 = parseFloat(document.getElementById("l2Input").value);
    const theta1Deg = parseFloat(document.getElementById("theta1Input").value);
    const theta2Deg = parseFloat(document.getElementById("theta2Input").value);
    const resultBox = document.getElementById("robotResult");
    
    const canvas = document.getElementById("robotCanvas");
    const ctx = canvas.getContext("2d");
    
    // Setup Canvas
    const width = canvas.parentElement.clientWidth;
    canvas.width = width;
    canvas.height = 250;
    const centerX = width / 2;
    const centerY = canvas.height - 30; // Base near bottom
    
    // Clear
    ctx.clearRect(0, 0, width, canvas.height);
    
    // Convert to Radians
    // Note: Canvas Y is inverted (positive down), so we multiply sine terms by -1 for visual "up"
    const t1 = theta1Deg * (Math.PI / 180);
    const t2 = theta2Deg * (Math.PI / 180);
    
    // Calculate Joint 1 (End of Link 1)
    // Scale factor to fit visual
    const scale = 1.0; 
    
    const x1 = centerX + (l1 * scale * Math.cos(t1));
    const y1 = centerY - (l1 * scale * Math.sin(t1));
    
    // Calculate Joint 2 (End of Link 2 / End Effector)
    const x2 = x1 + (l2 * scale * Math.cos(t1 + t2));
    const y2 = y1 - (l2 * scale * Math.sin(t1 + t2));
    
    // Draw Base
    ctx.fillStyle = "#333";
    ctx.fillRect(centerX - 10, centerY, 20, 10);
    
    // Draw Link 1
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#0056b3"; // Blue
    ctx.lineCap = "round";
    ctx.stroke();
    
    // Draw Link 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#28a745"; // Green
    ctx.stroke();
    
    // Draw Joints
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke(); // Base Joint
    
    ctx.beginPath();
    ctx.arc(x1, y1, 5, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke(); // Elbow
    
    ctx.fillStyle = "#d9534f"; // Red End Effector
    ctx.beginPath();
    ctx.arc(x2, y2, 6, 0, 2*Math.PI);
    ctx.fill();
    
    // Output Coordinates (relative to base)
    const finalX = x2 - centerX;
    const finalY = centerY - y2;
    
    resultBox.style.color = "#1c1c1c";
    resultBox.textContent = `EE Pos: (${finalX.toFixed(1)}, ${finalY.toFixed(1)})`;
}

// Initialize apps on load
document.addEventListener("DOMContentLoaded", () => {
    calculateLogic(); 
    updateRobotArm(); // Draw initial robot state
});