function getUserData(userId = 'M37OoDqikMP5v1y1WNiLGPZ8PJB3') {
  // Get a reference to the Firebase Realtime Database root node
  var databaseRef = database.ref(`players/${userId}`);
  databaseRef.once("value", snapshot => {
    const data = snapshot.val();
    localStorage.setItem("details", JSON.stringify(data?.details))
    localStorage.setItem("batting", JSON.stringify(data?.Batting))
    localStorage.setItem("bowling", JSON.stringify(data?.Bowling))

    updatePlayerDetails()
    updateBattingData()
    updateBowlingData()
  })
}

function updatePlayerDetails() {
  // Get a reference to the table body element
  var playerName = document.getElementById("playerName");

  // Getting batting data from local storage
  const data = JSON.parse(localStorage.getItem("details"));
  if (!data) return
  playerName.innerHTML = data?.name || 'No Name'
}

function updateBattingData() {
  // Get a reference to the table body element
  var dataBody = document.getElementById("battingTableBody");
  dataBody.innerHTML = "";

  // Getting batting data from local storage
  const data = JSON.parse(localStorage.getItem("batting"));
  if (!data || !data.length) return

  // Iterate over the data and create table rows
  data.forEach(d => {
    var row = document.createElement("tr");
    row.innerHTML = `
        <td class="SrNo">${d['SrNo']}</td>
        <td class="Date">${d['Date']}</td>
        <td class="PlayedFor">${d['PlayedFor']}</td>
        <td class="PlayedAgainst">${d['PlayedAgainst']}</td>
        <td class="Venue">${d['Venue']}</td>
        <td class="TotalOvers">${d['TotalOvers']}</td>
        <td class="Runs">${d['Runs']}</td>
        <td class="Balls">${d['Balls']}</td>
        <td class="OutAs">${d['OutAs']}</td>
        <td class="text-nowrap">
          <i style="cursor: pointer" class="me-2 bi bi-pencil-fill"></i>
          <i style="cursor: pointer" class="me-2 bi bi-eye-fill" onclick="battingIconClick(this)"></i>
          <i style="cursor: pointer" class="bi bi-trash-fill"></i>
        </td>

        <td class="d-none Good">${d['Good']}</td>
        <td class="d-none Improve">${d['Improve']}</td>
        <td class="d-none Comment">${d['Comment']}</td>
        <td class="d-none ScoreLink">${d['ScoreLink']}</td>
      `;
    dataBody.appendChild(row);
  });

  const options = {
    "valueNames":[ "SrNo", "Date","PlayedFor","PlayedAgainst","Venue","TotalOvers",
      "Runs","Balls","OutAs","Good","Improve","Comment","ScoreLink"
    ] ,"page": 15, "pagination":true
  }
  new List('battingTable', options)
}

function updateBowlingData() {
  // Get a reference to the table body element
  var dataBody = document.getElementById("bowlingTableBody");
  dataBody.innerHTML = "";

  // Getting bowling data from local storage
  const data = JSON.parse(localStorage.getItem("bowling"));
  if (!data || !data.length) return

  // Iterate over the data and create table rows
  data.forEach(d => {
    var row = document.createElement("tr");
    row.innerHTML = `
        <td class="SrNo">${d['SrNo']}</td>
        <td class="Tournament">${d['Tournament']}</td>
        <td class="Date">${d['Date']}</td>
        <td class="PlayedFor">${d['PlayedFor']}</td>
        <td class="PlayedAgainst">${d['PlayedAgainst']}</td>
        <td class="Venue">${d['Venue']}</td>
        <td class="TotalOvers">${d['TotalOvers']}</td>
        <td class="Overs">${d['Overs']}</td>
        <td class="Maiden">${d['Maiden']}</td>
        <td class="Runs">${d['Runs']}</td>
        <td class="Wickets">${d['Wickets']}</td>
        <td class="Wides">${d['Wides']}</td>
        <td class="NoBalls">${d['NoBalls']}</td>

        <td class="text-nowrap">
          <i style="cursor: pointer" class="me-2 bi bi-pencil-fill"></i>
          <i style="cursor: pointer" class="me-2 bi bi-eye-fill" onclick="bowlingIconClick(this)"></i>
          <i style="cursor: pointer" class="bi bi-trash-fill"></i>
        </td>

        <td class="d-none Good">${d['Good']}</td>
        <td class="d-none Improve">${d['Improve']}</td>
        <td class="d-none Comment">${d['Comment']}</td>
        <td class="d-none ScoreLink">${d['ScoreLink']}</td>
      `;
    dataBody.appendChild(row);
  });

  const options = {
    "valueNames":[ "SrNo", "Tournament", "Date", "PlayedFor", "PlayedAgainst", 
    "Venue", "TotalOvers", "Overs", "Maiden", "Runs", "Wickets", "Wides", 
    "NoBalls", "Good", "Improve", "Comment", "ScoreLink"],
    "page": 15, "pagination":true
  }
  new List('bowlingTable', options)
}

