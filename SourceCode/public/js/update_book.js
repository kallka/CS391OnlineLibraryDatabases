// Get the objects we need to modify
let updateBookForm = document.getElementById('UpdateBook');
// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

// function editBookJS(SelectBook, RevisedAuthor, RevisedGenre){
    let SelectBook = document.getElementById("input-BookID");
    let RevisedAuthor = document.getElementById("input-BookAuthorID");
    let RevisedGenre = document.getElementById("input-BookGenreID")
    let link = '/put-book-ajax';
    let data = {
        BookID: SelectBook.value,
        AuthorID: RevisedAuthor.value,
        GenreID: RevisedGenre.value
    };


    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", link, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log('input1',xhttp.response)
            updateRow(xhttp.response, SelectBook.value);
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});


function updateRow(data, IDBook){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("book-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDBook) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of email value
            let td = updateRowIndex.getElementsByTagName("td")[1];
            // Reassign email to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}