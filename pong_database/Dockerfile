FROM postgres:15.1-alpine

COPY init-user-db.sh /docker-entrypoint-initdb.d/init-user-db.sh
RUN chmod 755 /docker-entrypoint-initdb.d/init-user-db.sh

#psql -U test -w