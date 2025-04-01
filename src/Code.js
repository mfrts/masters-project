function autoUpdateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName("RAW DATA"); //enter your personal sheet name here
  var rawRange = rawSheet.getRange("A1");
  rawRange.setFormula("=true");
  SpreadsheetApp.flush();
  rawRange.setFormula('=IMPORTHTML("https://www.espn.com/golf/leaderboard","table",1)'); 
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Web App')
      .addItem('Leaderboard', 'showLeaderboard')
      .addItem('Payouts', 'showPayouts')
      .addToUi();
}

function doGet(e) {

  const page = e?.parameter?.page || 'leaderboard';
  const titles = {
    'leaderboard': 'Leaderboard',
    'payouts': 'Payouts',
    'raw_data': 'Raw Data',
    'lowday_leaderboard': 'Low Day',
  }

  console.log('showing page', page)

  return HtmlService.createTemplateFromFile(page)
      .evaluate()
      .setTitle(titles[page]);
}

function getDataFromGoogleSheet() {
  var ss = SpreadsheetApp.openById('1XqHqiYIfFE848Kty5TdlJgzhgF6BNwdA1dfgmZbeOBY');

  // Fetch data from LEADERBOARD sheet
  var leaderboardSheet = ss.getSheetByName('LEADERBOARD');
  var leaderboardData = leaderboardSheet.getRange('A2:D').getValues();
  
  // Fetch data from LEADERBOARD_LOWDAY sheet
  var lowdaySheet = ss.getSheetByName('LEADERBOARD_LOWDAY');
  var lowdayData = lowdaySheet.getRange('A2:C').getValues();

  return {
    leaderboard: leaderboardData,
    lowday: lowdayData
  };
}

function getTeamSelection(playerName) {
  var ss = SpreadsheetApp.openById('1XqHqiYIfFE848Kty5TdlJgzhgF6BNwdA1dfgmZbeOBY');
  var sheet = ss.getSheetByName('PLAYERS');
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, 24).getValues(); // Assuming 24 columns for player data
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === playerName) {
      var teamSelection = data[i].slice(2); // Extract team selection data starting from the 3rd column
      return teamSelection;
    }
  }
  return "No team selection found for " + playerName;
}

function showLeaderboard() {
  var ss = SpreadsheetApp.openById('1XqHqiYIfFE848Kty5TdlJgzhgF6BNwdA1dfgmZbeOBY');
  var sheet = ss.getSheetByName('LEADERBOARD');
  var data = sheet.getRange('A1:C').getValues();
  // Generate HTML page with data and return it
}

function showPayouts() {
  var ss = SpreadsheetApp.openById('1XqHqiYIfFE848Kty5TdlJgzhgF6BNwdA1dfgmZbeOBY');
  var sheet = ss.getSheetByName('PAYOUTS');
  var data = sheet.getRange('E1:H').getValues();
  console.log(data)
  // Generate HTML page with data and return it
}

function getPayoutsData() {
  var ss = SpreadsheetApp.openById('1XqHqiYIfFE848Kty5TdlJgzhgF6BNwdA1dfgmZbeOBY');
  var sheet = ss.getSheetByName('PAYOUTS');
  var data = sheet.getRange('E3:H').getValues();

  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const d = data[r][c];
      if (d && d instanceof Date) {
        data[r][c] = d.toDateString();
      }
      if (d && c === 2) {
        data[r][c] = d.toFixed(2)
      }
    }
  }

  console.log('getPayoutsData().data', data);

  return data;
}

function getRawData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RAW DATA');
  var data = sheet.getRange('B2:K').getValues();

  const newData = []
  for (let r = 0; r < data.length; r++) {
    // If the first 4 columns are empty then ignore the row
    if (!data[r][0] && !data[r][1] && !data[r][2] && !data[r][3]) {
      continue;
    }
    for (let c = 0; c < data[r].length; c++) {
      const d = data[r][c];
      if (d && d instanceof Date) {
        data[r][c] = d.toLocaleTimeString();
      }
    }
    newData.push(data[r]);
  }

  console.log('getRawData().data', newData);

  return newData;
}

/**
 * Get the RAW data from ESPN (v2) 2024-04-12
 */
function getRawDataV2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RAW DATA');
  var data = sheet.getRange('B:L').getValues();

  const newData = []
  for (let r = 0; r < data.length; r++) {
    // If the first 4 columns are empty then ignore the row
    if (!data[r][0] && !data[r][1] && !data[r][2] && !data[r][3]) {
      continue;
    }
    for (let c = 0; c < data[r].length; c++) {
      const d = data[r][c];
      if (d && d instanceof Date) {
        data[r][c] = d.toLocaleTimeString();
      }
    }
    newData.push(data[r]);
  }

  console.log('getRawData().data', newData);

  return newData;
}

function getLowDay() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LEADERBOARD_LOWDAY');
  var data = sheet.getRange('A1:C').getValues();

  console.log('getLowDay().data', data);

  return data;
}

function getMultiSheetData(sheetNames) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetData = {}
  for (var sheetName of sheetNames) {
    sheetData[sheetName] = ss.getSheetByName(sheetName).getDataRange().getValues();
  }
  
  return sheetData;
}

function getUrl() {
  return ScriptApp.getService().getUrl();
}