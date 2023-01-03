#!/usr/bin/env sh
set -eu

envsubst '${SERVER_HOST}' < /templates/localhost.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"