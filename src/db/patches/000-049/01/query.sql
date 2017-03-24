--------------------------------
-- User schema and tables
--------------------------------

CREATE SCHEMA "user";

--------------------------------
-- 用户註冊信息

CREATE SEQUENCE "user".next_id_seq;

CREATE OR REPLACE FUNCTION "user".next_id(OUT result bigint) AS $$
DECLARE
    our_epoch bigint := 1466352806721;
    seq_id bigint;
    now_millis bigint;
    shard_id int := 0;
BEGIN
    SELECT nextval('"user".next_id_seq') % 128 INTO seq_id;
    SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 12;
    result := result | (shard_id << 7);
    result := result | (seq_id);
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE "user".user
(
  id bigint DEFAULT "user".next_id() NOT NULL,
  name varchar,
  password varchar,
  status int DEFAULT 1,
  region_code varchar,
  phone_number varchar,
  email varchar,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE UNIQUE INDEX idx_unique_user_name
  ON "user".user
  USING btree
  (lower(name::text) COLLATE pg_catalog."default");

CREATE UNIQUE INDEX idx_unique_user_phone_number
  ON "user".user
  USING btree
  (lower(phone_number::text) COLLATE pg_catalog."default");

CREATE UNIQUE INDEX idx_unique_user_email
  ON "user".user
  USING btree
  (lower(email::text) COLLATE pg_catalog."default");

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".user
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
-- user profile

CREATE TABLE "user".profile
(
  id bigint DEFAULT "user".next_id() NOT NULL,
  user_id bigint NOT NULL,
  nickname varchar,
  avatar varchar,
  birthday date,
  gender int,
  city int,
  address varchar,
  interests varchar[],
  signature text,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES "user".user (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".profile
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
-- user summary

CREATE TABLE "user".summary
(
  id bigint DEFAULT "user".next_id() NOT NULL,
  user_id bigint NOT NULL,
  followings int DEFAULT 0, -- 关注人数
  followers int DEFAULT 0, -- 粉丝人数
  events jsonb, -- 参加／组织的活动数量
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES "user".user (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".summary
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
-- user verify code

CREATE TABLE "user".verify_code
(
  id bigint DEFAULT "user".next_id() NOT NULL,
  name varchar,
  time bigint DEFAULT unix_now(),
  verify_code varchar,
  verified boolean DEFAULT false,
  action int NOT NULL,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE UNIQUE INDEX idx_unique_verify_code_name
  ON "user".verify_code
  USING btree
  (action, lower(name::text) COLLATE pg_catalog."default");

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".verify_code
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------

CREATE TABLE "user".city
(
  id serial NOT NULL,
  country varchar,
  province varchar,
  city varchar,
  country_code varchar,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".city
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
