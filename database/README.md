# Wellness App Database

This folder contains everything needed to run the Wellness App database in a Docker container.

## Files

- **Dockerfile:** Builds a Docker image based on the official PostgreSQL image and automatically initializes the database schema.
- **schema.sql:** Contains the SQL commands to create the required tables.

## Usage

1. Build the Docker image:

   ```bash
   cd database
   sudo docker build -t wellness-db .
   ```

2. Run the container using the following command:

   ```bash
   sudo docker run -d -p 5432:5432 --name wellness-db-container wellness-db
   ```

3. Verify the database using the following command:

   ```bash
   sudo docker exec -it wellness-db-container psql -U user -d wellness - c "\dt"
   ```bash

4. Connect to the database using:

   - **Host:** localhost
   - **Port:** 5432
   - **User:** postgres
   - **Password:** postgres
   - **Database:** wellness

The SQL schema will be executed automatically when the container starts.