import { createXRSession } from "./xr/session.js";
import { setupHitTest } from "./xr/hitTest.js";
import { Metrics } from "./utils/metrics.js";
import { exportCSV } from "./utils/csv-export.js";

const startButton = document.getElementById("start");
const frameElem = document.getElementById("frames");
const hitElem = document.getElementById("hits");
const rateElem = document.getElementById("successRate");

let metrics;

startButton.addEventListener("click", async () => {
    metrics = new Metrics();
    const xr = await createXRSession();

    const hitTester = await setupHitTest(xr);

    xr.session.requestAnimationFrame(onFrame);

    function onFrame(t, frame) {
        xr.session.requestAnimationFrame(onFrame);

        const result = hitTester(frame);

        metrics.record(result);

        frameElem.textContent = metrics.frames;
        hitElem.textContent = metrics.hits;
        rateElem.textContent = metrics.successRate.toFixed(2) + "%";
    }
});

// Optional: export results when leaving page
window.onbeforeunload = () => {
    if (metrics) exportCSV(metrics);
};
