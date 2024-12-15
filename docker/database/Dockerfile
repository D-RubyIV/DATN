# Use the official SQL Server image as the base image
FROM mcr.microsoft.com/mssql/server:2019-latest

# Switch to the root user to perform privileged operations
USER root

# Install sqlcmd and dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev && \
    # Set the path for mssql-tools for all users
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> /etc/profile.d/mssql-tools.sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Switch back to the default SQL Server user
USER mssql

# Set the working directory
WORKDIR /database-scripts

# Copy the scripts to the container
COPY ./database-scripts /database-scripts

# Keep the default entrypoint
ENTRYPOINT ["/opt/mssql/bin/sqlservr"]
