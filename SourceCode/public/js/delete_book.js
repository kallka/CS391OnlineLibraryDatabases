function deleteBookJS(IDBook) {
    let link = '/delete-book';
    let data = {
      id: IDBook
    };
    console.log(link, data, data.id)


    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        console.log('DELETE!')
        deleteRow(IDBook);
        window.location.reload();

      }
    });


};
function deleteRow(IDBook){

    let table = document.getElementById("book-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDBook) {
            table.deleteRow(i);
            break;
       }
    }
    window.location.reload();

};