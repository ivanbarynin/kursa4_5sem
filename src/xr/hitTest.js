export async function setupHitTest(xr) {
    // Создаём reference space для hit-test
    const viewerSpace = await xr.session.requestReferenceSpace("viewer");
    const hitTestSource = await xr.session.requestHitTestSource({ space: viewerSpace });

    // Возвращаем функцию, которая на каждом кадре проверяет hit
    return function processFrame(frame) {
        const hits = frame.getHitTestResults(hitTestSource);
        return hits.length > 0;
    };
}
