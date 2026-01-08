const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = process.argv[2];
const columnName = process.argv[3];

if (!csvFilePath || !columnName) {
  console.error('Usage: node main.js <csv_file_path> <column_name>');
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(csvFilePath)) {
  console.error('Error: File not found');
  process.exit(1);
}

let sum = 0;
let count = 0;
let columnExists = false;

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('headers', (headers) => {
    if (!headers.includes(columnName)) {
      console.error('Error: Column not found');
      process.exit(1);
    }
    columnExists = true;
  })
  .on('data', (data) => {
    const value = Number(data[columnName]);
    if (!isNaN(value)) {
      sum += value;
      count++;
    }
  })
  .on('end', () => {
    if (count > 0) {
      const average = sum / count;
      console.log(`The average value of ${columnName} is: ${average}`);
    } else if (columnExists) {
      console.error(`Error: No numeric data in column ${columnName}`);
    }
  })
  .on('error', (err) => {
    console.error(`Error reading CSV file: ${err.message}`);
  });
