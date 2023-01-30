
function deletePatron(IDPatron) {
    let link = '/delete-patron';
    let data = {
      id: IDPatron
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDPatron);
        window.location.reload();

      }
    });

}
function deleteRow(IDPatron){

    let table = document.getElementById("patron-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDPatron) {
            table.deleteRow(i);
            break;
       }
    }

}