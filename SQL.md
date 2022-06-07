CREATE TABLE `social_portal`.`users` (
  `name` VARCHAR(25) NOT NULL,
  `gender` CHAR(1) NOT NULL,
  `religion` VARCHAR(15) NULL,
  `political` VARCHAR(15) NULL,
  `address` VARCHAR(45) NULL,
  `studies` VARCHAR(45) NULL,
  `work` VARCHAR(45) NULL,
  `reports` JSON NULL,
  `interested_in` VARCHAR(10) NULL,
  `user_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`user_id`));

CREATE TABLE `social_portal`.`sign_in` (
  `email` VARCHAR(20) NOT NULL,
  `phone_number` BIGINT(12) NULL,
  `password` VARCHAR(16) NOT NULL,
  `user_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`email`, `user_id`));

ALTER TABLE `social_portal`.`sign_in` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`user_id`),
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE;
;
ALTER TABLE `social_portal`.`users` 
ADD CONSTRAINT `userId`
  FOREIGN KEY (`user_id`)
  REFERENCES `social_portal`.`sign_in` (`user_id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

CREATE TABLE `social_portal`.`requests` (
  `user_id` VARCHAR(15) NOT NULL,
  `alliie_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`user_id`, `alliie_id`));

CREATE TABLE `social_portal`.`posts` (
  `user_id` VARCHAR(15) NOT NULL,
  `post_react` INT NOT NULL DEFAULT 0,
  `post_photo` VARCHAR(3000) NULL,
  `post_text` VARCHAR(200) NULL,
  `post_id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `post_id_UNIQUE` (`post_id` ASC) VISIBLE);
