export function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|mac/.test(ua)) {
        return { platform: "iOS", name: "Apple Device" };
    }

    if (/android/.test(ua)) {
        return { platform: "Android", name: "Android Device" };
    }

    return { platform: "Unknown", name: "Desktop/Unsupported" };
}
