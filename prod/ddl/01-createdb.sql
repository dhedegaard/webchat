-- pg_hba example:
-- local   webchat     webchat                           md5

CREATE USER webchat WITH PASSWORD 'webchat1234';

CREATE DATABASE webchat WITH OWNER=webchat;