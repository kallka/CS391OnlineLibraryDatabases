/* CITATION:
Code taken per video directions from Professor Curry in Module 1, Assignment 2, CS 340. 


/*
SETUP (for a simple web app)
*/


// Express
var express = require('express'); // We are using the express library for the web server
var bodyParser = require('body-parser');
var app = express(); // We need to instantiate an express object to interact with the server in our code
//Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars'); // Import express-handlebars
// app.engine('.hbs', engine({extname: ".hbs"})); // Create an instance of the handlebars engine to process templates

app.engine('.hbs', engine({ 
  extname: ".hbs", defaultLayout: "main"}));  
  //layoutsDir: ___dirname + './views/layouts', 
  //partialsDir: ___dirname + './views/partials'})); // Create an instance of the handlebars engine to process templates 
app.set('view engine', '.hbs');


//Supposed to connect to public directory
PORT = 60250; // Valid - 1024-65535, Set a port number at the top so it's easy to change in the future
const path = require('path');

// Database Connector
const db = require('./database/db-connector.js')

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));


/*
ROUTES
*/

//READ -- LOAD OVERVIEWS ON PAGES
// LOAD HOME
app.get('/', function(req, res)
{
      res.render('index')
}); 


// AUTHORS
// LOAD AUTHORS FOR Browse and Search
app.get('/authors', function(req, res)
  {
    let query1;
    console.log(req.query)
    if (req.query.LastName === undefined){
      query1 = `SELECT * FROM Authors;` 
    }
    else
    {
      query1 = `SELECT * FROM Authors WHERE AuthorLastName LIKE "${req.query.LastName}%";`
    }
    db.pool.query(query1, function(error, rows, fields){
      res.render('authors', {data: rows})
  })
});
//ADD Author
app.post('/add-author-form', function(req,res){
  let data = req.body;

  //Capture NULL values
  let AuthorFirstName = data['input-AuthorFirstName'];
  let AuthorLastName = data['input-AuthorLastName'];
  if (AuthorFirstName==='')
  {
    AuthorFirstName = 'NULL'
  };
  if (AuthorLastName==='')
  {
    AuthorLastName = 'NULL'
  };
  console.log(AuthorFirstName, AuthorLastName)
  query1 = `INSERT INTO Authors (AuthorFirstName, AuthorLastName) VALUES ('${AuthorFirstName}', '${AuthorLastName}');`;
  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }else
      {
          res.redirect('/authors');
      }
  })
});
//DELETE Author
app.delete('/delete-author', function(req,res,next){                                                                
  let data = req.body;
  console.log(data)
  let IDAuthor = Number(data.id);
  let deleteAuthor= `DELETE FROM Authors WHERE IDAuthor = ?`;
  db.pool.query(deleteAuthor, [IDAuthor], function(error, rows, fields){
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }
    else
    {
      res.sendStatus(204);
    }
})});



