let updateOnlineLibraryForm = document.getElementById('UpdateLibrary');
// Modify the objects we need
updateOnlineLibraryForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();    
    console.log('YES')
    let oldLibraryName = document.getElementById("SelectLibrary");
    let newLibraryName = document.getElementById("RevisedName");
    let link = '/put-onlinelibrary-ajax'
    console.log('old, new',oldLibraryName, newLibraryName)



    if(newLibraryName.value === ""){
        return}

    let data = {
        oldLibraryName: oldLibraryName.value,
        newLibraryName: newLibraryName.value,
    };
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    console.log('new', data.newLibraryName)
    xhttp.open("PUT", "/put-onlinelibrary-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log('input1',xhttp.response)
            updateRow(xhttp.response, oldLibraryName.value);
            window.location.reload();


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, IDlibrary){
    console.log('updateRow', IDlibrary, data)
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("onlinelibraries-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDlibrary) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of email value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign email to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}