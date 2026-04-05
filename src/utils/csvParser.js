import Papa from 'papaparse';
export async function loadDroneTeamsFromCSV(csvPath) {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const droneTeams = results.data
            .filter(row => {
              const category = row.Category || row.category || '';
              return category.toLowerCase().includes('drone');
            })
            .map((row, index) => {
              return {
                id: row['Team ID'] || row['team id'] || `DRONE${index + 1}`,
                name: row['Team Name'] || row['team name'] || 'Unknown Team',
                category: row['Category'] || row['category'] || '',
                organisation: row['Organisation'] || row['organisation'] || '',
                fullData: row
              };
            });

          resolve(droneTeams);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    throw error;
  }
}

export function parseCSVAndFilterDroneTeams(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true, 
      skipEmptyLines: true,
      complete: (results) => {
        const droneTeams = results.data
          .filter(row => {
            const category = row.Category || row.category || '';
            return category.toLowerCase().includes('drone');
          })
          .map((row, index) => {
            return {
              id: row['Team ID'] || row['team id'] || `DRONE${index + 1}`,
              name: row['Team Robot Name'] || row['team robot name'] || 'Unknown Team',
              category: row['Category'] || row['category'] || '',
              organisation: row['Organisation'] || row['organisation'] || '',
              fullData: row
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

export async function loadRobotRugbyTeamsFromCSV(csvPath) {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();

    console.log("CSV Text Loaded:", csvText);
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true, 
        skipEmptyLines: true,
        complete: (results) => {
          const rugbyTeams = results.data
            .filter(row => {
              const category = row.Category || row.category || '';
              return category.toLowerCase().includes('robot rugby');
            })
            .map((row, index) => {
              return {
                id: row['Team ID'] || row['team id'] || `RUGBY${index + 1}`,
                TeamName: row['Team Robot Name'] || row['team robot name'] || 'Unknown Team',
                category: row['Category'] || row['category'] || '',
                organisation: row['Organisation'] || row['organisation'] || '',
                fullData: row
              };
            });

          console.log("Parsed Rugby Teams:", rugbyTeams);
          resolve(rugbyTeams);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    throw error;
  }
}
