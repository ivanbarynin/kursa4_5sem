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
    startButton.textContent = "Running...";

    // Detect device
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

        console.log("🚀 XR session started");

        xr.session.requestAnimationFrame(onFrame);

        function onFrame(time, frame) {
            xr.session.requestAnimationFrame(onFrame);

            const startTime = performance.now();
            const success = hitTester(frame);
            const processingTime = performance.now() - startTime;

            metrics.record(success);
            stats.logFrame(success, processingTime);

            updateUI();
        }

    } catch (err) {
        console.error(err);
        alert("❌ Failed to start AR session: " + err.message);
        sessionRunning = false;
        startButton.textContent = "Start Benchmark";
    }
});


function updateUI() {
    frameElem.textContent = metrics.frames;
    hitElem.textContent = metrics.hits;
    rateElem.textContent = metrics.successRate.toFixed(2) + "%";
}

// Auto-export on exit
window.onbeforeunload = () => {
    if (stats) exportCSV(metrics);
};
