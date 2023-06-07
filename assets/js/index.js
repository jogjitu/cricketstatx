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
        <td class="Good">${d['Good']}</td>
        <td class="Improve">${d['Improve']}</td>
        <td class="Comment">${d['Comment']}</td>
        <td class="ScoreLink">${d['ScoreLink']}</td>
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
        <td class="Good">${d['Good']}</td>
        <td class="Improve">${d['Improve']}</td>
        <td class="Comment">${d['Comment']}</td>
        <td class="ScoreLink">${d['ScoreLink']}</td>
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