document.addEventListener('DOMContentLoaded', () => getUserData());


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

function battingIconClick(icon) {
  const row = icon.closest('tr');

  const rowData = {
    srNo: row.querySelector('.SrNo').textContent,
    date: row.querySelector('.Date').textContent,
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
    scoreCard: row.querySelector('.ScoreLink').textContent,
  };

  const modalElement = document.getElementById('battingInsightsModal');
  modalElement.querySelector('#srNoInput').value = rowData.srNo;
  modalElement.querySelector('#dateInput').value = rowData.date;
  modalElement.querySelector('#scoreCard').value = rowData.scoreCard;
  modalElement.querySelector('#playedForInput').value = rowData.playedFor;
  modalElement.querySelector('#playedAgainstInput').value = rowData.playedAgainst;
  modalElement.querySelector('#venueInput').value = rowData.venue;
  modalElement.querySelector('#totalOversInput').value = rowData.totalOvers;
  modalElement.querySelector('#runsInput').value = rowData.runs;
  modalElement.querySelector('#ballsInput').value = rowData.balls;
  modalElement.querySelector('#outAsInput').value = rowData.outAs;
  modalElement.querySelector('#goodInput').value = rowData.good;
  modalElement.querySelector('#improveInput').value = rowData.improve;
  modalElement.querySelector('#commentInput').value = rowData.comment;
  
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
};


function bowlingIconClick(icon) {
  const row = icon.closest('tr');

  const rowData = {
    srNo: row.querySelector('.SrNo').textContent,
    tournament: row.querySelector('.Tournament').textContent,
    date: row.querySelector('.Date').textContent,
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
    scoreCard: row.querySelector('.ScoreLink').textContent,    
  };

  const modalElement = document.getElementById('bowlingInsightsModal');
  modalElement.querySelector('#srNoInput').value = rowData.srNo;
  modalElement.querySelector('#tournamentInput').value = rowData.tournament;
  modalElement.querySelector('#dateInput').value = rowData.date;
  modalElement.querySelector('#scoreCard').value = rowData.scoreCard;
  modalElement.querySelector('#playedForInput').value = rowData.playedFor;
  modalElement.querySelector('#playedAgainstInput').value = rowData.playedAgainst;
  modalElement.querySelector('#venueInput').value = rowData.venue;
  modalElement.querySelector('#totalOversInput').value = rowData.totalOvers;
  modalElement.querySelector('#oversInput').value = rowData.overs;
  modalElement.querySelector('#maidenInput').value = rowData.maiden;
  modalElement.querySelector('#runsInput').value = rowData.runs;
  modalElement.querySelector('#wicketsInput').value = rowData.wickets;
  modalElement.querySelector('#widesInput').value = rowData.wides;
  modalElement.querySelector('#noBallsInput').value = rowData.noBalls;
  modalElement.querySelector('#goodInput').value = rowData.good;
  modalElement.querySelector('#improveInput').value = rowData.improve;
  modalElement.querySelector('#commentInput').value = rowData.comment;

  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}
