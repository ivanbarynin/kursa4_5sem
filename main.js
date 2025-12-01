import { detectDevice } from "./src/utils/deviceDetection.js";
import { startHitTesting } from "./src/xr/hitTest.js";
import { exportCSV } from "./src/utils/statsLogger.js";

const deviceInfo = detectDevice();
document.getElementById("device").innerText = `${deviceInfo.name} (${deviceInfo.platform})`;
console.log("Mode:", deviceInfo.mode);

if (deviceInfo.platform === "iOS" && deviceInfo.mode === "webxr-viewer") {
    document.getElementById("ios-hint").style.display = "block";
}

let dataRows = [];

const logStats = (success, ttfh) => {
    const logRow = {
        timestamp: new Date().toISOString(),
        browser: deviceInfo.name,
        platform: deviceInfo.platform,
        mode: deviceInfo.mode,
        ttfh_ms: ttfh ? Math.round(ttfh) : null,
        success: success ? 1 : 0
    };
    dataRows.push(logRow);
};

document.getElementById("startButton").addEventListener("click", async () => {
    if (!navigator.xr) {
        alert("WebXR не поддерживается на этом устройстве/браузере");
        return;
    }

    try {
        const session = await navigator.xr.requestSession("immersive-ar", {
            optionalFeatures: ["local-floor", "hit-test", "depth-sensing"]
        });
        startHitTesting(session, logStats, deviceInfo);
    } catch (err) {
        console.error(err);
        alert("Не удалось запустить AR сессию: " + err.message);
    }
});

document.getElementById("exportCSVButton").addEventListener("click", () => {
    if (dataRows.length > 0) exportCSV(dataRows);
    else alert("Нет данных для экспорта");
});
