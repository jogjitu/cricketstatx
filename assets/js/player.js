const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user');

if (!userId) createUserInDB()

function createUserInDB() {
  const userId = auth.currentUser.uid;
  const userDetailsRef = firebase.database().ref(`/players/${userId}/details`);
  userDetailsRef.set({
    name: "No Name"
  })
  getUserData(userId)
}

const battingModal = document.getElementById('battingInsightsModal');
const practiseBattingModal = document.getElementById('practiseBattingInsightsModal');
const bowlingModal = document.getElementById('bowlingInsightsModal');
const practiseBowlingModal = document.getElementById('practiseBowlingInsightsModal');

const newBattingButton = document.getElementById('newBattingButton')
const newPractiseBattingButton = document.getElementById('newPractiseBattingButton')
const newBowlingButton = document.getElementById('newBowlingButton')
const newPractiseBowlingButton = document.getElementById('newPractiseBowlingButton')

const battingStatsRow = document.getElementById("battingStatsRow");
const bowlingStatsRow = document.getElementById("bowlingStatsRow");

const statsTemplate = `
<div class="col-6 col-md-4 col-xl-3 mb-3">
  <div class="card shadow">
    <div class="card-body text-center">
      <h4 class="card-title display-4">{}</h4>
      <p class="card-text text-primary">{}</p>
    </div>
  </div>
</div>
`

/**
 * ------------------------------------------------
 * Event Listeners
 * ------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => getUserData(userId));

newBattingButton.addEventListener('click', () => showFreshModal(battingModal))
newPractiseBattingButton.addEventListener('click', () => showFreshModal(practiseBattingModal))
newBowlingButton.addEventListener('click', () => showFreshModal(bowlingModal))
newPractiseBowlingButton.addEventListener('click', () => showFreshModal(practiseBowlingModal))

document.addEventListener('DOMContentLoaded', function() {
  var imagePreview = document.getElementById('image-preview');
  var imageUpload = document.getElementById('image-upload');

  imagePreview.addEventListener('click', function() {
    imageUpload.click();
  });

  imageUpload.addEventListener('change', function() {
    var input = this;
    var reader = new FileReader();

    reader.onload = function(e) {
      imagePreview.src = e.target.result;
    };

    if (input.files && input.files[0]) {
      reader.readAsDataURL(input.files[0]);
    }
  });
});

/**
 * ------------------------------------------------
 * Data Updates
 * ------------------------------------------------
 */
function getUserData(userId) {
  const databaseRef = database.ref(`players/${userId}`);
  databaseRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data) returnHome()
    updatePlayerDetails(data?.details)
    updateBattingData(data?.Batting)
    updatePractiseBattingData(data?.PractiseBatting)
    updateBowlingData(data?.Bowling)
    updatePractiseBowlingData(data?.PractiseBowling)
    computeStats(data)
  }) 
}

/**
 * ------------------------------------------------
 * Batting
 * ------------------------------------------------
 */
