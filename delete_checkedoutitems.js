
function deleteCheckedOutItemsJS(IDCheckedOutItem) {
    let link = '/delete-checkoutdetail';
    let data = {
      id: IDCheckedOutItem
    };
    console.log(link, data, data.id)

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(IDCheckedOutItem);
        window.location.reload();

      }
    });

};
function deleteRow(IDCheckedOutItem){

    let table = document.getElementById("checkedoutitems-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDCheckedOutItem) {
            table.deleteRow(i);
            break;
       }
    }

};