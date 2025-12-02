import { detectDevice } from "./src/utils/deviceDetection.js";
import { Metrics } from "./src/utils/metrics.js";
import { StatsLogger } from "./src/utils/statsLogger.js";
import { exportCSV } from "./src/utils/csv-exports.js";

const startButton = document.getElementById("start");
const canvas = document.getElementById("xr-canvas");

const frameElem = document.getElementById("frames");
const hitElem = document.getElementById("hits");
const rateElem = document.getElementById("successRate");

let metrics = new Metrics();
let logger = new StatsLogger(detectDevice());
let xrSession, gl, hitTestSource, refSpace;

startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    startButton.textContent = "Starting AR...";

    if (!navigator.xr) {
        alert("WebXR not supported.");
        startButton.disabled = false;
        return;
    }

    try {
        xrSession = await navigator.xr.requestSession("immersive-ar", {
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["dom-overlay", "depth-sensing", "anchors"],
            domOverlay: { root: document.body },
            depthSensing: {
                usagePreference: ["cpu-optimized", "gpu-optimized"],
                dataFormatPreference: ["luminance-alpha"]
            }
        });

        gl = canvas.getContext("webgl", { xrCompatible: true });
        await gl.makeXRCompatible();

        xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(xrSession, gl)
        });

        refSpace = await xrSession.requestReferenceSpace("local");

        const viewerSpace = await xrSession.requestReferenceSpace("viewer");

        // Android fallback API check
        if (xrSession.requestHitTestSource) {
            hitTestSource = await xrSession.requestHitTestSource({ space: viewerSpace });
        } else if (xrSession.requestHitTestSourceForTransientInput) {
            hitTestSource = await xrSession.requestHitTestSourceForTransientInput({ profile: "generic-touchscreen" });
        } else {
            alert("Hit-Test API not available.");
            startButton.disabled = false;
            return;
        }

        xrSession.requestAnimationFrame(onFrame);

    } catch (err) {
        alert("WebXR failed: " + err.message);
        console.error(err);
        startButton.disabled = false;
    }
});

function onFrame(time, frame) {
    xrSession.requestAnimationFrame(onFrame);

    const pose = frame.getViewerPose(refSpace);
    if (!pose) return;

    const layer = xrSession.renderState.baseLayer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);

    // Hit test support cross-browser
    let results = [];
    if (frame.getHitTestResults) {
        results = frame.getHitTestResults(hitTestSource);
    } else if (frame.getHitTestResultsForTransientInput) {
        results = frame.getHitTestResultsForTransientInput(hitTestSource);
    }

    const success = results.length > 0;
    metrics.record(success);

    // UI update
    frameElem.textContent = metrics.frames;
    hitElem.textContent = metrics.hits;
    rateElem.textContent = metrics.successRate.toFixed(2) + "%";

    // logging timing stats
    logger.logFrame(success, performance.now());
}
