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

startButton.addEventListener("click", async () => {
    if (sessionRunning) return;
    sessionRunning = true;
    startButton.disabled = true;
    startButton.textContent = "Starting AR...";

    const deviceInfo = detectDevice();
    console.log("📱 Device Info:", deviceInfo);

    if (!deviceInfo.webXRSupported) {
        alert("WebXR is not supported in this browser.");
        return;
    }

    metrics = new Metrics();
    stats = new StatsLogger(deviceInfo);

    try {
        const xr = await createXRSession();
        const hitTester = await setupHitTest(xr);

        const gl = xr.gl;

        xr.session.requestAnimationFrame(function onFrame(t, frame) {
            xr.session.requestAnimationFrame(onFrame);

            // простая отрисовка фона
            gl.clearColor(0.2, 0.2, 0.2, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const startTime = performance.now();
            const success = hitTester(frame, gl);
            const elapsed = performance.now() - startTime;

            metrics.record(success);
            stats.logFrame(success, elapsed);

            frameElem.textContent = metrics.frames;
            hitElem.textContent = metrics.hits;
            rateElem.textContent = metrics.successRate.toFixed(2) + "%";
        });

    } catch (err) {
        console.error("❌ XR Session failed:", err);
        alert("WebXR Init Error:\n" + err.message);
        startButton.disabled = false;
        startButton.textContent = "Start Benchmark";
        sessionRunning = false;
    }
});

window.onbeforeunload = () => {
    if (stats) exportCSV(metrics);
};
