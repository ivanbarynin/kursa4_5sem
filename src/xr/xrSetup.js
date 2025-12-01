import { createRenderer, scene, camera } from "./renderer.js";
import { startHitTesting } from "./hitTest.js";

export async function initXR(logStats, updateUI) {
    const xr = navigator.xr;

    const session = await xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body }
    });

    const renderer = createRenderer();
    renderer.xr.setSession(session);

    startHitTesting(session, renderer, logStats, updateUI);

    return session;
}
