export class StatsLogger {
    constructor(deviceInfo) {
        this.device = deviceInfo;
        this.entries = [];
        this.startTimestamp = performance.now();
    }

    logFrame(success, elapsedTime) {
        this.entries.push({
            timestamp: performance.now() - this.startTimestamp,
            hitSuccess: success,
            processingTime: elapsedTime
        });
    }

    exportJSON() {
        return {
            device: this.device,
            results: this.entries
        };
    }
}