// Checked Out Items
// LOAD CHECKED OUT ITEMS
app.get('/checkedoutitems', function(req, res)
  {
    let query1 = 
    `SELECT CheckedOutItems.IDCheckedOutItem, Patrons.FirstName, Patrons.LastName, 
    CheckOutDetails.CheckedOut, CheckOutDetails.RentalDuration, CheckOutDetails.RentalDate, 
    ItemLocations.IDItemLocation, Books.Title, OnlineLibraries.LibraryName 
    FROM CheckedOutItems
    JOIN Patrons ON CheckedOutItems.IDPatronFK = Patrons.IDPatron
    JOIN CheckOutDetails ON CheckOutDetails.IDCheckedOutItemFK = CheckedOutItems.IDCheckedOutItem
    JOIN ItemLocations ON CheckOutDetails.IDItemLocationFK = ItemLocations.IDItemLocation
    JOIN Books ON ItemLocations.IDBookFK = Books.IDBook
    JOIN OnlineLibraries ON ItemLocations.IDOnlineLibraryFK = OnlineLibraries.IDOnlineLibrary
    ORDER BY CheckedOutItems.IDCheckedOutItem;`
    let query2 = `SELECT Patrons.IDPatron, Patrons.FirstName, Patrons.LastName FROM Patrons;`
    let query3 = `SELECT CheckOutDetails.CheckedOut, CheckOutDetails.RentalDuration, CheckOutDetails.RentalDate FROM CheckOutDetails;`
    let query4 = `SELECT ItemLocations.IDItemLocation, OnlineLibraries.LibraryName, Books.Title FROM OnlineLibraries
                  JOIN ItemLocations ON ItemLocations.IDOnlineLibraryFK = OnlineLibraries.IDOnlineLibrary
                  JOIN Books ON Books.IDBook = ItemLocations.IDBookFK;`
    let query5 = `SELECT Books.Title FROM Books;`
    let query6 = `SELECT OnlineLibraries.LibraryName FROM OnlineLibraries;`
    db.pool.query(query1, function(error, rows, fields){
      let table_info = rows;
      db.pool.query(query2, function(error, rows, fields){
        let patron_info = rows;
        db.pool.query(query3, function(error, rows, fields){
          let check_out_detail_info = rows;
          db.pool.query(query4, function(error, rows, fields){
            let item_location_info = rows;
            db.pool.query(query5, function(error, rows, fields){
              let book_info = rows;
              db.pool.query(query6, function(error, rows, fields){
                let library_info = rows;
                return res.render('checkedoutitems', {table_info, patron_info, check_out_detail_info, item_location_info, book_info, library_info});
              })
            })
          })
        })
      })
  })
});

//ADD Checked Out Items
app.post('/add-checkedout-form', function(req,res){
  let data = req.body;
  console.log('result', req.body)
  //Capture NULL values
  let Patron = parseInt(data.Patron);
  let ItemLocation = parseInt(data.ItemLocation);
  let RentalDuration = parseInt(data.RentalDuration);
  let RentalDate = data.RentalDate
  // // Create the query and run it to the database
  query1=`INSERT INTO CheckedOutItems (IDPatronFK) VALUES('${Patron}')`
  queryselect=`SELECT MAX(IDCheckedOutItem) FROM CheckedOutItems`
  query2 = `INSERT INTO CheckOutDetails (RentalDuration, RentalDate, IDItemLocationFK, IDCheckedOutItemFK, CheckedOut) 
  VALUES ('${RentalDuration}', '${RentalDate}', '${ItemLocation}',(${queryselect}), 0)`;
  console.log(queryselect)
 // query2 = `INSERT INTO CheckedOutDetails (IDBookFK, IDOnlineLibraryFK) VALUES ('${book}', '${library}')`;

  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }
      else
      {
        db.pool.query(query2, function(error, rows, fields){
          if (error)
          {
              console.log(error)
              res.sendStatus(400);
          }
          else
          {
            res.redirect('/checkedoutitems');
          }
        })
      }
  })
});
//DELETE Checked Out Items
app.delete('/delete-checkoutdetail', function(req,res,next){                                                                
  let data = req.body;
  let IDCheckedOutItem = data.id;
  let deleteCheckOutDetail= `DELETE FROM CheckedOutItems WHERE IDCheckedOutItem = ?`;
  console.log(IDCheckedOutItem)
  db.pool.query(deleteCheckOutDetail, [IDCheckedOutItem], function(error, rows, fields){
    if (error) {
    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }
    else
    {
      res.sendStatus(204);
    }
})});


