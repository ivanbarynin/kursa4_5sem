import { scene, camera } from "./renderer.js";

export async function startHitTesting(session, renderer, logStats, updateUI) {
    const refSpace = await session.requestReferenceSpace("local");
    const viewerSpace = await session.requestReferenceSpace("viewer");

    let hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    const gl = renderer.getContext();

    session.requestAnimationFrame(onXRFrame);

    async function onXRFrame(time, frame) {
        const start = performance.now();

        session.requestAnimationFrame(onXRFrame);

        const pose = frame.getViewerPose(refSpace);

        if (!pose) return;

        const hits = frame.getHitTestResults(hitTestSource);

        const success = hits.length > 0;
        logStats(success, performance.now() - start);
        updateUI();

        renderer.render(scene, camera);
        gl.flush();
    }
}
