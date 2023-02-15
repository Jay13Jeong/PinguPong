#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$NESTJS_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	alter user $NESTJS_USER with superuser;
	create database pong owner $NESTJS_USER;
	grant ALL privileges on database pong to $NESTJS_USER;
EOSQL

	# create user $NESTJS_USER password '$NESTJS_PASSWORD';
	# CREATE USER docker;
	# CREATE DATABASE docker;
	# GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
# 	CREATE USER docker;
# 	CREATE DATABASE docker;
# 	GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
# 	create user $NESTJS_USER password '$NESTJS_PASSWORD';
# 	alter user $NESTJS_USER with superuser;
# 	create database pong owner $NESTJS_USER;
# 	grant ALL privileges on database pong to $NESTJS_USER;
# EOSQL