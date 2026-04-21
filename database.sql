CREATE DATABASE arogya;
USE arogya;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50) UNIQUE,
  password VARCHAR(50)
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  doctor_id INT,
  date DATE,
  time TIME
);

CREATE TABLE holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE
);

INSERT INTO doctors VALUES
(1,'Dr. Sharma','09:00','17:00','13:00','14:00'),
(2,'Dr. Mehta','10:00','18:00','14:00','15:00');

select * from appointments;
