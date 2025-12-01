export async function setupHitTest(xr) {
    const viewerSpace = await xr.session.requestReferenceSpace("viewer");
    const hitTestSource = await xr.session.requestHitTestSource({ space: viewerSpace });

    return function processFrame(frame) {
        const hits = frame.getHitTestResults(hitTestSource);
        return hits.length > 0;
    };
}