// ITEM LOCATIONS
// LOAD ITEM LOCATIONS
app.get('/itemlocations', function(req, res)
{    
  searchlib=req.query.Library
  console.log(req.query, searchlib)
  let query1;
  let query2;
  let query3;
  // if searchlib
  if (req.query.Library === undefined){
    query1 = 
    `SELECT ItemLocations.IDItemLocation, OnlineLibraries.LibraryName, Books.Title FROM OnlineLibraries
    JOIN ItemLocations ON ItemLocations.IDOnlineLibraryFK = OnlineLibraries.IDOnlineLibrary
    JOIN Books ON Books.IDBook = ItemLocations.IDBookFK;`;
    query2 = `SELECT Books.IDBook, Books.Title FROM Books;`;
    query3 = `SELECT OnlineLibraries.IDOnlineLibrary, OnlineLibraries.LibraryName FROM OnlineLibraries;`;
    db.pool.query(query1, function(error, rows, fields) {
      let data = rows;
      db.pool.query(query2, (error, rows, fields) => {                
        let book_info = rows;
        db.pool.query(query3, (error, rows, fields) => {
          let library_info = rows;
          return res.render('itemlocations', {data, book_info, library_info});

        })
        
      })
    })
  }//if statement end bracket
  else
  {
    query1= 
    `SELECT ItemLocations.IDItemLocation, OnlineLibraries.LibraryName, Books.Title FROM OnlineLibraries
    JOIN ItemLocations ON ItemLocations.IDOnlineLibraryFK = OnlineLibraries.IDOnlineLibrary
    JOIN Books ON Books.IDBook = ItemLocations.IDBookFK
    WHERE ItemLocations.IDOnlineLibraryFK = "${searchlib}";`;
    query2 = `SELECT Books.IDBook, Books.Title FROM Books;`;
    query3 = `SELECT OnlineLibraries.IDOnlineLibrary, OnlineLibraries.LibraryName FROM OnlineLibraries;`;
    db.pool.query(query1, function(error, rows, fields) {
      let data = rows;
      db.pool.query(query2, (error, rows, fields) => {                
        let book_info = rows;
        db.pool.query(query3, (error, rows, fields) => {
          let library_info = rows;
          return res.render('itemlocations', {data, book_info, library_info});

        })
        
      })
    })
  }
});
//ADD Item Location
app.post('/add-itemlocation-form', function(req,res){
  let data = req.body;
  console.log(req.body)
  //Capture NULL values
  let book = data.Title;
  let library = data.Library
  console.log(book, library)
  // Create the query and run it to the database
  query1 = `INSERT INTO ItemLocations (IDBookFK, IDOnlineLibraryFK) VALUES ('${book}', '${library}')`;
  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }else
      {
          res.redirect('/itemlocations');
      }
  })
});
//DELETE Item Location
app.delete('/delete-itemLocation', function(req,res,next){                                                                
  let data = req.body;
  console.log(data)
  let IDItemLocation = parseInt(data.id);
  let deleteItemLocation= `DELETE FROM ItemLocations WHERE IDItemLocation = ?`;

  // Run the 1st query
  db.pool.query(deleteItemLocation, [IDItemLocation], function(error, rows, fields){
    if (error) {
    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }
    else
    {
      res.sendStatus(204);
    }
})});





//Patrons
// LOAD PATRONS
app.get('/patrons', function(req, res)
  {
    let query1 = "SELECT * FROM Patrons" 
    db.pool.query(query1, function(error, rows, fields){
    res.render('patrons', {data: rows})
  })
}); 

//ADD PATRON
app.post('/add-patron-form', function(req,res){
  let data = req.body;

  //Capture NULL values
  let Email = data['input-Email'];
  if (Email==='')
  {
      Email = 'NULL'
  }
  query1 = `INSERT INTO Patrons (FirstName, LastName, Email) VALUES ('${data['input-FirstName']}','${data['input-LastName']}','${data['input-Email']}')`;
  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }else
      {
          res.redirect('/patrons');
      }
  })
})


//EDIT PATRON EMAIL
app.put('/put-patron-ajax', function(req,res,next){                                   
    let data = req.body;
    let person = data.fullname;
    let email = data.email

  
    queryUpdateEmail = `UPDATE Patrons SET email = ? WHERE Patrons.IDPatron = ?`;
  
          // Run the 1st query
    db.pool.query(queryUpdateEmail, [email, person], function(error, rows, fields){
      if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
      }
      else
      {
      res.send(rows);
      }
  })});
  
//DELETE PATRON
app.delete('/delete-patron', function(req,res,next){                                                                
    let data = req.body;
    let IDPatron = parseInt(data.id);
    let deletePatron= `DELETE FROM Patrons WHERE IDPatron = ?`;
    // SOURCE CODE: let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deletePatron, [IDPatron], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {res.sendStatus(204);

              }
  })});


// Genres.hbs
// LOAD GENRES
app.get('/genres', function(req, res)
  {
    let query1 = "SELECT * FROM Genres;" 
    db.pool.query(query1, function(error, rows, fields){
    res.render('genres', {data: rows})
  })
});

