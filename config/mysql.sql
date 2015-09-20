

CREATE TABLE states (
    id SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state_name  VARCHAR(20)  UNIQUE NOT NULL
) ENGINE = INNODB DEFAULT CHARSET=utf8;

CREATE TABLE contacts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
    last_name TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    number INT NOT NULL,
    street TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
    suburb TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
    `state` SMALLINT(5) UNSIGNED NOT NULL,
    FOREIGN KEY (`state`) REFERENCES states(id)
) ENGINE = INNODB DEFAULT CHARSET=utf8;

INSERT INTO states (state_name) VALUES ("NSW");
INSERT INTO states (state_name) VALUES ("VIC");
INSERT INTO states (state_name) VALUES ("WA");
INSERT INTO states (state_name) VALUES ("QLD");
INSERT INTO states (state_name) VALUES ("NT");

INSERT INTO contacts (first_name, last_name, number, street, suburb, state) VALUES 
("Mehran 1", "Dowlat 1", 191, "walker", "sub 1", 1 );

INSERT INTO contacts (first_name, last_name, number, street, suburb, state) VALUES 
("Mehran 2", "Dowlat 2", 192, "walker", "sub 1", 2 );

INSERT INTO contacts (first_name, last_name, number, street, suburb, state) VALUES 
("Mehran 3", "Dowlat 3", 193, "walker", "sub 1", 3 );
