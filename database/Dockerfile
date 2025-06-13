FROM postgres:15

ENV POSTGRES_DB=wellness
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=pass

COPY schema.sql /docker-entrypoint-initdb.d/