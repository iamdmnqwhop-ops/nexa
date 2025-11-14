/**
 * Google Apps Script for NEXA Feedback Collection
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code into the Apps Script editor
 * 4. Save the script
 * 5. Deploy > New Deployment > Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy the Web app URL and replace YOUR_GOOGLE_APPS_SCRIPT_ID_HERE in FeedbackModal.tsx
 */

// Sheet name where feedback will be stored
const SHEET_NAME = 'NEXA Feedback';

// Setup the spreadsheet with headers
function setupSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
                 SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  const headers = [
    'Timestamp',
    'Product Title',
    'Rating (1-5)',
    'Priorities',
    'Big Idea',
    'User Agent',
    'IP Address'
  ];

  // Set headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  // Auto-size columns
  sheet.autoResizeColumns(1, headers.length);
}

// Main function to handle POST requests
function doPost(e) {
  try {
    // Setup sheet if needed
    setupSpreadsheet();

    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Create the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.productTitle || '',
      data.rating || 0,
      data.priorities || '',
      data.bigIdea || '',
      data.userAgent || '',
      e.parameters.user_ip ? e.parameters.user_ip[0] : 'Unknown'
    ];

    // Add the new row
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());

    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Failed to submit feedback: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to get feedback summary
function getFeedbackSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { total: 0, averageRating: 0, topPriorities: [] };
  }

  // Get all data
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();

  // Calculate metrics
  const total = data.length;
  const ratings = data.map(row => Number(row[2])).filter(r => !isNaN(r) && r > 0); // Rating is column 3 (index 2)
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  // Count priorities
  const priorityCount = {};
  data.forEach(row => {
    if (row[3] && typeof row[3] === 'string') { // Priorities is column 4 (index 3)
      const priorities = row[3].split(', ');
      priorities.forEach(priority => {
        priorityCount[priority] = (priorityCount[priority] || 0) + 1;
      });
    }
  });

  // Sort priorities by count
  const topPriorities = Object.entries(priorityCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([priority, count]) => ({ priority, count }));

  return {
    total,
    averageRating: Math.round(averageRating * 10) / 10,
    topPriorities
  };
}

// Create a menu item for easy access
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('NEXA Feedback')
    .addItem('Get Summary', 'showFeedbackSummary')
    .addItem('Setup Sheet', 'setupSpreadsheet')
    .addToUi();
}

// Show feedback summary in a dialog
function showFeedbackSummary() {
  const summary = getFeedbackSummary();

  const message = `
Total Feedback: ${summary.total}
Average Rating: ${summary.averageRating}/5 ⭐

Top Priorities:
${summary.topPriorities.map(p => `• ${p.priority}: ${p.count}`).join('\n')}
  `.trim();

  SpreadsheetApp.getUi().alert('NEXA Feedback Summary', message, SpreadsheetApp.getUi().ButtonSet.OK);
}