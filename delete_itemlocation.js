
function deleteItemLocationJS(IDItemLocation) {
    let link = '/delete-itemLocation';
    let data = {
      id: IDItemLocation
    };
    // console.log(link, data, data.id)

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDItemLocation);
        window.location.reload();

      }
    });

}
function deleteRow(IDItemLocation){

    let table = document.getElementById("itemlocations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDItemLocation) {
            table.deleteRow(i);
            break;
       }
    }

}