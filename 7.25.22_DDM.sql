-- 
-- PATRONS PAGE
--

-- SELECT 'Patrons' Page
SELECT 
	IDPatron AS `ID Patron`, 
	FirstName AS `First Name`, 
	LastName AS `Last Name`, 
	Email AS `E-mail` FROM Patrons;
    
-- INSERT 'Patrons' Page
INSERT INTO Patrons(FirstName, LastName) 
	VALUES(:FirstNameInput, :LastNameInput);

-- UPDATE 'Patrons' Page
UPDATE Patrons
	SET FirstName = :FirstNameInput, LastName = :LastNameInput
WHERE IDPatron = :IDPatronInput;

-- SEARCH Based on Patron Name to get email and ID details 'Patrons' Page
SELECT 
IDPatron as `ID Patron`,
FirstName as `First Name`,
LastName as `LastName`, 
Email as `E-mail` FROM Patrons
WHERE FirstName = :FirstNameInput, LastName = :LastNameInput
 
-- SEARCH Based on Patron ID to get name and email details 'Patrons' Page
SELECT IDPatron, FirstName, LastName, Email FROM Patrons 
WHERE IDPatron = :IDPatronInput; 

-- DELETE 'Patrons' Page
DELETE FROM Patrons
WHERE IDPatron = :IDPatronInput;
-- TESTCODE:
-- WHERE IDPatron=4;




-- 
-- Item Locations PAGE
--

-- SEARCH based on libarary name to see what books are available 'Item Locations' Page

SELECT ItemLocations.IDItemLocation, OnlineLibraries.LibraryName, Books.Title from OnlineLibraries   
JOIN ItemLocations ON ItemLocations.IDOnlineLibraryFK = OnlineLibraries.IDOnlineLibrary  
JOIN Books ON Books.IDBook = ItemLocations.IDBookFK   
WHERE OnlineLibraries.LibraryName = :LibraryNameInput -- 'Los Angeles Public Library'  
ORDER BY Books.Title ASC;  




-- 
-- Checked Out Items PAGE
--

-- SEARCH Based on Patron Name 'Checked Out Items' Page
SELECT Patrons.FirstName, Patrons.LastName, Books.Title
FROM Patrons 
	INNER JOIN CheckedOutItems ON Patrons.IDPatron = CheckedOutItems.IDPatronFK
	INNER JOIN CheckOutDetails ON CheckedOutItems.IDCheckedOutItem = CheckOutDetails.IDCheckedOutItemFK
	INNER JOIN ItemLocations ON CheckOutDetails.IDItemLocationFK  = ItemLocations. IDItemLocation
	INNER JOIN Books ON ItemLocations.IDBookFK = Books.IDBook
WHERE Patrons.FirstName = :FirstNameInput AND Patrons.LastName = :LastNameInput;
 
 
 -- OVERVIEW TABLE -- 'Checked Out Items' Page

SELECT Patrons.IDPatron AS `ID Patron`, 
Patrons.FirstName AS `Patron First Name`, 
Patrons.LastName AS `Patron Last Name`,  
Books.Title AS `Book`,  
OnlineLibraries.LibraryName AS `Library Name` 
FROM Patrons  
INNER JOIN CheckedOutItems ON Patrons.IDPatron = CheckedOutItems.IDPatronFK 
INNER JOIN CheckOutDetails ON CheckedOutItems.IDCheckedOutItem = CheckOutDetails.IDCheckedOutItemFK 
INNER JOIN ItemLocations ON CheckOutDetails.IDItemLocationFK  = ItemLocations. IDItemLocation 
INNER JOIN Books ON ItemLocations.IDBookFK = Books.IDBook 
INNER JOIN OnlineLibraries ON ItemLocations.IDOnlineLibraryFK= OnlineLibraries.IDOnlineLibrary 
WHERE Patrons.FirstName = :FirstNameInput AND Patrons.LastName = :LastNameInput;
-- TESTCODE:
-- SELECT Patrons.IDPatron AS `ID Patron`, 
-- Patrons.FirstName AS `Patron First Name`, 
-- Patrons.LastName AS `Patron Last Name`,  
-- Books.Title AS `Book`,  
-- OnlineLibraries.LibraryName AS `Library Name` 
-- FROM Patrons  
-- INNER JOIN CheckedOutItems ON Patrons.IDPatron = CheckedOutItems.IDPatronFK 
-- INNER JOIN CheckOutDetails ON CheckedOutItems.IDCheckedOutItem = CheckOutDetails.IDCheckedOutItemFK 
-- INNER JOIN ItemLocations ON CheckOutDetails.IDItemLocationFK  = ItemLocations. IDItemLocation 
-- INNER JOIN Books ON ItemLocations.IDBookFK = Books.IDBook 
--     INNER JOIN OnlineLibraries ON ItemLocations.IDOnlineLibraryFK= OnlineLibraries.IDOnlineLibrary 
-- WHERE Patrons.FirstName = "Jonas" AND Patrons.LastName = "Tilde";

