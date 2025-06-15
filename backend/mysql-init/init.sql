CREATE DATABASE IF NOT EXISTS appdb;

-- Create users with limited access
CREATE USER 'auth_user'@'%' IDENTIFIED BY 'authpass';
CREATE USER 'purchase_user'@'%' IDENTIFIED BY 'purchasepass';

-- Create tables
USE appdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_name VARCHAR(255)
);

-- Grant permissions
GRANT SELECT, INSERT ON appdb.users TO 'auth_user'@'%';
GRANT SELECT, INSERT, UPDATE ON appdb.orders TO 'purchase_user'@'%';