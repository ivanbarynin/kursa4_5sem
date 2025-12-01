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
    startButton.textContent = "Начинаем AR сессию...";

    // Отображаем device info в консоли
    const deviceInfo = detectDevice();
    console.log("📱 Информация об устройстве:", deviceInfo);

    if (!deviceInfo.webXRSupported) {
        alert("WebXR не поддерживает этот браузер.");
        return;
    }

    metrics = new Metrics();
    stats = new StatsLogger(deviceInfo);

    try {
        // XR session создаётся сразу после клика пользователя
        const xr = await createXRSession();
        const hitTester = await setupHitTest(xr);

        xr.session.requestAnimationFrame(function onFrame(t, frame) {
            xr.session.requestAnimationFrame(onFrame);

            const startTime = performance.now();
            const success = hitTester(frame);
            const processingTime = performance.now() - startTime;

            metrics.record(success);
            stats.logFrame(success, processingTime);

            // Обновляем UI
            frameElem.textContent = metrics.frames;
            hitElem.textContent = metrics.hits;
            rateElem.textContent = metrics.successRate.toFixed(2) + "%";
        });

    } catch (err) {
        console.error("❌ XR сессия провалена:", err);
        alert("WebXR Init Error:\n" + err.message);
        startButton.disabled = false;
        startButton.textContent = "Начать сессию";
        sessionRunning = false;
    }
});

// Авто-экспорт результатов при закрытии страницы
window.onbeforeunload = () => {
    if (stats) exportCSV(metrics);
};
