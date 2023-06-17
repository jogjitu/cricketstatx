function getAllPlayers() {
  // Get a reference to the Firebase Realtime Database root node
  var databaseRef = database.ref(`players/`);
  databaseRef.once("value", snapshot => {
    const data = snapshot.val();
    updateAllPlayers(data)
  })
}

function updateAllPlayers(data) {
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