//ADD Genre
app.post('/add-genre-form', function(req,res){
  let data = req.body;

  //Capture NULL values
  let Genre = data['input-genre'];
  if (Genre==='')
  {
      Genre = 'NULL'
  }

  //Create the query and run it to the database
  query1 = `INSERT INTO Genres (GenreCategory) VALUES ('${data['input-genre']}')`;
  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }else
      {
          res.redirect('/genres');
      }
  })
});

//DELETE Genre
app.delete('/delete-genre', function(req,res,next){                                                                
  let data = req.body;
  console.log(data)
  let IDGenre = (data.id);
  let deleteGenre= `DELETE FROM Genres WHERE IDGenre = ?`;
  db.pool.query(deleteGenre, [IDGenre], function(error, rows, fields){
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }
    else
    {
      res.sendStatus(204);
    }
})});

//EDIT Genre Category
app.put('/put-genre-ajax', function(req,res,next){                                   
  let data = req.body;
  let IDgenre = data.IDGenre;
  let newgenre = data.NewGenre
  queryUpdateGenre = `UPDATE Genres SET GenreCategory = ? WHERE Genres.IDGenre = ?`;
  db.pool.query(queryUpdateGenre, [newgenre, IDgenre], function(error, rows, fields){
    if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      res.sendStatus(400);
    }
    else
    {
      res.send(rows);
    }
})});


//Online Libraries
// LOAD ONLINE LIBRARIES && SEARCH
app.get('/onlinelibraries', function(req, res)
  {    
    searchlib=req.query.inputlibrary
    let query1;
    if (searchlib === undefined){
      query1 = "SELECT * FROM OnlineLibraries;" 
    }
    else{
      query1 = `SELECT * FROM OnlineLibraries WHERE LibraryName LIKE "${searchlib}%"` 
    }
    db.pool.query(query1, function(error, rows, fields){
    res.render('onlinelibraries', {data: rows})
    })
});

//ADD Online Library
app.post('/add-OnlineLibrary-form', function(req,res){
  let data = req.body;

  //Capture NULL values
  let library = data['input-library'];
  if (library==='')
  {
      library = 'NULL'
  }
  console.log(library)

  //Create the query and run it to the database
  query1 = `INSERT INTO OnlineLibraries (LibraryName) VALUES ('${data['input-library']}')`;
  db.pool.query(query1, function(error, rows, fields){
      if (error){
          console.log(error)
          res.sendStatus(400);
      }else
      {
          res.redirect('/onlinelibraries');
      }
  })
});


//DELETE Online Library
app.delete('/delete-onlinelibrary', function(req,res,next){                                                                
  let data = req.body;
  console.log('library to delete:', data)
  let IDOnlineLibrary = (data.id);
  let deleteOnlineLibrary = `DELETE FROM OnlineLibraries WHERE IDOnlineLibrary = ?`;
        // Run the 1st query
        db.pool.query(deleteOnlineLibrary, [IDOnlineLibrary], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {res.sendStatus(204);
            }
})});

//EDIT Online Library Name
app.put('/put-onlinelibrary-ajax', function(req,res,next){               
  let data = req.body;
  let oldLibraryID=Number(data.oldLibraryName);
  let newLibraryName = data.newLibraryName

  console.log(typeof(oldLibraryID))
  queryUpdateLibrary = `UPDATE OnlineLibraries SET LibraryName = ? WHERE OnlineLibraries.IDOnlineLibrary = ?`;                    
  // Run the 1st query
  db.pool.query(queryUpdateLibrary, [newLibraryName, oldLibraryID], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
    else
    {
      res.send(rows);
    }
})});


