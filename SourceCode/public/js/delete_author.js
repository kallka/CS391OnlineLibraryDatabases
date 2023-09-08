
function deleteAuthorJS(IDAuthor) {
    let link = '/delete-author';
    let data = {
      id: IDAuthor
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDAuthor);
        window.location.reload();

      }
    });

}
function deleteRow(IDAuthor){

    let table = document.getElementById("author-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDAuthor) {
            table.deleteRow(i);
            break;
       }
    }

}