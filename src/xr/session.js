export async function createXRSession() {
    if (!navigator.xr) {
        alert("WebXR not supported.");
        throw new Error("XR not supported");
    }

    const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body },
    });

    // создаём canvas сразу и делаем его видимым
    const canvas = document.createElement("canvas");
    canvas.id = "xr-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl", { xrCompatible: true });
    await gl.makeXRCompatible();

    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

    const refSpace = await session.requestReferenceSpace("local");

    return { session, gl, refSpace };
}
