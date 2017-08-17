-- Name: Ryan Gift and Zachary Anderson 
-- CS340 Project
-- Due Date: 08/18/2017
-- zanderson3j = Zach's github

DROP TABLE IF EXISTS `movies_countries`;
DROP TABLE IF EXISTS `actors_movies`;
DROP TABLE IF EXISTS `directors_movies`;
DROP TABLE IF EXISTS `actors`;
DROP TABLE IF EXISTS `directors`;
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `country`;

-- Create a table called country with the following properties:
-- id - an auto incrementing integer which is the primary key
-- name - a varchar with a maximum length of 255 characters, cannot be null
-- continent - a varchar with a maximum length of 255 characters, cannot be null
-- population - a decimal that has 1 decimal digit, for example 365.1
CREATE TABLE `country` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`continent` varchar(255) NOT NULL,
	`population` decimal(7,1) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create a table called movies with the following properties:
-- id - an auto incrementing integer which is the primary key
-- title - a varchar with a maximum length of 255 characters, cannot be null
-- genre - a varchar with a maximum length of 255 characters, cannot be null
-- runtime - an integer
-- release_date - a date type 
CREATE TABLE `movies` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`genre` varchar(255) NOT NULL,
	`runtime` int(11) NOT NULL,
	`release_date` date,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create a table called directors with the following properties:
-- id - an auto incrementing integer which is the primary key
-- first_name - a varchar with a maximum length of 255 characters, cannot be null
-- last_name - a varchar with a maximum length of 255 characters, cannot be null
-- age - an integer
-- cid - an integer which is a foreign key reference to the client table
CREATE TABLE `directors` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`age` int(11) NOT NULL,
	`cid` int(11) DEFAULT '0',
	PRIMARY KEY (`id`),
	FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create a table called actors with the following properties:
-- id - an auto incrementing integer which is the primary key
-- first_name - a varchar with a maximum length of 255 characters, cannot be null
-- last_name - a varchar with a maximum length of 255 characters, cannot be null
-- age - an integer
-- cid - an integer which is a foreign key reference to the country table
CREATE TABLE `actors` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`age` int(11) NOT NULL,
	`cid` int(11) DEFAULT '0',
	PRIMARY KEY (`id`),
	FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Directors Make Movies (MtoM)
