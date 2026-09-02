-- Run once on inyatri_local_db before using mobile OTP auth APIs.
-- Skip any ADD COLUMN line if that column already exists.

ALTER TABLE users
  MODIFY firstname VARCHAR(40) NULL DEFAULT '',
  MODIFY lastname VARCHAR(40) NULL DEFAULT '',
  MODIFY email VARCHAR(60) NULL DEFAULT '',
  MODIFY city VARCHAR(200) NULL DEFAULT '',
  MODIFY address VARCHAR(300) NULL DEFAULT '',
  MODIFY password VARCHAR(60) NULL DEFAULT '',
  MODIFY token VARCHAR(512) NULL;

ALTER TABLE users ADD COLUMN country_code VARCHAR(5) NULL DEFAULT '+91' AFTER mobile;
ALTER TABLE users ADD COLUMN referral_code VARCHAR(50) NULL AFTER dob;
ALTER TABLE users ADD COLUMN marketing_opt_in TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN agreed_to_terms TINYINT(1) NOT NULL DEFAULT 0;
