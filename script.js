document.addEventListener("DOMContentLoaded", function() {
    let bluetoothDevice;
    let gattServer;
    let txCharacteristic;

    const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb"; // Correct BLE UUID
    const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

    async function connectBluetooth() {
        try {
            bluetoothDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [SERVICE_UUID]
            });

            gattServer = await bluetoothDevice.gatt.connect();
            const service = await gattServer.getPrimaryService(SERVICE_UUID);
            txCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

            alert("Bluetooth Connected!");
        } catch (error) {
            alert("Failed to connect: " + error.message);
        }
    }

    function sendBluetoothCommand(command) {
        if (!txCharacteristic) {
            alert("Bluetooth not connected!");
            return;
        }
        const commandBuffer = new TextEncoder().encode(command);
        txCharacteristic.writeValue(commandBuffer).catch(error => {
            console.error("Error sending command:", error);
        });
    }

    function handleButtonPress(command, element) {
        sendBluetoothCommand(command);
        element.classList.add("active");
    }

    function handleButtonRelease(element) {
        element.classList.remove("active");
    }

    // Attach event listeners after DOM is loaded
    document.getElementById("connect-btn").addEventListener("click", connectBluetooth);
    document.getElementById("forward-btn").addEventListener("mousedown", function() {
        handleButtonPress("F", this);
    });
    document.getElementById("forward-btn").addEventListener("mouseup", function() {
        handleButtonRelease(this);
    });
    document.getElementById("backward-btn").addEventListener("mousedown", function() {
        handleButtonPress("B", this);
    });
    document.getElementById("backward-btn").addEventListener("mouseup", function() {
        handleButtonRelease(this);
    });
    document.getElementById("left-btn").addEventListener("mousedown", function() {
        handleButtonPress("L", this);
    });
    document.getElementById("left-btn").addEventListener("mouseup", function() {
        handleButtonRelease(this);
    });
    document.getElementById("right-btn").addEventListener("mousedown", function() {
        handleButtonPress("R", this);
    });
    document.getElementById("right-btn").addEventListener("mouseup", function() {
        handleButtonRelease(this);
    });

    document.getElementById("sense-soil-btn").addEventListener("click", function() {
        sendBluetoothCommand("S");
        this.classList.add("active");
        setTimeout(() => this.classList.remove("active"), 500);
    });
});
