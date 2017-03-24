--------------------------------
-- User functions
--------------------------------
CREATE OR REPLACE FUNCTION "user".upsert_profile(
    uid bigint,
    n varchar,
    a varchar,
    b date,
    g int,
    c int,
    s text,
    i varchar[],
    add varchar
  )
  RETURNS void AS
$BODY$
BEGIN
  UPDATE "user".profile
  SET
    nickname = n,
    avatar = a,
    birthday = b,
    gender = g,
    city = c,
    signature = s,
    interests = i,
    address = add
  WHERE user_id = uid
  ;
  IF found THEN
    RETURN;
  END IF;
  BEGIN
    INSERT INTO "user".profile (
      user_id, nickname, avatar, birthday, gender, city, signature, interests, address
    ) VALUES (uid, n, a, b, g, c, s, i, add)
    ;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
  END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------

CREATE OR REPLACE FUNCTION "user".upsert_signature(
    uid bigint,
    s text
  )
  RETURNS void AS
$BODY$
BEGIN
  UPDATE "user".profile
  SET
    signature = s
  WHERE user_id = uid
  ;
  IF found THEN
    RETURN;
  END IF;
  BEGIN
    INSERT INTO "user".profile (user_id, signature)
    VALUES (uid, s)
    ;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
  END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------

CREATE OR REPLACE FUNCTION "user".upsert_user_phone(
    rc varchar,
    pn varchar)
  RETURNS bigint AS
$BODY$
DECLARE
    uid bigint;
BEGIN
    SELECT id INTO uid
    FROM "user".user
    WHERE
      region_code = rc
      AND phone_number = pn
    ;
    IF found THEN
      RETURN uid;
    END IF;
    BEGIN
      INSERT INTO "user".user (region_code, phone_number)
      VALUES (rc, pn)
      RETURNING id INTO uid
      ;
      RETURN uid;
    EXCEPTION WHEN unique_violation THEN
    END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------

CREATE OR REPLACE FUNCTION "user".upsert_user_email(
    e varchar)
  RETURNS bigint AS
$BODY$
DECLARE
    uid bigint;
BEGIN
    SELECT id INTO uid
    FROM "user".user
    WHERE email ILIKE e
    ;
    IF found THEN
      RETURN uid;
    END IF;
    BEGIN
      INSERT INTO "user".user (email)
      VALUES (e)
      RETURNING id INTO uid
      ;
      RETURN uid;
    EXCEPTION WHEN unique_violation THEN
    END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------

CREATE OR REPLACE FUNCTION "user".upsert_interests(
    uid bigint,
    i varchar[]
  )
  RETURNS void AS
$BODY$
BEGIN
  UPDATE "user".profile
  SET
    interests = i
  WHERE user_id = uid
  ;
  IF found THEN
    RETURN;
  END IF;
  BEGIN
    INSERT INTO "user".profile (user_id, interests)
    VALUES (uid, i)
    ;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
  END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------

CREATE OR REPLACE FUNCTION "user".upsert_address(
    uid bigint,
    a varchar
  )
  RETURNS void AS
$BODY$
BEGIN
  UPDATE "user".profile
  SET
    address = a
  WHERE user_id = uid
  ;
  IF found THEN
    RETURN;
  END IF;
  BEGIN
    INSERT INTO "user".profile (user_id, address)
    VALUES (uid, a)
    ;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
  END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------
