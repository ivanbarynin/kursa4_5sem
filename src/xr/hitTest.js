export async function startHitTesting(session, logStats, deviceInfo) {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, context: gl });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const refSpace = await session.requestReferenceSpace("local");
    const viewerSpace = await session.requestReferenceSpace("viewer");

    let hitTestSource = null;
    if (deviceInfo.mode === "webxr" || deviceInfo.mode === "webxr-native") {
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
    } else if (deviceInfo.mode === "fallback-depth") {
        console.log("Depth fallback mode enabled");
    }

    let sessionStartTime = performance.now();
    let firstHitRecorded = false;

    session.requestAnimationFrame(function onXRFrame(time, frame) {
        session.requestAnimationFrame(onXRFrame);

        if (!firstHitRecorded && hitTestSource) {
            const results = frame.getHitTestResults(hitTestSource);
            if (results.length > 0) {
                const ttfh = performance.now() - sessionStartTime;
                firstHitRecorded = true;
                logStats(true, ttfh);
                console.log("First hit at ms:", Math.round(ttfh));
            }
        }

        if (!hitTestSource && deviceInfo.mode === "fallback-depth") {
            if (frame.getDepthInformation) {
                // Depth fallback обработка (raycast по depth map)
            }
        }

        renderer.render(scene, camera);
    });
}
