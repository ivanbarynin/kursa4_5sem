export class Metrics {
    constructor() {
        this.frames = 0;
        this.hits = 0;
    }

    record(success) {
        this.frames++;
        if (success) this.hits++;
    }

    get successRate() {
        return this.frames === 0 ? 0 : (this.hits / this.frames) * 100;
    }

    toJSON() {
        return {
            frames: this.frames,
            hits: this.hits,
            successRate: this.successRate,
        };
    }
}