//Books
// LOAD BOOKS
app.get('/books', function(req, res)
  {
    let query1 = `SELECT Books.IDBook, Books.Title, 
    Authors.AuthorFirstName, Authors.AuthorLastName, 
    Genres.GenreCategory as 'Genre' FROM Books 
    LEFT JOIN Authors ON Books.IDAuthorFK = Authors.IDAuthor
    LEFT JOIN Genres ON Books.IDGenreFK = Genres.IDGenre
    ORDER BY Books.IDBook ASC;`
    let query2 = `SELECT Authors.IDAuthor, Authors.AuthorFirstName, Authors.AuthorLastName FROM Authors;`;
    let query3 = `SELECT Genres.IDGenre, Genres.GenreCategory as 'Genre' FROM Genres;`
    db.pool.query(query1, function(error, rows, fields) {
      let table_info = rows;
      db.pool.query(query2, (error, rows, fields) => {                
        let author_info = rows;
        db.pool.query(query3, (error, rows, fields) => {
          let genre_info = rows;
          return res.render('books', {table_info, author_info, genre_info});
        })
      })
    })
});

//BOOKS - ADD/UPDATE/DELETE
//ADD BOOK
app.post('/add-book-form', function(req,res){
    let query1
    let data = req.body;
    let BookAuthor = data['input-BookAuthorID']
    let BookGenre = data['input-BookGenreID']
    let BookTitle = data['input-Title']

    console.log("IDs for author genre", data, BookAuthor, BookGenre)
    if(BookAuthor === "None" && BookGenre === "None")
      {
        console.log('yes')
        query1 = `INSERT INTO Books (Title) VALUES ('${BookTitle}');`;
      }
    else if (BookAuthor === "None" && BookGenre !== "None")
      {
        query1 = `INSERT INTO Books (Title, IDGenreFK) VALUES ('${BookTitle}', '${BookGenre}');`;
      }
    else if (BookGenre === "None" && BookAuthor !== "None")
      {
        query1 = `INSERT INTO Books (Title, IDAuthorFK) VALUES ('${BookTitle}', '${BookAuthor}');`;
      }
    else
      {
        query1 = `INSERT INTO Books (Title, IDAuthorFK, IDGenreFK) VALUES 
        ('${BookTitle}', '${BookAuthor}', '${BookGenre}');`;
      }
    db.pool.query(query1, function(error, rows, fields){
      if (error){
        console.log(error)
        res.sendStatus(400);
      }else
      {
        console.log('nonenone')
        res.redirect('books');
      }
    })
  });
  
  //EDIT Book Author or Genre
  app.put('/put-book-ajax', function(req,res,next){  
    let data = req.body;
    let BookID= Number(data.BookID)
    let IDAuthorFK = Number(data.AuthorID)
    let IDGenreFK = Number(data.GenreID)
    let queryUpdateLibrary
    if (IDAuthorFK === 0 && IDGenreFK === 0)
      {
        queryUpdateLibrary = `UPDATE Books SET IDAuthorFK = (SELECT NULL), IDGenreFK = (SELECT NULL) WHERE Books.IDBook = ${BookID};`;
      } 
    else if(IDAuthorFK !== 0 && IDGenreFK === 0)
      {
        queryUpdateLibrary = `UPDATE Books SET IDAuthorFK = ${IDAuthorFK}, IDGenreFK = (SELECT NULL) WHERE Books.IDBook = ${BookID};`;
      } 
    else if(IDAuthorFK === 0 && IDGenreFK !== 0)
      {
        queryUpdateLibrary = `UPDATE Books SET IDAuthorFK = (SELECT NULL), IDGenreFK = ${IDGenreFK} WHERE Books.IDBook = ${BookID};`;
      }
    else if (IDAuthorFK !== 0 && IDGenreFK !== 0)
      {
        queryUpdateLibrary = `UPDATE Books SET IDAuthorFK = ${IDAuthorFK}, IDGenreFK=${IDGenreFK} WHERE Books.IDBook = ${BookID};`;
      }
    db.pool.query(queryUpdateLibrary, function(error, rows, fields){
      if (error) {                               
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
      }
      else
      {
        res.send(rows);
      }
  })});
  
  //DELETE BOOK
  app.delete('/delete-book', function(req,res,next){                                                                
    let data = req.body;
    console.log(data)
    let IDBook = (data.id);
    let deleteBook= `DELETE FROM Books WHERE IDBook = ?`;
    db.pool.query(deleteBook, [IDBook], function(error, rows, fields){
      if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
      }
      else
      {
        res.sendStatus(204);
      }
})});



  /*
LISTENER
*/
app.listen(PORT, function(){ 
// This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});