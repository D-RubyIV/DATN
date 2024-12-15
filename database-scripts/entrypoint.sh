#!/bin/bash
set -e

# Start SQL Server in the background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 20s

echo "Running initialization scripts..."
for file in /database-scripts/*.sql; do
    echo "Running $file..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "ComplexP@ssw0rd" -i "$file"
done

# Wait for SQL Server to stop
wait