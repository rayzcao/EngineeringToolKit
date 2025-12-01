// --- APP 1: Temperature Converter ---
function convertTemperature() {
    const inputTemp = parseFloat(document.getElementById("tempInput").value);
    const conversionType = document.getElementById("unitSelect").value;
    const result = document.getElementById("result");

    if (isNaN(inputTemp)) {
        result.textContent = "Please enter a valid number.";
        result.style.color = "#d9534f"; 
        return;
    } else {
        result.style.color = "#333333"; 
    }

    let outputTemp;

    switch (conversionType) {
        case "CtoF":
            outputTemp = (inputTemp * 9/5) + 32;
            result.textContent = `${inputTemp} °C = ${outputTemp.toFixed(2)} °F`;
            break;
        case "FtoC":
            outputTemp = (inputTemp - 32) * 5/9;
            result.textContent = `${inputTemp} °F = ${outputTemp.toFixed(2)} °C`;
            break;
        case "CtoK":
            outputTemp = inputTemp + 273.15;
            result.textContent = `${inputTemp} °C = ${outputTemp.toFixed(2)} K`;
            break;
        case "KtoC":
            outputTemp = inputTemp - 273.15;
            result.textContent = `${inputTemp} K = ${outputTemp.toFixed(2)} °C`;
            break;
        case "FtoK":
            outputTemp = (inputTemp - 32) * 5/9 + 273.15;
            result.textContent = `${inputTemp} °F = ${outputTemp.toFixed(2)} K`;
            break;
        case "KtoF":
            outputTemp = (inputTemp - 273.15) * 9/5 + 32;
            result.textContent = `${inputTemp} K = ${outputTemp.toFixed(2)} °F`;
            break;
        default:
            result.textContent = "Invalid conversion type.";
    }
}

// --- APP 2: Moment of Inertia Calculator ---

function updateInertiaInputs() {
    const shape = document.getElementById("shapeSelect").value;
    
    // Get all dynamic input groups
    const radiusGroup = document.getElementById("radiusGroup");
    const lengthGroup = document.getElementById("lengthGroup");
    const widthGroup = document.getElementById("widthGroup");
    const heightGroup = document.getElementById("heightGroup");

    // Reset all to hidden first
    radiusGroup.classList.add("hidden");
    lengthGroup.classList.add("hidden");
    widthGroup.classList.add("hidden");
    heightGroup.classList.add("hidden");

    // Show specific inputs based on shape
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
    
    // Validate Mass
    if (isNaN(mass) || mass <= 0) {
        resultBox.textContent = "Please enter a valid positive mass.";
        resultBox.style.color = "#d9534f";
        return;
    }

    let I = 0;
    let r, L, w, h;

    // Calculate based on shape
    // Note: Formulas are standard geometric moments of inertia about the Center of Mass
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

        resultBox.style.color = "#333333";
        // Convert to scientific notation if result is very large or small
        if (I > 1000 || I < 0.01) {
             resultBox.textContent = `I = ${I.toExponential(4)} kg·m²`;
        } else {
             resultBox.textContent = `I = ${I.toFixed(4)} kg·m²`;
        }
       
    } catch (e) {
        resultBox.textContent = "Please check all dimensions.";
        resultBox.style.color = "#d9534f";
    }
}