let stats = {
    totalFrames: 0,
    hitCount: 0,
    latencies: [],
};

export function initStats() {
    stats = { totalFrames: 0, hitCount: 0, latencies: [] };
}

export function logStats(success, latency) {
    stats.totalFrames++;
    if (success) stats.hitCount++;
    stats.latencies.push(latency);
}

export function updateStatsUI() {
    const successRate = stats.totalFrames
        ? ((stats.hitCount / stats.totalFrames) * 100).toFixed(2)
        : 0;

    const avgLatency = stats.latencies.length
        ? (stats.latencies.reduce((a,b)=>a+b,0) / stats.latencies.length).toFixed(2)
        : 0;

    document.getElementById("frameCount").innerText = stats.totalFrames;
    document.getElementById("hitSuccess").innerText = `${successRate}%`;
    document.getElementById("avgLatency").innerText = `${avgLatency} ms`;
}
