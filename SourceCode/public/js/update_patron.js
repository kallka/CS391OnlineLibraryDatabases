// Get the objects we need to modify
let updatePatronForm = document.getElementById('UpdatePatron');
// Modify the objects we need
updatePatronForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("SelectName");
    let updateEmail = document.getElementById("input-email");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let updateEmailValue = updateEmail.value;



    // UP UNTIL THIS POINT, the code works


    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    // console.log(fullNameValue, updateEmailValue)



    if(updateEmailValue === ""){
        return}
    // if (isNaN(updateEmailValue)) 
    // {
    //     return
    // };
    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        email: updateEmailValue,
    };
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // console.log(data.fullname)
    xhttp.open("PUT", "/put-patron-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);
            window.location.reload();


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
    console.log('updateRow', personID, data)
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("patron-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of email value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign email to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}