import { createXRSession } from "./xr/session.js";
import { setupHitTest } from "./xr/hitTest.js";
import { Metrics } from "./utils/metrics.js";
import { exportCSV } from "./utils/csv-export.js";
import { detectDevice } from "./utils/deviceDetection.js";
import { StatsLogger } from "./utils/statsLogger.js";

const startButton = document.getElementById("start");
const frameElem = document.getElementById("frames");
const hitElem = document.getElementById("hits");
const rateElem = document.getElementById("successRate");

let metrics;
let stats;
let sessionRunning = false;

startButton.addEventListener("click", () => {
    startButton.disabled = true;
    startButton.textContent = "Starting AR...";

    // Запуск XR session строго внутри синхронного обработчика
    navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body }
    }).then(async (session) => {
        const canvas = document.getElementById("xr-canvas");
        const gl = canvas.getContext("webgl", { xrCompatible: true });
        await gl.makeXRCompatible();
        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

        const refSpace = await session.requestReferenceSpace("local");

        const viewerSpace = await session.requestReferenceSpace("viewer");
        const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

        function onFrame(time, frame) {
            session.requestAnimationFrame(onFrame);

            const hits = frame.getHitTestResults(hitTestSource);
            if (hits.length > 0) gl.clearColor(0, 1, 0, 1);
            else gl.clearColor(0.2, 0.2, 0.2, 1);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        session.requestAnimationFrame(onFrame);
    }).catch((err) => {
        console.error("XR session failed:", err);
        alert("WebXR Init Error:\n" + err.message);
        startButton.disabled = false;
        startButton.textContent = "Start Benchmark";
    });
});

window.onbeforeunload = () => {
    if (stats) exportCSV(metrics);
};
