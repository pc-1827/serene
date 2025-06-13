FROM postgres:15

ENV POSTGRES_DB=wellness
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=pass

# Copy SQL schema into the container to initialize the database
COPY schema.sql /docker-entrypoint-initdb.d/