function updateBattingData(data) {
  if (!data || !Object.keys(data).length) return
  // Get a reference to the table body element
  var dataBody = document.getElementById("battingTableBody");
  dataBody.innerHTML = "";  

  const battingDataLists = {}

  // Iterate over the data and create table rows
  Object.keys(data).forEach(id => {
    const d = data[id];
    var row = document.createElement("tr");
    row.id = id;
    row.innerHTML = `
        <td class="Date">${d?.['Date'] || '-'}</td>
        <td class="Tournament">${d?.['Tournament'] || '-'}</td>
        <td class="PlayedFor">${d?.['PlayedFor'] || '-'}</td>
        <td class="PlayedAgainst">${d?.['PlayedAgainst'] || '-'}</td>
        <td class="Venue">${d?.['Venue'] || '-'}</td>
        <td class="TotalOvers">${d?.['TotalOvers'] || '-'}</td>
        <td class="Runs">${d?.['Runs'] || '-'}</td>
        <td class="Balls">${d?.['Balls'] || '-'}</td>
        <td class="OutAs">${d?.['OutAs'] || '-'}</td>

        <td class="d-none Fours">${d?.['Fours'] || '0'}</td>
        <td class="d-none Sixes">${d?.['Sixes'] || '0'}</td>
        <td class="d-none Good">${d?.['Good'] || '-'}</td>
        <td class="d-none Improve">${d?.['Improve'] || '-'}</td>
        <td class="d-none Comment">${d?.['Comment'] || '-'}</td>
        <td class="d-none ScoreCard">${d?.['ScoreCard'] || '-'}</td>
      `;

    // Generate datalist with unique values
    Object.keys(d).forEach(key => {
      if (!battingDataLists.hasOwnProperty(key)) {
        battingDataLists[key] = new Set()
      }
      battingDataLists[key].add(d[key]);     
    });

    row.addEventListener('click', () => battingRowClick(row))
    dataBody.appendChild(row);
  });

  // Fill the datalists with values
  Object.keys(battingDataLists).forEach(field => {
    const id = field.charAt(0).toLowerCase() + field.slice(1) + "List"
    const datalist = battingModal.querySelector('#' + id)
    if (datalist) {
      datalist.innerHTML = "";
      // Generate options based on data
      battingDataLists[field].forEach(function(d) {
        var optionElement = document.createElement("option");
        optionElement.value = d;
        datalist.appendChild(optionElement);
      }); 
    }
  })

  const options = {
    "valueNames":[ "Date", "Tournament", "PlayedFor","PlayedAgainst", "Venue","TotalOvers",
      "Runs","Balls","OutAs"] ,"page": 15, "pagination":true
  }
  new List('battingTable', options)
}

function battingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    scoreCard: row.querySelector('.ScoreCard').textContent,
    tournament: row.querySelector('.Tournament').textContent,
    playedFor: row.querySelector('.PlayedFor').textContent,
    playedAgainst: row.querySelector('.PlayedAgainst').textContent,
    venue: row.querySelector('.Venue').textContent,
    totalOvers: row.querySelector('.TotalOvers').textContent,
    runs: row.querySelector('.Runs').textContent,
    fours: row.querySelector('.Fours').textContent,
    sixes: row.querySelector('.Sixes').textContent,
    balls: row.querySelector('.Balls').textContent,
    outAs: row.querySelector('.OutAs').textContent,
    good: row.querySelector('.Good').textContent,
    improve: row.querySelector('.Improve').textContent,
    comment: row.querySelector('.Comment').textContent,
  };

  const selectors = Object.keys(rowData);

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const input = battingModal.querySelector('#' + selector + 'Input')
    input.value = rowData?.[selector] || '';
    input.disabled = !(isUserLoggedIn() && isUserOwnProfile(userId));
  }

  battingModal.querySelector('#scoreLink').href = rowData?.scoreCard;
  
  const modal = new bootstrap.Modal(battingModal);
  modal.show();
};

function saveBattingData() {
  const rowData = {};
  const inputFields = [
    ...battingModal.querySelectorAll('input'),
    ...battingModal.querySelectorAll('textarea')
  ];

  for (let i = 0; i < inputFields.length; i++) {
    const inputId = inputFields[i].id.replace('Input', '')
    const key = inputId.charAt(0).toUpperCase() + inputId.slice(1)
    rowData[key] = inputFields[i].value;
  }
  if (rowData?.Id) delete rowData.Id
  let id = battingModal.querySelector('#idInput').value.trim()
  if (!id || id == '') {
    id = Date.now()
  }
  if (isUserLoggedIn && isUserOwnProfile(userId)) {
    const path = `players/${userId}/Batting/${id}`;
    updateOrAddBodyAtPath(path, rowData)
  }
}

/**
 * ------------------------------------------------
 * Practise Batting
 * ------------------------------------------------
 */
