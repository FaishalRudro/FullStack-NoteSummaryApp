from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register():
    response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code in [200, 400]

def test_login_invalid():
    response = client.post("/auth/login", json={
        "username": "",
        "email": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_get_notes_unauthorized():
    response = client.get("/notes")
    assert response.status_code == 401