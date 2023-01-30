SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT =0;
-- DROP TABLEs Author, Books, CheckOutDetails, CheckedOutItems, Genre, ItemLocations, OnlineLibraries, Patrons;
-- DROP TABLE IF EXISTS Patrons, OnlineLibraries, Author, Genre,Books, ItemLocations, CheckedOutItems,CheckOutDetails, 
-- -----------------------------------------------------
-- Table `Patrons`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Patrons` (
  `IDPatron` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(500) NULL,
  `LastName` VARCHAR(500) NULL,
  `Email` VARCHAR(500) NULL,
  CONSTRAINT `FullName` UNIQUE(`FirstName`, `LastName`),
  PRIMARY KEY (`IDPatron`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `OnlineLibraries`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `OnlineLibraries` (
  `IDOnlineLibrary` INT NOT NULL AUTO_INCREMENT,
  `LibraryName` VARCHAR(500) NULL,
  PRIMARY KEY (`IDOnlineLibrary`),
  UNIQUE INDEX `LibraryName_UNIQUE` (`LibraryName` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Authors`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Authors` (
  `IDAuthor` INT NOT NULL AUTO_INCREMENT,
  `AuthorFirstName` VARCHAR(500) NOT NULL,  
  `AuthorLastName` VARCHAR(500) NOT NULL,  
  PRIMARY KEY (`IDAuthor`),
  CONSTRAINT `FullName` UNIQUE(`AuthorFirstName`, `AuthorLastName`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Genre`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Genres` (
  `IDGenre` INT NOT NULL AUTO_INCREMENT,
  `GenreCategory` VARCHAR(500) NOT NULL UNIQUE,-- TINYINT(1) DEFAULT(1), -- 0 == Nonfiction
  PRIMARY KEY (`IDGenre`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Books`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Books` (
  `IDBook` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(500) NOT NULL,
  `IDAuthorFK` INT ,  
  `IDGenreFK` INT ,
  PRIMARY KEY (`IDBook`),
  FOREIGN KEY (`IDAuthorFK`)
    REFERENCES `Authors` (`IDAuthor`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`IDGenreFK`)
    REFERENCES `Genres` (`IDGenre`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  UNIQUE INDEX `Title_UNIQUE` (`Title` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ItemLocations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `ItemLocations` (
  `IDItemLocation` INT NOT NULL AUTO_INCREMENT,
  `IDBookFK` INT NOT NULL,
  `IDOnlineLibraryFK` INT NOT NULL,
  PRIMARY KEY (`IDItemLocation`),
  FOREIGN KEY (`IDBookFK`)
    REFERENCES `Books` (`IDBook`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`IDOnlineLibraryFK`)
    REFERENCES `OnlineLibraries` (`IDOnlineLibrary`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CheckedOutItems`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `CheckedOutItems` (
  `IDCheckedOutItem` INT NOT NULL AUTO_INCREMENT,
  `IDPatronFK` INT NOT NULL,
  PRIMARY KEY (`IDCheckedOutItem`),
  FOREIGN KEY (`IDPatronFK`)
    REFERENCES `Patrons` (`IDPatron`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CheckOutDetails`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `CheckOutDetails` (
  `IDCheckOutDetail` INT NOT NULL AUTO_INCREMENT,
  `CheckedOut` TINYINT NULL DEFAULT 1,
  `RentalDuration` INT NULL DEFAULT NULL,
  `RentalDate` DATE NULL,
  `IDCheckedOutItemFK` INT NOT NULL,
  `IDItemLocationFK` INT NOT NULL,
  PRIMARY KEY (`IDCheckOutDetail`),
  FOREIGN KEY (`IDCheckedOutItemFK`)
    REFERENCES `CheckedOutItems` (`IDCheckedOutItem`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`IDItemLocationFK`)
    REFERENCES `ItemLocations` (`IDItemLocation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- DATA INSERTION -- DO NOT CHANGE ORDER
-- -----------------------------------------------------
INSERT INTO `OnlineLibraries` (`LibraryName`) VALUES
('Los Angeles Public Library'),
('New York Public Library'),
('World Digital Library'), 
('Universal Digital Library');

INSERT INTO `Authors`(AuthorLastName, AuthorFirstName) VALUES
("Owens", "Delia"),
("Hoover", "Colleen"),
("Hilderbrand", "Elin"),
("Grisham", "John");

INSERT INTO `Genres`(GenreCategory) VALUES
("Fiction"),
("Nonfiction"),
("Biography"),
("Horror");

INSERT INTO `Books`(`IDAuthorFK`,`Title`,`IDGenreFK`)VALUES
((SELECT IDAuthor from Authors WHERE AuthorLastName = 'Owens' AND AuthorFirstName = 'Delia'), "Where the Crawdads Sing", (SELECT IDGenre from Genres WHERE GenreCategory = 'Fiction')),
((SELECT IDAuthor from Authors WHERE AuthorLastName = 'Hoover' AND AuthorFirstName = 'Colleen'), "It Ends with Us", (SELECT IDGenre from Genres WHERE GenreCategory = 'Fiction')),
((SELECT IDAuthor from Authors WHERE AuthorLastName = 'Hoover' AND AuthorFirstName = 'Colleen'), "Verity", (SELECT IDGenre from Genres WHERE GenreCategory = 'Fiction')),
((SELECT IDAuthor from Authors WHERE AuthorLastName = 'Hilderbrand' AND AuthorFirstName = 'Elin'), "The Hotel Nantucket",(SELECT IDGenre from Genres WHERE GenreCategory = 'Fiction')),
((SELECT IDAuthor from Authors WHERE AuthorLastName = 'Grisham' AND AuthorFirstName = 'John'), "Sparring Partners", (SELECT IDGenre from Genres WHERE GenreCategory = 'Fiction'));

INSERT INTO `Patrons` (`FirstName`, `LastName`, `Email`) VALUES
('Jonas', 'Tilde', 'jtilde@gmail.com'),
('Amanda', 'Danai', 'danniii@gmail.com'),
('Shinya', 'Ragna', 'sra@gmail.com');

INSERT INTO `CheckedOutItems`(`IDPatronFK`)VALUES
((SELECT IDPatron from Patrons WHERE FirstName = 'Jonas' AND LastName = 'Tilde')),
((SELECT IDPatron from Patrons WHERE FirstName = 'Amanda' AND LastName = 'Danai')),
((SELECT IDPatron from Patrons WHERE FirstName = 'Shinya' AND LastName = 'Ragna'));

INSERT INTO `ItemLocations`(`IDBookFK`, `IDOnlineLibraryFK`)VALUES
((SELECT IDBook FROM Books WHERE Title = 'Where the Crawdads Sing'), (SELECT IDOnlineLibrary FROM OnlineLibraries WHERE LibraryName = 'Los Angeles Public Library')),
((SELECT IDBook FROM Books WHERE Title = 'Where the Crawdads Sing'), (SELECT IDOnlineLibrary FROM OnlineLibraries WHERE LibraryName = 'Universal Digital Library')),
((SELECT IDBook FROM Books WHERE Title = 'The Hotel Nantucket'), (SELECT IDOnlineLibrary FROM OnlineLibraries WHERE LibraryName = 'Los Angeles Public Library')),
((SELECT IDBook FROM Books WHERE Title = 'The Hotel Nantucket'), (SELECT IDOnlineLibrary FROM OnlineLibraries WHERE LibraryName = 'Los Angeles Public Library'));

INSERT INTO `CheckOutDetails`(`CheckedOut`, `RentalDuration`, `RentalDate`, `IDCheckedOutItemFK`, `IDItemLocationFK`) VALUES 
(0, 7,'2022-11-12', 1, 1), 
(0, 21,'2022-05-10', 1, 2), 
(0, 14,'2022-07-10', 2, 2), 
(0, 7,'2022-05-14', 3, 3);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;