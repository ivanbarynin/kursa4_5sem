export function exportCSV(dataRows, filename="hit_test_results.csv") {
    if (!dataRows || dataRows.length === 0) return;

    const header = Object.keys(dataRows[0]).join(",");
    const csv = dataRows.map(row => Object.values(row).join(",")).join("\n");
    const csvContent = header + "\n" + csv;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