function updatePractiseBattingData(data) {
  if (!data || !Object.keys(data).length) return
  // Get a reference to the table body element
  var dataBody = document.getElementById("practiseBattingTableBody");
  dataBody.innerHTML = "";  

  const practiseBattingDataLists = {}

  // Iterate over the data and create table rows
  Object.keys(data).forEach(id => {
    const d = data[id];
    var row = document.createElement("tr");
    row.id = id;
    row.innerHTML = `
        <td class="Date">${d?.['Date'] || '-'}</td>
        <td class="Venue">${d?.['Venue'] || '-'}</td>
        <td class="Balls">${d?.['Balls'] || '-'}</td>
        <td class="Defended">${d?.['Defended'] || '-'}</td>
        <td class="Attacked">${d?.['Attacked'] || '-'}</td>
        <td class="Middled">${d?.['Middled'] || '-'}</td>
        <td class="Notes">${d['Notes'] || '-'}</td>
      `;

    // Generate datalist with unique values
    Object.keys(d).forEach(key => {
      if (!practiseBattingDataLists.hasOwnProperty(key)) {
        practiseBattingDataLists[key] = new Set()
      }
      practiseBattingDataLists[key].add(d[key]);     
    });

    row.addEventListener('click', () => practiseBattingRowClick(row))
    dataBody.appendChild(row);
  });

  // Fill the datalists with values
  Object.keys(practiseBattingDataLists).forEach(field => {
    const id = field.charAt(0).toLowerCase() + field.slice(1) + "List"
    const datalist = battingModal.querySelector('#' + id)
    if (datalist) {
      datalist.innerHTML = "";
      // Generate options based on data
      practiseBattingDataLists[field].forEach(function(d) {
        var optionElement = document.createElement("option");
        optionElement.value = d;
        datalist.appendChild(optionElement);
      }); 
    }
  })

  const options = {
    "valueNames":[ "Date", "Venue", "Balls", "Defended","Attacked","Middled","Notes"] ,"page": 15, "pagination":true
  }
  new List('praticeBattingTable', options)
}

function practiseBattingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    venue: row.querySelector('.Venue').textContent,
    balls: row.querySelector('.Balls').textContent,
    defended: row.querySelector('.Defended').textContent,
    attacked: row.querySelector('.Attacked').textContent,
    middled: row.querySelector('.Middled').textContent,
    notes: row.querySelector('.Notes').textContent
  };
  console.log(rowData)

  const selectors = Object.keys(rowData);

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    console.log(selector)
    const input = practiseBattingModal.querySelector('#' + selector + 'Input')
    input.value = rowData?.[selector] || '';
    input.disabled = !(isUserLoggedIn() && isUserOwnProfile(userId));
  }

  const modal = new bootstrap.Modal(practiseBattingModal);
  modal.show();
};

function savePractiseBattingData() {
  const rowData = {};
  const inputFields = [
    ...practiseBattingModal.querySelectorAll('input'),
    ...practiseBattingModal.querySelectorAll('textarea')
  ];

  for (let i = 0; i < inputFields.length; i++) {
    const inputId = inputFields[i].id.replace('Input', '')
    const key = inputId.charAt(0).toUpperCase() + inputId.slice(1)
    rowData[key] = inputFields[i].value;
  }
  if (rowData?.Id) delete rowData.Id
  let id = practiseBattingModal.querySelector('#idInput').value.trim()
  if (!id || id == '') {
    id = Date.now()
  }
  if (isUserLoggedIn && isUserOwnProfile(userId)) {
    const path = `players/${userId}/PractiseBatting/${id}`;
    updateOrAddBodyAtPath(path, rowData)
  }
}

/**
 * ------------------------------------------------
 * Bowling
 * ------------------------------------------------
 */
