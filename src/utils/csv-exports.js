export function exportCSV(metrics) {
    const csv = `Frames,Hits,SuccessRate\n${metrics.frames},${metrics.hits},${metrics.successRate.toFixed(2)}%`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "benchmark_results.csv";
    a.click();
}
