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

// --- APP 1: Temperature Converter ---
function convertTemperature() {
    const inputTemp = parseFloat(document.getElementById("tempInput").value);
    const conversionType = document.getElementById("unitSelect").value;
    const result = document.getElementById("result");

    if (isNaN(inputTemp)) {
        result.textContent = "Please enter a number";
        result.style.color = "#d9534f"; 
        return;
    } else {
        result.style.color = "#1c1c1c"; 
    }

    let outputTemp;
    switch (conversionType) {
        case "CtoF":
            outputTemp = (inputTemp * 9/5) + 32;
            result.textContent = `${inputTemp}°C = ${outputTemp.toFixed(2)}°F`;
            break;
        case "FtoC":
            outputTemp = (inputTemp - 32) * 5/9;
            result.textContent = `${inputTemp}°F = ${outputTemp.toFixed(2)}°C`;
            break;
        case "CtoK":
            outputTemp = inputTemp + 273.15;
            result.textContent = `${inputTemp}°C = ${outputTemp.toFixed(2)} K`;
            break;
        case "KtoC":
            outputTemp = inputTemp - 273.15;
            result.textContent = `${inputTemp} K = ${outputTemp.toFixed(2)}°C`;
            break;
        case "FtoK":
            outputTemp = (inputTemp - 32) * 5/9 + 273.15;
            result.textContent = `${inputTemp}°F = ${outputTemp.toFixed(2)} K`;
            break;
        case "KtoF":
            outputTemp = (inputTemp - 273.15) * 9/5 + 32;
            result.textContent = `${inputTemp} K = ${outputTemp.toFixed(2)}°F`;
            break;
    }
}

// --- APP 2: Moment of Inertia Calculator ---
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

// --- APP 3: Normal Distribution Calculator ---
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

// --- APP 4: Mohr's Circle Calculator ---
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
        `&sigma;<sub>1</sub> = ${sigma1.toFixed(2)} <br>` +
        `&sigma;<sub>2</sub> = ${sigma2.toFixed(2)} <br>` +
        `&tau;<sub>max</sub> = ${tauMax.toFixed(2)}`;
}

// --- APP 5: Truth Table Calculator ---

// Helper to compute single gate result
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
    
    // Build Header
    if (!isUnary) {
        html += '<th>B</th>';
    }
    html += `<th>${gate}</th></tr></thead><tbody>`;
    
    // Permutations
    // For unary: 0, 1
    // For binary: 00, 01, 10, 11
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
    
    // 1. Compute current single result
    const res = computeGate(gate, a, b);
    resultBox.style.color = "#1c1c1c";
    resultBox.textContent = `Output: ${res}`;
    
    // 2. Render Full Truth Table
    renderTruthTable(gate, a, b);
}

// Initialize logic app on load
document.addEventListener("DOMContentLoaded", () => {
    // We can trigger an initial calc/render for the Logic App default values
    // to ensure the table appears immediately.
    calculateLogic(); 
});