from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login_with_invalid_credentials():
    response = client.post(
        "/admins/login",
        json={
            "email": "wrong@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_login_with_valid_credentials():
    response = client.post(
        "/admins/login",
        json={
            "email": "securitytest@coffeehub.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["access_token"]