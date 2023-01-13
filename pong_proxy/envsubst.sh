#!/usr/bin/env sh

#e:스크립트 에러나면 즉시 종료, u:선언되지않은 변수사용시 즉시종료
set -eu

envsubst '${SERVER_HOST}' < /templates/localhost.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"