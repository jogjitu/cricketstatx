// const urlParams = new URLSearchParams(window.location.search);
// const userId = urlParams.get('userId');
const userId = 'M37OoDqikMP5v1y1WNiLGPZ8PJB3'

const battingModal = document.getElementById('battingInsightsModal');
const bowlingModal = document.getElementById('bowlingInsightsModal');

const newBattingButton = document.getElementById('newBattingButton')
const newBowlingButton = document.getElementById('newBowlingButton')

/**
 * ------------------------------------------------
 * Event Listeners
 * ------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => getUserData(userId));

newBattingButton.addEventListener('click', () => showFreshModal(battingModal))
newBowlingButton.addEventListener('click', () => showFreshModal(bowlingModal))

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
    updatePlayerDetails(data?.details)
    updateBattingData(data?.Batting)
    updateBowlingData(data?.Bowling)
  })

  if (isUserLoggedIn() && isUserOwnProfile(userId)) {
    newBattingButton.classList.remove('d-none')
    newBowlingButton.classList.remove('d-none')
  }  
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

        <td class="d-none Good">${d?.['Good'] || '-'}</td>
        <td class="d-none Improve">${d?.['Improve'] || '-'}</td>
        <td class="d-none Comment">${d?.['Comment'] || '-'}</td>
        <td class="d-none ScoreLink">${d?.['ScoreLink'] || '-'}</td>
      `;
    row.addEventListener('click', () => battingRowClick(row))
    dataBody.appendChild(row);
  });

  const options = {
    "valueNames":[ "Date", "Tournament", "PlayedFor","PlayedAgainst", "Venue","TotalOvers",
      "Runs","Balls","OutAs","Good","Improve","Comment","ScoreLink"
    ] ,"page": 15, "pagination":true
  }
  new List('battingTable', options)
}

function battingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    scoreCard: row.querySelector('.ScoreLink').textContent,
    tournament: row.querySelector('.Tournament').textContent,
    playedFor: row.querySelector('.PlayedFor').textContent,
    playedAgainst: row.querySelector('.PlayedAgainst').textContent,
    venue: row.querySelector('.Venue').textContent,
    totalOvers: row.querySelector('.TotalOvers').textContent,
    runs: row.querySelector('.Runs').textContent,
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
  delete rowData[id]
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
 * Bowling
 * ------------------------------------------------
 */
function updateBowlingData(data) {
  if (!data || !Object.keys(data).length) return
  // Get a reference to the table body element
  var dataBody = document.getElementById("bowlingTableBody");
  dataBody.innerHTML = "";
  
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
        <td class="d-none ScoreLink">${d['ScoreLink'] || '-'}</td>
      `;
    row.addEventListener('click', () => bowlingRowClick(row))
    dataBody.appendChild(row);
  });

  const options = {
    "valueNames":[ "Date", "Tournament", "PlayedFor", "PlayedAgainst", 
    "Venue", "TotalOvers", "Overs", "Maiden", "Runs", "Wickets", "Wides", 
    "NoBalls", "Good", "Improve", "Comment", "ScoreLink"],
    "page": 15, "pagination":true
  }
  new List('bowlingTable', options)
}

function bowlingRowClick(row) {
  const rowData = {
    id: row.id,
    date: row.querySelector('.Date').textContent,
    scoreCard: row.querySelector('.ScoreLink').textContent,    
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
  delete rowData[id]
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
 * Profile
 * ------------------------------------------------
 */

function updatePlayerDetails() {
  // Get a reference to the table body element
  var playerName = document.getElementById("playerName");

  // Getting batting data from local storage
  const data = JSON.parse(localStorage.getItem("details"));
  if (!data) return
  playerName.innerHTML = data?.name || 'No Name'
}

/**
 * ------------------------------------------------
 * Helpers
 * ------------------------------------------------
 */

function showFreshModal(modalElement) {
  const inputFields = [
    ...modalElement.querySelectorAll('input'),
    ...modalElement.querySelectorAll('textarea')
  ];

  // Reset the input fields and enable/disable them
  for (let i = 0; i < inputFields.length; i++) {
    const input = inputFields[i];
    input.value = '';
    input.disabled = false;
  }

  // Show the modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

function deleteData(type) {
  let modalElement;
  switch (type) {
    case 'batting': modalElement = battingModal; break;
    case 'bowling': modalElement = bowlingModal; break;
  }
  if (!modalElement) return

  const id = modalElement.querySelector('#idInput').value.trim()
  if (!id || !id.length) return
  const path = `players/${userId}/Batting/${id}`;
  removeDataFromFirebase(path)
}
