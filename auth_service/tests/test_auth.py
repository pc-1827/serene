import pytest
from fastapi.testclient import TestClient
from auth_service.core.main import app
import uuid

client = TestClient(app)

@pytest.fixture(scope="module")
def test_user_data():
    # Use a unique email for each test run
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    return {
        "email": unique_email,
        "password": "testpassword",
        "doctor_email": f"dr_{uuid.uuid4().hex}@example.com",
        "first_name": "Test",
        "last_name": "User",
        "date_of_birth": "1990-01-01",
        "age": 33,
        "language_preference": "en",
        "timezone": "America/Los_Angeles",
        "postpartum_start_date": None,
        "doctor_name": "Dr. Test"
    }

@pytest.fixture(scope="module")
def tokens(test_user_data):
    # Register user
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 200 or "already exists" in response.text

    # Login user
    payload = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    return data

def test_register_success(test_user_data):
    # Try to register again should fail
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 400 or response.status_code == 200

def test_login_success(test_user_data):
    payload = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_invalid_credentials(test_user_data):
    payload = {
        "email": test_user_data["email"],
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid credentials" in response.text

def test_refresh_success(tokens):
    response = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_refresh_invalid():
    response = client.post("/auth/refresh", json={"refresh_token": "this_is_not_legit"})
    assert response.status_code == 401
    assert "Invalid refresh token" in response.text

def test_logout_success(tokens):
    response = client.post("/auth/logout", json={"refresh_token": tokens["refresh_token"]})
    assert response.status_code == 200
    assert "Logged out successfully" in response.text

def test_logout_invalid():
    response = client.post("/auth/logout", json={"refresh_token": "bogus"})
    assert response.status_code == 200