function updateBowlingData(data) {
  if (!data || !Object.keys(data).length) return
  // Get a reference to the table body element
  var dataBody = document.getElementById("bowlingTableBody");
  dataBody.innerHTML = "";

  const bowlingDataLists = {}
  
  // Iterate over the data and create table rows
  Object.keys(data).forEach(id => {
    const d = data[id];
    var row = document.createElement("tr");
    row.id = id;
    row.innerHTML = `
        <td class="Date">${d['Date'] || '-'}</td>
        <td class="Tournament">${d['Tournament'] || '-'}</td>
        <td class="PlayedFor">${d['PlayedFor'] || '-'}</td>
        <td class="PlayedAgainst">${d['PlayedAgainst'] || '-'}</td>
        <td class="Venue">${d['Venue'] || '-'}</td>
        <td class="TotalOvers">${d['TotalOvers'] || '-'}</td>
        <td class="Overs">${d['Overs'] || '-'}</td>
        <td class="Maiden">${d['Maiden'] || '-'}</td>
        <td class="Runs">${d['Runs'] || '-'}</td>
        <td class="Wickets">${d['Wickets'] || '-'}</td>
        <td class="Wides">${d['Wides'] || '-'}</td>
        <td class="NoBalls">${d['NoBalls'] || '-'}</td>

        <td class="d-none Good">${d['Good'] || '-'}</td>
        <td class="d-none Improve">${d['Improve'] || '-'}</td>
        <td class="d-none Comment">${d['Comment'] || '-'}</td>
        <td class="d-none ScoreCard">${d['ScoreCard'] || '-'}</td>
      `;

    // Generate datalist with unique values
    Object.keys(d).forEach(key => {
      if (!bowlingDataLists.hasOwnProperty(key)) {
        bowlingDataLists[key] = new Set()
      }
      bowlingDataLists[key].add(d[key]);     
    });

    row.addEventListener('click', () => bowlingRowClick(row))
    dataBody.appendChild(row);
  });

  // Fill the datalists with values
  Object.keys(bowlingDataLists).forEach(field => {
    const id = field.charAt(0).toLowerCase() + field.slice(1) + "BowlingList"
    const datalist = bowlingModal.querySelector('#' + id)
    if (datalist) {
      datalist.innerHTML = "";
      // Generate options based on data
      bowlingDataLists[field].forEach(function(d) {
        var optionElement = document.createElement("option");
        optionElement.value = d;
        datalist.appendChild(optionElement);
      }); 
    }
  })  

  const options = {
    "valueNames":[ "Date", "Tournament", "PlayedFor", "PlayedAgainst", 
    "Venue", "TotalOvers", "Overs", "Maiden", "Runs", "Wickets", "Wides", 
    "NoBalls"],
    "page": 15, "pagination":true
  }
  new List('bowlingTable', options)
}

function bowlingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    scoreCard: row.querySelector('.ScoreCard').textContent,    
    tournament: row.querySelector('.Tournament').textContent,
    playedFor: row.querySelector('.PlayedFor').textContent,
    playedAgainst: row.querySelector('.PlayedAgainst').textContent,
    venue: row.querySelector('.Venue').textContent,
    totalOvers: row.querySelector('.TotalOvers').textContent,
    overs: row.querySelector('.Overs').textContent,
    maiden: row.querySelector('.Maiden').textContent,
    runs: row.querySelector('.Runs').textContent,
    wickets: row.querySelector('.Wickets').textContent,
    wides: row.querySelector('.Wides').textContent,
    noBalls: row.querySelector('.NoBalls').textContent,
    good: row.querySelector('.Good').textContent,
    improve: row.querySelector('.Improve').textContent,
    comment: row.querySelector('.Comment').textContent,
  };

  const selectors = Object.keys(rowData);

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const input = bowlingModal.querySelector('#' + selector + 'Input')
    input.value = rowData?.[selector] || '';
    input.disabled = !(isUserLoggedIn() && isUserOwnProfile(userId));
  }

  bowlingModal.querySelector('#scoreLink').href = rowData?.scoreCard;
  
  const modal = new bootstrap.Modal(bowlingModal);
  modal.show();
}

function saveBowlingData() {
  const rowData = {};
  const inputFields = [
    ...bowlingModal.querySelectorAll('input'),
    ...bowlingModal.querySelectorAll('textarea')
  ];

  for (let i = 0; i < inputFields.length; i++) {
    const inputId = inputFields[i].id.replace('Input', '')
    const key = inputId.charAt(0).toUpperCase() + inputId.slice(1)
    rowData[key] = inputFields[i].value;
  }
  if (rowData?.Id) delete rowData.Id
  let id = bowlingModal.querySelector('#idInput').value.trim()
  if (!id || id == '') {
    id = Date.now()
  }
  if (isUserLoggedIn && isUserOwnProfile(userId)) {
    const path = `players/${userId}/Bowling/${id}`;
    updateOrAddBodyAtPath(path, rowData)
  }
}

