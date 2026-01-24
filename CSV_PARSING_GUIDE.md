# How to Use CSV Files in JavaScript

## Overview
CSV (Comma-Separated Values) files have headers (column names) that act as keys for each row. When you parse a CSV, each row becomes an object where the keys are the column headers.

## Example CSV Structure
```csv
Team ID,Team Robot Name,Category,Organisation
TDRC0004,School 11 (Team №1),Drone RC,11th school
TDRA0003,School 11 (Team №1),Drone Auto,11th school
```

## Using PapaParse Library

### 1. Install PapaParse
```bash
npm install papaparse
```

### 2. Basic Usage

```javascript
import Papa from 'papaparse';

// Method 1: Parse CSV text directly
const csvText = `Team ID,Team Robot Name,Category
TDRC0004,School 11,Drone RC
TDRA0003,School 11,Drone Auto`;

Papa.parse(csvText, {
  header: true,  // Use first row as headers/keys
  skipEmptyLines: true,
  complete: (results) => {
    // results.data is an array of objects
    // Each object has keys from the header row
    console.log(results.data);
    // Output:
    // [
    //   { "Team ID": "TDRC0004", "Team Robot Name": "School 11", "Category": "Drone RC" },
    //   { "Team ID": "TDRA0003", "Team Robot Name": "School 11", "Category": "Drone Auto" }
    // ]
    
    // Access data using header names as keys
    results.data.forEach(row => {
      console.log(row["Team ID"]);        // "TDRC0004"
      console.log(row["Team Robot Name"]); // "School 11"
      console.log(row["Category"]);        // "Drone RC"
    });
  }
});
```

### 3. Loading CSV from a File

#### Option A: Using fetch (for files in public folder)
```javascript
async function loadCSV() {
  const response = await fetch('/teams.csv');
  const csvText = await response.text();
  
  Papa.parse(csvText, {
    header: true,
    complete: (results) => {
      console.log(results.data);
    }
  });
}
```

#### Option B: Using Vite's raw import (for files in src/assets)
```javascript
import csvText from './assets/teams.csv?raw';

Papa.parse(csvText, {
  header: true,
  complete: (results) => {
    console.log(results.data);
  }
});
```

#### Option C: File upload from user
```javascript
function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const csvText = e.target.result;
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        console.log(results.data);
      }
    });
  };
  
  reader.readAsText(file);
}
```

### 4. Filtering Data

```javascript
Papa.parse(csvText, {
  header: true,
  complete: (results) => {
    // Filter for Drone teams
    const droneTeams = results.data.filter(row => {
      const category = row.Category || row.category || '';
      return category.toLowerCase().includes('drone');
    });
    
    console.log(droneTeams);
  }
});
```

### 5. Transforming Data

```javascript
Papa.parse(csvText, {
  header: true,
  complete: (results) => {
    // Transform CSV rows into your app's format
    const teams = results.data.map((row, index) => {
      return {
        id: row['Team ID'],
        name: row['Team Robot Name'],
        category: row['Category'],
        // Add any other fields you need
      };
    });
    
    console.log(teams);
  }
});
```

## Key Points

1. **Headers as Keys**: When `header: true` is set, the first row becomes the keys for all subsequent rows.

2. **Accessing Data**: Use bracket notation `row["Column Name"]` to access values, as column names may contain spaces or special characters.

3. **Case Sensitivity**: Column names are case-sensitive. Use `row.Category` or `row.category` depending on your CSV.

4. **Error Handling**: Always wrap CSV parsing in try-catch blocks.

5. **Async/Await**: For file loading, use async/await or promises.

## Complete Example (Used in This Project)

```javascript
import Papa from 'papaparse';
import teamsCSV from './assets/teams_monrobot.csv?raw';

export function parseCSVAndFilterDroneTeams(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter for Drone teams
        const droneTeams = results.data
          .filter(row => {
            const category = row.Category || row.category || '';
            return category.toLowerCase().includes('drone');
          })
          .map((row, index) => {
            return {
              id: row['Team ID'],
              name: row['Team Robot Name'],
              category: row['Category'],
            };
          });
        
        resolve(droneTeams);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

// Usage
const teams = await parseCSVAndFilterDroneTeams(teamsCSV);
```
