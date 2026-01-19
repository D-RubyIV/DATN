# Stage 1: Build the application using Maven
FROM maven:3.8.4-eclipse-temurin-17 AS build

# Set the working directory within the container to /app
WORKDIR /backend

# Copy all files from the current directory (.) to the container's working directory (/app)
COPY /backend .

# Run the Maven clean install command with the option to skip tests
RUN mvn clean install -DskipTests

# Stage 2: Create a lightweight container with only the necessary artifacts
FROM amazoncorretto:17-alpine

# Set the working directory within the container to /app

# Copy the built JAR file from the previous stage into the current stage
COPY --from=build /backend/target/*.jar server.jar

# Expose port 8080 to allow external connections to the application
EXPOSE 8080

# Specify the command to run when the container starts - run the Java application using the JAR file
CMD ["java", "-jar", "server.jar"]