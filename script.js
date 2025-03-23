let bluetoothDevice;
let soilDataCharacteristic;

document.getElementById("connectBtn").addEventListener("click", async function() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['12345678-1234-5678-1234-56789abcdef0'] // Replace with Arduino's actual UUID
        });

        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        soilDataCharacteristic = await service.getCharacteristic('abcdef12-3456-7890-abcd-ef1234567890');

        alert("Bluetooth Connected!");
    } catch (error) {
        alert("Failed to connect: " + error);
    }
});

// Read soil data only when "Insert Sensor" button is clicked
document.getElementById("insertSensor").addEventListener("click", async function() {
    if (!soilDataCharacteristic) {
        alert("Please connect to Bluetooth first!");
        return;
    }

    try {
        const value = await soilDataCharacteristic.readValue();
        let decoder = new TextDecoder("utf-8");
        let soilData = decoder.decode(value).split(","); // Expecting data format: "45,22,60"

        document.getElementById("moisture").innerText = soilData[0] + "%";
        document.getElementById("temperature").innerText = soilData[1] + "°C";
        document.getElementById("humidity").innerText = soilData[2] + "%";

        alert("Soil data updated!");
    } catch (error) {
        alert("Error reading soil data: " + error);
    }
});
