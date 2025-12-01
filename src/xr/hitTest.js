export async function setupHitTest(xr) {
    const viewerSpace = await xr.session.requestReferenceSpace("viewer");
    const hitTestSource = await xr.session.requestHitTestSource({ space: viewerSpace });

    return function processFrame(frame, gl) {
        const hits = frame.getHitTestResults(hitTestSource);

        // простой маркер: меняем фон при попадании
        if (hits.length > 0) {
            gl.clearColor(0, 1, 0, 1); // зелёный при hit
        } else {
            gl.clearColor(0.2, 0.2, 0.2, 1); // серый иначе
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        return hits.length > 0;
    };
}
