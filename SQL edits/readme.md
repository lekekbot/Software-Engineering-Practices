# Any SQL related stuff goes here

Problem 5 SQL:
Adds a new role within the role table 
<code>
insert into role (role_name) values('master_admin')
</code>
Adds a new table in the DB **remember to make it default**
<code>
    CREATE TABLE `user_temp` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `accepted` int NOT NULL,
    `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`)
    ) ;
</code>