const parseValue = (value) => {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  const num = Number(trimmed);
  return Number.isNaN(num) ? trimmed : num;
};

const parseCSVText = (text) => {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    return headers.reduce((acc, header, index) => {
      acc[header] = parseValue(cells[index] || '');
      return acc;
    }, {});
  });
};

const toCSVText = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escapeCell = (cell) => {
    const raw = String(cell ?? '');
    return raw.includes(',') || raw.includes('"') ? `"${raw.replaceAll('"', '""')}"` : raw;
  };

  const body = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','));
  return [headers.join(','), ...body].join('\n');
};

export const useImportExport = () => {
  const exportToCSV = (data, filename) => {
    const csv = toCSVText(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(parseCSVText(reader.result));
    reader.onerror = () => reject(new Error('Could not read CSV file'));
    reader.readAsText(file);
  });

  return { exportToCSV, importFromCSV };
};