/**
 * ------------------------------------------------
 * Practise Bowling
 * ------------------------------------------------
 */
function updatePractiseBowlingData(data) {
  if (!data || !Object.keys(data).length) return
  // Get a reference to the table body element
  var dataBody = document.getElementById("practiseBowlingTableBody");
  dataBody.innerHTML = "";

  const PractiseBowlingDataLists = {}
  
  // Iterate over the data and create table rows
  Object.keys(data).forEach(id => {
    const d = data[id];
    var row = document.createElement("tr");
    row.id = id;
    row.innerHTML = `
        <td class="Date">${d['Date'] || '-'}</td>
        <td class="Venue">${d['Venue'] || '-'}</td>
        <td class="Balls">${d['Balls'] || '-'}</td>
        <td class="Accurate">${d['Accurate'] || '-'}</td>
        <td class="Notes">${d['Notes'] || '-'}</td>
      `;

    // Generate datalist with unique values
    Object.keys(d).forEach(key => {
      if (!PractiseBowlingDataLists.hasOwnProperty(key)) {
        PractiseBowlingDataLists[key] = new Set()
      }
      PractiseBowlingDataLists[key].add(d[key]);     
    });

    row.addEventListener('click', () => practiseBowlingRowClick(row))
    dataBody.appendChild(row);
  });

  // Fill the datalists with values
  Object.keys(PractiseBowlingDataLists).forEach(field => {
    const id = field.charAt(0).toLowerCase() + field.slice(1) + "PractiseBowlingList"
    const datalist = practiseBowlingModal.querySelector('#' + id)
    if (datalist) {
      datalist.innerHTML = "";
      // Generate options based on data
      PractiseBowlingDataLists[field].forEach(function(d) {
        var optionElement = document.createElement("option");
        optionElement.value = d;
        datalist.appendChild(optionElement);
      }); 
    }
  })  

  const options = {
    "valueNames":[ "Date", "Venue", "Balls", "Accurate","Notes"],
    "page": 15, "pagination":true
  }
  new List('practiseBowlingTable', options)
}

function practiseBowlingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    venue: row.querySelector('.Venue').textContent,
    balls: row.querySelector('.Balls').textContent,
    accurate: row.querySelector('.Accurate').textContent,
    notes: row.querySelector('.Notes').textContent
  };

  const selectors = Object.keys(rowData);

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const input = practiseBowlingModal.querySelector('#' + selector + 'Input')
    input.value = rowData?.[selector] || '';
    input.disabled = !(isUserLoggedIn() && isUserOwnProfile(userId));
  }

  const modal = new bootstrap.Modal(practiseBowlingModal);
  modal.show();
}

function savePractiseBowlingData() {
  const rowData = {};
  const inputFields = [
    ...practiseBowlingModal.querySelectorAll('input'),
    ...practiseBowlingModal.querySelectorAll('textarea')
  ];

  for (let i = 0; i < inputFields.length; i++) {
    const inputId = inputFields[i].id.replace('Input', '')
    const key = inputId.charAt(0).toUpperCase() + inputId.slice(1)
    rowData[key] = inputFields[i].value;
  }
  if (rowData?.Id) delete rowData.Id
  let id = practiseBowlingModal.querySelector('#idInput').value.trim()
  if (!id || id == '') {
    id = Date.now()
  }
  if (isUserLoggedIn && isUserOwnProfile(userId)) {
    const path = `players/${userId}/PractiseBowling/${id}`;
    updateOrAddBodyAtPath(path, rowData)
  }
}

/**
 * ------------------------------------------------
 * Profile
 * ------------------------------------------------
 */