-- Create a table called directors_movies with the following properties:
-- direct_id - an integer which is a foreign key reference to the directors table
-- movie_id - an integer which is a foreign key reference to the movies table
CREATE TABLE `directors_movies` (
	`direct_id` int(11) NOT NULL DEFAULT '0',
	`movie_id` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`direct_id`,`movie_id`),
	FOREIGN KEY (`direct_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Actors in Movies (MtoM)
-- Create a table called actors_movies with the following properties:
-- act_id - an integer which is a foreign key reference to the actors table
-- movie_id - an integer which is a foreign key reference to the movies table
CREATE TABLE `actors_movies` (
	`act_id` int(11) NOT NULL DEFAULT '0',
	`movie_id` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`act_id`,`movie_id`),
	FOREIGN KEY (`act_id`) REFERENCES `actors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Movies Filmed in Countries (MtoM)
-- Create a table called movies_countries with the following properties:
-- movie_id - an integer which is a foreign key reference to the movies table
-- cid - an integer which is a foreign key reference to the country table
CREATE TABLE `movies_countries` (
	`movie_id` int(11) NOT NULL DEFAULT '0',
	`cid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`movie_id`,`cid`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- INSERT COUNTRIES INTO TABLE
INSERT INTO `country` VALUES (1,'United States','North America',326.4),
(2,'Canada','North America',65.6),
(3,'United Kingdom','Europe',65.5),
(4,'Australia','Oceania',24.6),
(5,'Austria','Europe',8.5),
(6,'Malaysia','Asia',31.1),
(7,'France','Europe',64.9),
(8,'India','Asia',1342.5),
(9,'Ireland','Europe',4.7),
(10,'Kenya','Africa',48.4),
(11,'New Zealand','Oceania',4.6),
(12,'Sweden','Europe',9.9),
(13,'Germany','Europe',80.6),
(14,'Netherlands','Europe',17.1),
(15,'Italy','Europe',59.7),
(16,'Luxembourg','Europe',0.6),
(17,'Spain','Europe',46.1),
(18,'China','Asia',1388.2);

-- INSERT MOVIES INTO TABLE
INSERT INTO `movies` VALUES (1,'Death Proof','Exploitation',114,'2007-04-06'),
(2,'Inglorious Basterds','War',153,'2009-08-21'),
(3,'Django Unchained','Revisionist Western',165,'2012-12-25'),
(4,'The Hateful Eight','Revisionist Western',187,'2015-12-25'),
(5,'Jackie Brown','Crime Thriller',154,'1997-12-25'),
(6,'Kill Bill: Volume 1','Martial Arts',111,'2003-10-10'),
(7,'Kill Bill: Volume 2','Martial Arts',135,'2004-04-16'),
(8,'Pulp Fiction','Comedy Neo-Noir Crime',154,'1994-10-14'),
(9,'Reservoir Dogs','Crime Thriller',99,'1992-10-23'),
(10,'Four Rooms','Comedy',102,'1995-12-25'),
(11,'The Life Aquatic with Steve Zissou','Comedy-Drama',118,'2004-12-25'),
(12,'The Darjeeling Limited','Comedy-Drama',91,'2007-10-26'),
(13,'The Grand Budapest Hotel','Comedy',100,'2014-03-07'),
(14,'Rushmore','Comedy-Drama',93,'1998-10-09'),
(15,'The Royal Tenenbaums','Comedy-Drama',109,'2002-01-04'),
(16,'Fantastic Mr. Fox','Comedy',87,'2009-11-13'),
(17,'Moonrise Kingdom','Coming-of-Age',94,'2012-05-25'),
(18,'Isle of Dogs','Comedy',100,'2018-03-23'),
(19,'Bottle Rocket','Crime-Comedy',91,'1996-02-21'),
(20,'Batman Begins','Superhero',140,'2005-06-15'),
(21,'The Prestige','Mystery-Thriller',130,'2006-10-20'),
(22,'The Dark Knight','Superhero',152,'2008-07-18'),
(23,'The Dark Knight Rises','Superhero',165,'2012-07-20'),
(24,'Inception','Science Fiction',148,'2010-07-16'),
(25,'Interstellar','Science Fiction',169,'2014-11-05'),
(26,'Dunkirk','War',106,'2017-07-21'),
(27,'Memento','Thriller',113,'2001-03-16'),
(28,'Insomnia','Thriller',118,'2002-05-24'),
(29,'Following','Crime-Drama',70,'1999-11-05'),
(30,'Shaun of the Dead','Horror-Comedy',99,'2004-09-24'),
(31,'Hot Fuzz','Action-Comedy',121,'2007-04-20'),
(32,'The Worlds End','Science Fiction',109,'2013-08-23'),
(33,'Star Trek','Science Fiction',127,'2009-05-08'),
(34,'Super 8','Science Fiction',112,'2011-06-10'),
(35,'Star Trek Into Darkness','Science Fiction',133,'2013-05-17'),
(36,'Star Wars: The Force Awakens','Epic Space Opera',136,'2015-12-18'),
(37,'Mission: Impossible III','Action',125,'2006-05-05'),
(38,'Crimes and Misdemeanors','Comedy-Drama',104,'1989-10-13'),
(39,'Alice','Romance',106,'1990-12-25'),
(40,'Husbands and Wives','Comedy-Drama',103,'1992-09-18'),
(41,'Deconstructing Harry','Comedy',96,'1997-12-12'),
(42,'Broadway Danny Rose','Comedy',84,'1984-01-27'),
(43,'The Purple Rose of Cairo','Romantic-Comedy',82,'1985-03-01'),
(44,'Radio Days','Comedy-Drama',85,'1987-01-30'),
(45,'Manhattan Murder Mystery','Comedy',104,'1993-08-18'),
(46,'Everyone Says I Love You','Musical-Comedy',101,'1996-12-06'),
(47,'To Rome with Love','Romantic-Comedy',112,'2012-06-22'),
(48,'Blue Jasmine','Comedy-Drama',98,'2013-08-23'),
(49,'Another Woman','Drama',84,'1988-10-14'),
(50,'Shadows and Fog','Comedy',85,'1991-12-05'),
(51,'Manhattan','Romantic-Comedy',96,'1979-04-25'),
(52,'Bullets over Broadway','Crime',98,'1994-10-14'),
(53,'Mighty Aphrodite','Romantic-Comedy',95,'1995-10-27'),
(54,'Celebrity','Comedy-Drama',113,'1998-11-20'),
(55,'Sweet and Lowdown','Comedy-Drama',95,'1999-09-03'),
(56,'Small Time Crooks','Crime-Comedy',95,'2000-05-19'),
(57,'New York Stories','Anthology',124,'1989-03-10'),
(58,'Whatever Works','Comedy',92,'2009-06-19'),
(59,'A Midsummer Nights Sex Comedy','Comedy',88,'1982-07-16'),
(60,'Zelig','Mockumentary',79,'1983-07-15'),
(61,'Hannah and Her Sisters','Comedy-Drama',106,'1986-02-07'),
(62,'September','Drama',82,'1987-12-18'),
(63,'Match Point','Thriller',124,'2006-01-06'),
(64,'Scoop','Romantic-Comedy',96,'2006-07-28'),
(65,'Vicky Cristina Barcelona','Comedy-Drama',97,'2008-08-15'),
(66,'Men of Crisis: The Harvey Wallinger Story','Satirization',25,'1905-05-24'),
(67,'Sleeper','Science Fiction',87,'1973-12-17'),
(68,'Love and Death','Satire',85,'1975-06-10'),
(69,'Annie Hall','Romantic-Comedy',93,'1977-04-20'),
(70,'Interiors','Drama',92,'1978-08-02'),
(71,'Whats Up Tiger Lily?','Comedy',80,'1966-11-02'),
(72,'Take the Money and Run','Mockumentary',85,'1969-08-18'),
(73,'Bananas','Comedy',82,'1971-04-28'),
(74,'Everything You Always Wanted to Know About Sex (But Were Afraid to Ask)','Comedy',88,'1972-08-06'),
(75,'Stardust Memories','Comedy-Drama',88,'1980-09-26'),
(76,'Hollywood Ending','Comedy',114,'2002-05-03'),
(77,'Melinda and Melinda','Comedy-Drama',99,'2005-03-18'),
(78,'The Curse of the Jade Scorpion','Crime-Comedy',103,'2001-08-24'),
(79,'Cafe Society','Romantic-Comedy',96,'2016-07-15'),
(80,'Wonder Wheel','Drama',100,'2017-12-01'),
(81,'Knocked Up','Romantic-Comedy',129,'2007-06-01'),
(82,'This is 40','Comedy',133,'2012-12-21'),
(83,'Trainwreck','Romantic-Comedy',124,'2015-07-17'),
(84,'The 40-Year-Old Virgin','Comedy',133,'2005-08-19'),
(85,'Funny People','Comedy-Drama',146,'2009-07-31'),
(86,'Armageddon','Science Fiction',150,'1998-07-01'),
(87,'The Island','Science Fiction',136,'2005-07-22'),
(88,'Transformers: The Last Knight','Science Fiction',149,'2017-06-21'),
(89,'Bad Boys','Action-Comedy',119,'1995-04-07'),
(90,'Pearl Harbor','Romantic-Drama',183,'2001-05-25'),
(91,'Bad Boys II','Action-Comedy',147,'2003-07-18'),
(92,'Transformers','Science Fiction',143,'2007-07-03'),
(93,'Transformers: Revenge of the Fallen','Science Fiction',150,'2009-06-24'),
(94,'Transformers: Dark of the Moon','Science Fiction',154,'2011-06-29'),
(95,'Pain & Gain','Comedy',129,'2013-04-26'),
(96,'Transformers: Age of Extinction','Science Fiction',165,'2014-06-27'),
(97,'Planet of the Apes','Science Fiction',120,'2001-07-27'),
(98,'Big Fish','Comedy-Drama',125,'2003-12-10'),
(99,'Charlie and the Chocolate Factory','Musical',115,'2005-07-15'),
(100,'Corpse Brid','Musical',77,'2005-09-23'),
(101,'Sweeney Todd: The Demon Barber of Fleet Street','Musical',116,'2007-12-21'),
(102,'Alice in Wonderland','Fantasy',109,'2010-03-05'),
(103,'Dark Shadows','Horror-Comedy',113,'2012-05-11'),
(104,'Edward Scissorhands','Romance',105,'1990-12-14'),
(105,'Ed Wood','Comedy-Drama',127,'1994-09-30'),
(106,'Sleepy Hollow','Horror',105,'1999-11-19'),
(107,'Batman Returns','Superhero',126,'1992-06-19'),
(108,'Mars Attacks!','Science Fiction',106,'1996-12-13'),
(109,'Dumbo','Fantasy',100,'2019-03-29'),
(110,'Pee-wees Big Adventure','Comedy',91,'1985-08-09'),
(111,'Beetlejuice','Comedy',92,'1988-03-30'),
(112,'Batman','Superhero',126,'1989-06-23'),
(113,'Miss Peregrines Home for Peculiar Children','Fantasy',127,'2016-09-30'),
(114,'Frankenweenie','Horror-Comedy',87,'2012-10-05'),
(115,'The Terminator','Science Fiction',107,'1984-10-26'),
(116,'Aliens','Science Fiction',137,'1986-07-18'),
(117,'The Abyss','Science Fiction',145,'1989-08-09'),
(118,'Terminator 2: Judgement Day','Science Fiction',137,'1991-07-03'),
(119,'Titantic','Romance',195,'1997-12-19'),
(120,'Piranha II: The Spawning','Horror',94,'1982-11-05'),
(121,'True Lies','Action',141,'1994-07-15'),
(122,'Ghosts of the Abyss','Documentary',61,'2003-03-31');

-- INSERT DIRECTORS INTO TABLE
INSERT INTO `directors` VALUES (1,'Quentin','Tarantino',54,1),
(2,'Wes','Anderson',48,1),
(3,'Christopher','Nolan',46,3),
(4,'Edgar','Wright',43,3),
(5,'J.J.','Abrams',51,1),
(6,'Woody','Allen',81,1),
(7,'Judd','Apatow',49,1),
(8,'Michael','Bay',52,1),
(9,'Tim','Burton',58,1),
(10,'James','Cameron',62,2);

-- INSERT ACTORS INTO TABLE
INSERT INTO `actors` VALUES (1,'Michael','Bacall',44,1),
(2,'Michael','Bowen',60,1),
(3,'Samuel','Jackson',68,1),
(4,'Harvey','Keitel',78,1),
(5,'James','Parks',48,1),
(6,'Tim','Roth',56,3),
(7,'Uma','Thurman',47,1),
(8,'Zoe','Bell',38,11),
(9,'Julie','Dreyfus',51,7),
(10,'Michael','Madsen',58,1),
(11,'Michael','Parks',77,1),
(12,'Waris','Ahluwalia',42,8),
(13,'Seymour','Cassel',82,1),
(14,'Bill','Murray',66,1),
(15,'Larry','Pine',72,1),
(16,'Andrew','Wilson',52,1),
(17,'Eric','Anderson',43,1),
(18,'Willem','Dafoe',62,1),
(19,'Bob','Balaban',71,1),
(20,'Adrien','Brody',44,1),
(21,'Jeff','Goldblum',64,1),
(22,'Anjelica','Huston',66,1),
(23,'Edward','Norton',47,1),
(24,'Kumar','Pallana',94,8),
(25,'Jason','Schwartzman',37,1),
(26,'Tilda','Swinton',56,3),
(27,'Wallace','Wolodarsky',47,1),
(28,'Luke','Wilson',45,1),
(29,'Owen','Wilson',48,1),
(30,'Christian','Bale',43,3),
(31,'Michael','Caine',84,3),
(32,'Tom','Hardy',39,3),
(33,'Larry','Holden',49,1),
(34,'Cillian','Murphy',41,9),
(35,'John','Nolan',79,3),
(36,'Julia','Deakin',64,3),
(37,'Martin','Freeman',45,3),
(38,'Nick','Frost',45,3),
(39,'Bill','Nighy',67,3),
(40,'Simon','Pegg',47,3),
(41,'Rafe','Spall',34,3),
(42,'Bruce','Greenwood',60,2),
(43,'Greg','Grunberg',51,1),
(44,'Caroline','Aaron',64,1),
(45,'Danny','Aiello',84,1),
(46,'Alan','Alda',81,1),
(47,'Alec','Baldwin',59,1),
(48,'Philip','Bosco',86,1),
(49,'Frances','Conroy',63,1),
(50,'Blythe','Danner',74,1),
(51,'Tony','Darrow',78,1),
(52,'Larry','David',70,1),
(53,'Judy','Davis',62,4),
(54,'Mia','Farrow',72,1),
(55,'Paul','Herman',71,1),
(56,'Scarlett','Johansson',32,1),
(57,'Julie','Kavner',66,1),
(58,'Diane','Keaton',71,1),
(59,'Louise','Lasser',78,1),
(60,'Douglas','McGrath',59,1),
(61,'Peter','McRobbie',74,3),
(62,'Fred','Melamed',61,1),
(63,'Tony','Roberts',77,1),
(64,'Wallace','Shawn',73,1),
(65,'Tony','Sirico',74,1),
(66,'David','Stiers',74,1),
(67,'Jack','Warden',85,1),
(68,'Sam','Waterston',76,1),
(69,'Dianne','Wiest',69,1),
(70,'Bill','Hader',39,1),
(71,'Jonah','Hill',33,1),
(72,'Leslie','Mann',45,1),
(73,'Seth','Rogen',35,2),
(74,'Paul','Rudd',48,1),
(75,'Steve','Buscemi',59,1),
(76,'Chris','Ellis',65,1),
(77,'Kim','Coates',59,2),
(78,'Megan','Fox',31,1),
(79,'Glenn','Morshower',58,1),
(80,'Brian','Stepanek',46,1),
(81,'Peter','Stormare',63,12),
(82,'Mark','Wahlberg',46,1),
(83,'Helena','Carter',51,3),
(84,'Johnny','Depp',54,1),
(85,'Danny','DeVito',72,1),
(86,'Carmin','Filpi',80,1),
(87,'Michael','Gough',95,6),
(88,'Eva','Green',37,7),
(89,'Jeffrey','Jones',70,1),
(90,'O-Lan','Jones',67,1),
(91,'Michael','Keaton',65,1),
(92,'Martin','Landau',89,1),
(93,'Christopher','Lee',93,3),
(94,'Lisa','Marie',48,1),
(95,'Deep','Roy',59,10),
(96,'Winona','Ryder',45,1),
(97,'Michael','Biehn',60,1),
(98,'Jenette','Goldstein',57,1),
(99,'Lance','Henriksen',77,1),
(100,'Bill','Paxton',61,1),
(101,'Arnold','Schwarzenegger',69,5);

-- INSERT DIRECTORS MOVIES INTO TABLE
INSERT INTO `directors_movies` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),
(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(3,20),(3,21),
(3,22),(3,23),(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(4,30),(4,31),(4,32),(5,33),(5,34),(5,35),(5,36),(5,37),
(6,38),(6,39),(6,40),(6,41),(6,42),(6,43),(6,44),(6,45),(6,46),(6,47),(6,48),(6,49),(6,50),(6,51),(6,52),(6,53),
(6,54),(6,55),(6,56),(6,57),(6,58),(6,59),(6,60),(6,61),(6,62),(6,63),(6,64),(6,65),(6,66),(6,67),(6,68),(6,69),
(6,70),(6,71),(6,72),(6,73),(6,74),(6,75),(6,76),(6,77),(6,78),(6,79),(6,80),(7,81),(7,82),(7,83),(7,84),(7,85),
(8,86),(8,87),(8,88),(8,89),(8,90),(8,91),(8,92),(8,93),(8,94),(8,95),(8,96),(9,97),(9,98),(9,99),(9,100),(9,101),
(9,102),(9,103),(9,104),(9,105),(9,106),(9,107),(9,108),(9,109),(9,110),(9,111),(9,112),(9,113),(9,114),(10,115),(10,116),(10,117),
(10,118),(10,119),(10,120),(10,121),(10,122);

-- INSERT ACTORS MOVIES INTO TABLE
INSERT INTO `actors_movies` VALUES (1,1),(1,2),(1,3),(2,3),(2,5),(2,6),(3,2),(3,5),(3,7),(3,8),(4,2),(4,8),(4,9),(4,13),(4,17),(4,18),
(5,1),(5,3),(5,4),(5,6),(6,8),(6,9),(6,10),(7,6),(7,7),(7,8),(8,1),(8,3),(8,4),(9,2),(9,6),(9,7),
(10,4),(10,6),(10,7),(10,9),(11,1),(11,3),(11,6),(11,7),(12,11),(12,12),(12,13),(13,11),(13,14),(13,15),(14,11),(14,12),
(14,13),(14,14),(14,15),(14,16),(14,17),(14,18),(15,13),(15,15),(15,17),(15,54),(15,56),(15,77),(16,14),(16,15),(16,19),(17,11),
(17,14),(17,15),(17,16),(17,17),(18,11),(18,13),(18,16),(19,13),(19,17),(19,18),(20,12),(20,13),(20,16),(21,11),(21,13),(21,18),
(22,11),(22,12),(22,15),(23,13),(23,17),(23,18),(24,12),(24,14),(24,15),(24,19),(25,12),(25,13),(25,14),(25,16),(25,17),(26,13),
(26,17),(26,18),(27,12),(27,13),(27,14),(27,16),(28,14),(28,15),(28,19),(29,11),(29,12),(29,13),(29,15),(29,16),(29,19),(30,20),
(30,21),(30,22),(30,23),(31,20),(31,21),(31,22),(31,23),(31,24),(31,25),(32,23),(32,24),(32,26),(33,20),(33,27),(33,28),(34,20),
(34,22),(34,23),(34,24),(34,26),(35,20),(35,23),(35,29),(36,30),(36,31),(36,32),(37,30),(37,31),(37,32),(38,30),(38,31),(38,32),
(39,30),(39,31),(39,32),(40,30),(40,31),(40,32),(40,33),(40,35),(40,36),(40,37),(41,30),(41,31),(41,32),(42,33),(42,34),(42,35),
(43,33),(43,36),(44,38),(44,39),(44,40),(44,41),(45,42),(45,43),(45,44),(46,38),(46,45),(46,46),(47,39),(47,47),(47,48),(48,41),
(48,49),(48,50),(49,39),(49,40),(49,51),(50,39),(50,40),(50,49),(51,41),(51,52),(51,53),(51,54),(51,55),(51,56),(52,44),(52,57),
(52,58),(53,39),(53,40),(53,41),(53,47),(53,54),(54,38),(54,40),(54,42),(54,43),(54,44),(54,49),(54,50),(54,57),(54,59),(54,60),
(54,61),(54,62),(55,43),(55,44),(55,52),(55,53),(55,57),(56,63),(56,64),(56,65),(57,39),(57,41),(57,44),(57,50),(57,57),(57,61),
(58,44),(58,45),(58,51),(58,66),(58,67),(58,68),(58,69),(58,70),(59,71),(59,72),(59,73),(59,74),(59,75),(60,54),(60,56),(60,76),
(61,41),(61,43),(61,50),(61,52),(61,53),(61,54),(61,56),(62,38),(62,40),(62,44),(62,49),(62,50),(62,61),(62,76),(63,44),(63,59),
(63,61),(63,69),(63,75),(64,44),(64,50),(64,51),(64,77),(64,78),(65,41),(65,46),(65,52),(65,53),(65,54),(65,79),(65,80),(66,46),
(66,49),(66,50),(66,53),(66,78),(67,52),(67,53),(67,62),(68,38),(68,61),(68,62),(68,70),(69,43),(69,44),(69,52),(69,61),(69,62),
(70,81),(70,82),(70,83),(71,81),(71,84),(71,85),(72,81),(72,82),(72,84),(72,85),(73,81),(73,84),(73,85),(74,81),(74,82),(74,84),
(75,86),(75,87),(75,88),(76,86),(76,87),(76,92),(77,87),(77,89),(77,90),(78,91),(78,92),(78,93),(79,87),(79,88),(79,90),(79,92),
(79,93),(79,94),(80,87),(80,92),(80,95),(81,86),(81,91),(81,95),(82,88),(82,95),(82,96),(83,97),(83,98),(83,99),(83,100),(83,101),
(83,102),(83,103),(84,99),(84,100),(84,101),(84,102),(84,103),(84,104),(84,105),(85,98),(85,107),(85,108),(85,109),(86,105),(86,110),(86,111),
(87,100),(87,102),(87,106),(87,107),(87,112),(88,103),(88,109),(88,113),(89,105),(89,106),(89,111),(90,104),(90,108),(90,113),(91,107),(91,109),
(91,111),(91,112),(92,105),(92,106),(92,114),(93,99),(93,100),(93,102),(93,103),(93,106),(93,114),(94,97),(94,105),(94,106),(94,108),(95,97),
(95,98),(95,99),(95,100),(96,104),(96,111),(96,114),(97,115),(97,116),(97,117),(97,118),(98,116),(98,118),(98,119),(99,115),(99,116),(99,120),
(100,115),(100,116),(100,119),(100,121),(100,122),(101,115),(101,118),(101,121);

-- INSERT MOVIES COUNTRIES INTO TABLE
INSERT INTO `movies_countries` VALUES (1,1),(2,1),(2,13),(3,1),(4,1),(5,1),(6,1),(7,1),
(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(13,3),(13,13),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(20,3),
(21,1),(21,3),(22,1),(22,3),(23,1),(23,3),(24,1),(24,3),(25,1),(25,3),(26,1),(26,3),(26,7),(26,14),(27,1),(28,1),
(29,3),(30,1),(30,3),(30,7),(31,1),(31,3),(31,7),(32,1),(32,3),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),
(40,1),(41,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(47,15),(48,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),
(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(62,1),(63,3),(63,16),(64,1),(64,3),(65,1),(65,17),(66,1),(67,1),
(68,1),(69,1),(70,1),(71,1),(72,1),(73,1),(74,1),(75,1),(76,1),(77,1),(78,1),(79,1),(80,1),(81,1),(82,1),(83,1),
(84,1),(85,1),(86,1),(87,1),(88,1),(89,1),(90,1),(91,1),(92,1),(93,1),(94,1),(95,1),(96,1),(96,18),(97,1),(98,1),
(99,1),(99,3),(100,1),(100,3),(101,1),(101,3),(102,1),(103,1),(104,1),(105,1),(106,1),(107,1),(108,1),(109,1),(110,1),(111,1),
(112,1),(113,1),(114,1),(115,1),(116,1),(117,1),(118,1),(119,1),(120,1),(120,14),(120,15),(121,1),(122,1);