let updateGenreForm = document.getElementById('UpdateGenre');
// Modify the objects we need
updateGenreForm.addEventListener("submit", function (e) {
    e.preventDefault();    
    let IDGenre = document.getElementById("oldGenre");
    let newgenre = document.getElementById("updateGenre");
    let link = '/put-genre-ajax';

    if(newgenre.value === ""){
        return}

    // Put our data we want to send in a javascript object
    let data = {
        IDGenre: IDGenre.value,
        NewGenre: newgenre.value,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", link, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, IDGenre.value);
            window.location.reload();


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});


function updateRow(data, IDGenre){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("genre-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDGenre) {

            // Get the location of the row where we found the matching IDGenre
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of  genre
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign email to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}