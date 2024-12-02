CREATE TABLE USER(
    id varchar(50) PRIMARY KEY,
    name varchar(50) unique not null,
    email varchar(50) unique not null,
    password varchar(50) not null,
    confirmpassword varchar(50) not null,
    dishname varchar(50),
    content varchar(50)

);