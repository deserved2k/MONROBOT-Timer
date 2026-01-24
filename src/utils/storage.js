const STORAGE_KEYS = {
  MANUAL_RESULTS: 'monrobot_manual_results',
  AUTOMATIC_RESULTS: 'monrobot_automatic_results',
  RUGBY_MATCHES: 'monrobot_rugby_matches'
};

export function saveManualResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.MANUAL_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving manual results:', error);
  }
}

export function saveAutomaticResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTOMATIC_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving automatic results:', error);
  }
}

export function saveRugbyMatches(matches) {
  try {
    localStorage.setItem(STORAGE_KEYS.RUGBY_MATCHES, JSON.stringify(matches));
  } catch (error) {
    console.error('Error saving rugby matches:', error);
  }
}

export function loadManualResults() {
  try {
    const results = localStorage.getItem(STORAGE_KEYS.MANUAL_RESULTS);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error loading manual results:', error);
    return [];
  }
}

export function loadAutomaticResults() {
  try {
    const results = localStorage.getItem(STORAGE_KEYS.AUTOMATIC_RESULTS);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error loading automatic results:', error);
    return [];
  }
}

export function loadRugbyMatches() {
  try {
    const matches = localStorage.getItem(STORAGE_KEYS.RUGBY_MATCHES);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Error loading rugby matches:', error);
    return [];
  }
}

export function clearAllResults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MANUAL_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.AUTOMATIC_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.RUGBY_MATCHES);
  } catch (error) {
    console.error('Error clearing results:', error);
  }
}

export function clearManualResults() {
  localStorage.removeItem(STORAGE_KEYS.MANUAL_RESULTS);
}

export function clearAutomaticResults() {
  localStorage.removeItem(STORAGE_KEYS.AUTOMATIC_RESULTS);
}

export function clearRugbyMatches() {
  localStorage.removeItem(STORAGE_KEYS.RUGBY_MATCHES);
}
