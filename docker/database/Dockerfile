# Use the official SQL Server image
FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

# Install sqlcmd and dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> /etc/profile.d/mssql-tools.sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the scripts to the container
COPY ./database-scripts /database-scripts

# Set ownership and permissions
RUN chown -R 1001:1001 /database-scripts && chmod +x /database-scripts/entrypoint.sh

# Switch back to the default SQL Server user
USER mssql

# Set the working directory
WORKDIR /database-scripts

# Set the entrypoint to your custom script
ENTRYPOINT ["/database-scripts/entrypoint.sh"]