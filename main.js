const startButton = document.getElementById("start");
const canvas = document.getElementById("xr-canvas");
const frameElem = document.getElementById("frames");
const hitElem = document.getElementById("hits");
const rateElem = document.getElementById("successRate");

startButton.addEventListener("click", () => {
    startButton.disabled = true;
    startButton.textContent = "Starting AR...";

    if (!navigator.xr) {
        alert("WebXR not supported on this device");
        return;
    }

    // requestSession вызываем сразу в обработчике клика
    navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body }
    }).then(async session => {

        const gl = canvas.getContext("webgl", { xrCompatible: true });
        await gl.makeXRCompatible();
        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

        const refSpace = await session.requestReferenceSpace("local");
        const viewerSpace = await session.requestReferenceSpace("viewer");
        const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

        let frames = 0;
        let hits = 0;

        function onFrame(time, frame) {
            session.requestAnimationFrame(onFrame);

            const hitResults = frame.getHitTestResults(hitTestSource);
            frames++;
            if (hitResults.length > 0) {
                hits++;
                gl.clearColor(0, 1, 0, 1); // зелёный при hit
            } else {
                gl.clearColor(0.2, 0.2, 0.2, 1); // серый иначе
            }
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            frameElem.textContent = frames;
            hitElem.textContent = hits;
            rateElem.textContent = ((hits / frames) * 100).toFixed(2) + "%";
        }

        session.requestAnimationFrame(onFrame);

    }).catch(err => {
        console.error("XR session failed:", err);
        alert("WebXR Init Error:\n" + err.message);
        startButton.disabled = false;
        startButton.textContent = "Start Benchmark";
    });
});
