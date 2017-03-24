INSERT INTO "user".user (id, name, region_code, phone_number, password, status)
VALUES (10972333086098 ,'TestUser', '+86', '13800138001', crypt('123456', gen_salt('bf', 8)), 2)
;

INSERT INTO "user".profile (user_id, nickname, avatar, birthday, gender, city)
VALUES (10972333086098, 'D.Luffy', 'http://cdn.myanimelist.net/images/characters/12/274103.jpg', '1980-1-1', 1, 1)
;
