# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY . .

# Ensure mvnw has execution permissions
RUN chmod +x ./mvnw

RUN ./mvnw clean package -DskipTests


# Run stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Maven outputs the jar to the target/ directory
COPY --from=build /app/target/*.jar app.jar

# Copy knowledge files
COPY --from=build /app/src/main/resources/knowledge /app/src/main/resources/knowledge

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]