#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER $DB_USER PASSWORD '$DB_PASSWORD';
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
  ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
EOSQL

for script in $(/usr/bin/find /database_migrations -type f -iname '*.sql' | sort); do
  echo "Running $script";
  POSTGRES_PASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -d "$DB_NAME" -w -f "$script"
done