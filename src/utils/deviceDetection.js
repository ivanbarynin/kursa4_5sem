export function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    let platform = "Unknown";
    let name = "Unknown";
    let mode = "default";

    if (/iphone|ipad|ipod/.test(ua)) {
        platform = "iOS";
        name = "Apple Device";
        mode = navigator.xr ? "webxr-native" : "webxr-viewer";
    } else if (/android/.test(ua)) {
        platform = "Android";
        name = "Android Device";
        mode = navigator.xr ? "webxr" : "fallback-depth";
    } else if (/firefox/.test(ua)) {
        platform = "Desktop/Firefox";
        name = "Firefox";
        mode = navigator.xr ? "webxr" : "unsupported";
    } else if (/chrome/.test(ua)) {
        platform = "Desktop/Chrome";
        name = "Chrome";
        mode = navigator.xr ? "webxr" : "unsupported";
    }

    return { platform, name, mode };
}
