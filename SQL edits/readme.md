# Any SQL related stuff goes here

Problem 5 SQL:

Adds a new role within the role table <br>

<code>
insert into role (role_name) values('master_admin')
</code> <br>

Adds a new table in the DB **remember to make it default** <br>

<code>
    CREATE TABLE `user_temp` (<br>
    `user_id` int NOT NULL AUTO_INCREMENT,<br>
    `first_name` VARCHAR(255) NOT NULL,<br>
    `last_name` VARCHAR(255) NOT NULL,<br>
    `email` VARCHAR(100) NOT NULL,<br>
    `accepted` int NOT NULL,<br>
    `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,<br>
    PRIMARY KEY (`user_id`)<br>
    ) ;
</code>
