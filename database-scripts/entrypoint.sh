#!/bin/bash
set -e

# Start SQL Server in the background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to accept connections
echo "Waiting for SQL Server to start..."
while ! /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; do
    echo "SQL Server is not ready yet..."
    sleep 5
done

# Run initialization scripts
echo "Running initialization scripts..."
for file in /database-scripts/*.sql; do
    if [ -f "$file" ]; then
        echo "Running $file..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i "$file"
    fi
done

# Wait for SQL Server to stop
wait