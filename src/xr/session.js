export async function createXRSession() {
    if (!navigator.xr) throw new Error("XR not supported");

    const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body }
    });

    // Берём canvas из HTML
    const canvas = document.getElementById("xr-canvas");
    const gl = canvas.getContext("webgl", { xrCompatible: true });
    await gl.makeXRCompatible();

    // Настройка XRWebGLLayer
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

    const refSpace = await session.requestReferenceSpace("local");

    return { session, gl, refSpace };
}
