function deleteOnlineLibraryJS(IDOnlineLibrary) {
    let link = '/delete-onlinelibrary';
    let data = {
      id: IDOnlineLibrary
    };
    console.log(data.id)
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDOnlineLibrary);
        window.location.reload();

      }
    });

}
function deleteRow(IDOnlineLibrary){
    let table = document.getElementById("onlinelibraries-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDOnlineLibrary) {
            table.deleteRow(i);
            break;
       }
    }

}