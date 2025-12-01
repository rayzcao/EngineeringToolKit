function convertTemperature() {
    const inputTemp = parseFloat(document.getElementById("tempInput").value);
    const conversionType = document.getElementById("unitSelect").value;
    const result = document.getElementById("result");

    if (isNaN(inputTemp)) {
        result.textContent = "❌ Please enter a valid number.";
        return;
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

        default:
            result.textContent = "❌ Invalid conversion type.";
    }
}
