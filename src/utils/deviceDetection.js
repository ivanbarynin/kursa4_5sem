export function detectDevice() {
    const ua = navigator.userAgent;

    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isChrome = /Chrome|CriOS/i.test(ua);
    const isFirefox = /Firefox/i.test(ua);

    const deviceInfo = {
        userAgent: ua,
        platform: navigator.platform,
        browser: isSafari ? "Safari" : isChrome ? "Chrome" : isFirefox ? "Firefox" : "Unknown",
        os: isIOS ? "iOS" : "Android",
        hasLiDAR: isIOS && (ua.includes("iPhone 12") || ua.includes("iPhone 13") || ua.includes("iPhone 14") || ua.includes("iPhone 15") || ua.includes("iPhone 16")),
        webXRSupported: "xr" in navigator,
    };

    return deviceInfo;
}
