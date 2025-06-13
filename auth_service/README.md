This service provides authentication endpoints for the Wellness App, including registration, login, token refresh, and logout.

## Running with Docker

1. **Build the Docker image:**
   ```bash
   cd auth_service
   docker build -t auth-service .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 8000:8000 --name auth-service auth-service
   ```

   - The service will be available at `http://localhost:8000`

3. **Environment Variables (optional):**
   - You can create a `.env` file to override defaults (e.g., database URL, secret key).

## API Endpoints

### 1. Register

- **POST** `/auth/register`
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "doctor_email": "doctor@example.com",
    "first_name": "First",
    "last_name": "Last",
    "date_of_birth": "1990-01-01",
    "age": 30,
    "language_preference": "en",
    "timezone": "America/Los_Angeles",
    "postpartum_start_date": "2023-01-01",
    "doctor_name": "Dr. Smith"
  }
  ```

### 2. Login

- **POST** `/auth/login`
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "<jwt>",
    "refresh_token": "<refresh_token>"
  }
  ```

### 3. Refresh Token

- **POST** `/auth/refresh`
- **Payload:**
  ```json
  {
    "refresh_token": "<refresh_token>"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "<jwt>"
  }
  ```

### 4. Logout

- **POST** `/auth/logout`
- **Payload:**
  ```json
  {
    "refresh_token": "<refresh_token>"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

## Development

- To run locally:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  uvicorn core.main:app --reload
  ```

---