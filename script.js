console.log("script.js berhasil dimuat");

const URL = "./model/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    try {
        console.log("Memulai...");

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        maxPredictions = model.getTotalClasses();

        webcam = new tmImage.Webcam(300, 300, true);

        await webcam.setup();
        await webcam.play();

        window.requestAnimationFrame(loop);

        document
            .getElementById("webcam-container")
            .appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");

        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        console.log("Camera berhasil dijalankan");
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan: " + err.message);
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className +
            " : " +
            prediction[i].probability.toFixed(2);
    }
}