function updatePlayerDetails(data) {
  if (!data) return
  // Get a reference to the table body element
  var playerName = document.getElementById("playerName");
  playerName.innerHTML = data?.name || 'No Name'

  if (isUserLoggedIn() && isUserOwnProfile(userId)) {
    newBattingButton.classList.remove('d-none')
    newBowlingButton.classList.remove('d-none')
    newPractiseBattingButton.classList.remove('d-none')
    newPractiseBowlingButton.classList.remove('d-none')    
  }   
}

function computeStats(data) {
  // Batting
  if (data?.Batting && data?.Batting?.length) {
    const batting = data?.Batting
    const totalRuns = batting.reduce((total, x) => total + (x?.Runs || 0), 0);
    const battingStats = {
      Matches: batting?.length || 0,
      Innings: batting?.length || 0,
      "Not Out": batting.filter(x => !x?.OutAs)?.length || 0,
      Runs: batting.reduce((t, x) => t + (x?.Runs || 0), 0),
      "Highest Runs": batting.reduce((t, x) => Math.max(t, (x?.Runs || 0)), 0),
      "Avg Runs": parseInt(totalRuns/batting.length),
      Ducks: batting.filter(x => (x?.Runs || 0) == 0)?.length || 0,
      "30s": batting.filter(x => (x?.Runs || 0) >= 30 && (x?.Runs || 0) <= 49)?.length || 0,
      "50s": batting.filter(x => (x?.Runs || 0) >= 50 && (x?.Runs || 0) <= 99)?.length || 0,
      "100s": batting.filter(x => (x?.Runs || 0) >=  100)?.length || 0
    }

    battingStatsRow.innerHTML = ""
    Object.keys(battingStats).forEach(st => {
      const newStat = statsTemplate.format(battingStats[st], st)
      battingStatsRow.innerHTML += newStat
    })
  }

  // Bowling
  if (data?.Bowling && data?.Bowling?.length) {
    const bowling = data?.Bowling
    const totalRuns = bowling.reduce((total, x) => total + (x?.Runs || 0), 0);
    const bowlingStats = {
      Matches: bowling?.length || 0,
      Innings: bowling?.length || 0,
      Overs: bowling.reduce((t, x) => t + (x?.Overs || 0), 0),
      Maidens: bowling.reduce((t, x) => t + (x?.Maiden || 0), 0),
      Wickets: bowling.reduce((t, x) => t + (x?.Wickets || 0), 0),
      Runs: bowling.reduce((t, x) => t + (x?.Runs || 0), 0),
      "Avg Runs": parseInt(totalRuns/bowling.length),
      Wides: bowling.reduce((t, x) => t + (x?.Wides || 0), 0),
      "No Balls": bowling.reduce((t, x) => t + (x?.NoBalls || 0), 0),
    }

    bowlingStatsRow.innerHTML = ""
    Object.keys(bowlingStats).forEach(st => {
      const newStat = statsTemplate.format(bowlingStats[st], st)
      bowlingStatsRow.innerHTML += newStat
    })
  }
}

/**
 * ------------------------------------------------
 * Helpers
 * ------------------------------------------------
 */

function showFreshModal(modalElement) {
  const inputFields = [
    ...modalElement.querySelectorAll('input'),
    ...modalElement.querySelectorAll('select'),
    ...modalElement.querySelectorAll('textarea')
  ];

  // Reset the input fields and enable/disable them
  for (let i = 0; i < inputFields.length; i++) {
    const input = inputFields[i];
    input.value = '';
    input.disabled = false;
  }

  modalElement.querySelector("#scoreLink")?.removeAttribute("href");

  // Show the modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

function deleteData(type) {
  let modalElement;
  switch (type) {
    case 'Batting': modalElement = battingModal; break;
    case 'PractiseBatting': modalElement = practiseBattingModal; break;
    case 'Bowling': modalElement = bowlingModal; break;
    case 'PractiseBowling': modalElement = practiseBowlingModal; break;
  }
  if (!modalElement) return
  if (confirm("Are you sure you want to delete this entry?")) {
    const id = modalElement.querySelector('#idInput').value.trim()
    console.log("I am id - " + id);
    if (!id || !id.length) return
    const path = `players/${userId}/${type}/${id}`;
    removeDataFromFirebase(path)    
  }
}

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};
