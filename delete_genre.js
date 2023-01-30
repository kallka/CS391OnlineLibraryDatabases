
function deleteGenreJS(IDGenre) {
    let link = '/delete-genre';
    let data = {
      id: IDGenre
    };

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDGenre);
        window.location.reload();

      }
    });

}
function deleteRow(IDGenre){

    let table = document.getElementById("genre-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDGenre) {
            table.deleteRow(i);
            break;
       }
    }

}