# summer-hackathon2025

Hello world! There's our small project that's being developed during FAF & Sigmoid Hackathon Event.

The theme is: **Lack of Practical Project-Based Learning**

# Tech Stack:

Backend: Python 3.10, FastAPI, torch, transformers (for LLM)


Database: MySQL


Frontend: <to be filled>



# Setup

Well, the setup is easy if you have been working without docker (I hope I'll make a docker container).

**Backend:**

1. First of all install Python 3.10 - [Python Release Python 3.10.7 | Python.org](https://www.python.org/downloads/release/python-3107/) (I've been using 3.10.7)

2. Go to backend 

3. Create a virtual environment for python `python -m venv venv`

4. Activate it. Windows: `.\venv\Scripts\activate.bat` 
   GNU\Linux: `source venv/bin/activate`

5. Install dependencies `pip install -r requirements.txt`

6. Run the main script `python main.py`

7. Go to `http://localhost:8000` to check if it works

**Frontend**

1. Install Node JS - <here goes link>

2. Install dependencies `npm i` or `npm install`

3. Run `npm run build`

# How does it work?

**Backend:**

The backend is a common API server built with `FastAPI` library for Python. It uses JSON Web Tokens (JWT) to communicate between frontend and its internals.

It consists of the following routes:

### `/api/v1/auth/token` - `POST`

Route for obtaining JWT tokens

- Uses OAuth2 with password flow for authentication

- Tokens are generated using HS256 algorithm

- Token expiration time is configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 30 minutes)

Example:

```python
# Request

curl -X POST "http://localhost:8000/api/v1/auth/token" \

     -H "Content-Type: application/x-www-form-urlencoded" \

     -d "username=user123&password=secretpass"



# Response

{

    "access_token": "eyJhbGciOiJIUzI1NiIs...",

    "token_type": "bearer"

}
```

### `/api/v1/users/register` - `POST`

Route for registering new users

- Passwords are hashed using bcrypt

- Username uniqueness is enforced

- Data is stored in SQLite database (default: `test.db`)

Example:

```python
# Request

curl -X POST "http://localhost:8000/api/v1/users/register" \

     -H "Content-Type: application/json" \

     -d '{

           "username": "newuser",

           "password": "userpass123"

         }'



# Response

{

    "id": 1,

    "username": "newuser"

}
```

### `/api/v1/users/me` - `GET`

Route for getting current user information

- Requires valid JWT token in `Authorization: Bearer <token>` header

- Returns information about the currently authenticated user

Example:

```python
# Request

curl -X GET "http://localhost:8000/api/v1/users/me" \

     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."



# Response

{

    "id": 1,

    "username": "newuser"

}
```

### `/api/v1/llm/generate` - `POST`

Route for text generation using LLM model

- Uses Gemma 3B-4bit model for text generation

- Supports generation parameter tuning (temperature, top_p, top_k)

- Model runs in CPU mode for compatibility

- Requires pre-downloaded model in `models/gemma-3-4b-it` directory

Example:

```python
# Request

curl -X POST "http://localhost:8000/api/v1/llm/generate" \

     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \

     -H "Content-Type: application/json" \

     -d '{

           "prompt": "Write a poem about programming",

           "max_length": 512,

           "temperature": 0.7,

           "top_p": 0.95,

           "top_k": 50

         }'



# Response

{

    "response": "In lines of code, a story unfolds..."

}
```

Additional Technical Details:

- CORS is configured to accept requests from all domains (should be restricted in production)

- API documentation is available at:

  - Swagger UI: `/api/v1/docs`

  - ReDoc: `/api/v1/redoc`

  - OpenAPI JSON: `/api/v1/openapi.json`

- Server health can be checked via `/api/v1/health`

- All configurations are loaded from environment variables or `.env` file

- Database is automatically initialized on application startup

**Frontend:**

To be continued!

# Our team:

| Photo                                                                                                                                             | Name      | Role                                                                    | Github                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| <img title="" src="https://avatars.githubusercontent.com/u/197951069" alt="" width="91">                                                          | Anastasia | Team Lead<br/>Frontend Developer                                        | [Click](https://github.com/Anastasia11111111114) |
| <img src="https://i.imgur.com/nm2Gugw.png" title="" alt="ds" width="91">                                                                          | Alex      | Backend Developer<br/><br/>(Technically Full-Stack but prefers backend) | [Click](https://github.com/handwerk2016)         |
| <img src="https://avatars.githubusercontent.com/u/52779739?v=4" title="" alt="https://avatars.githubusercontent.com/u/52779739?v=4" width="98">   | Ilya      | Frontend Developer                                                      | [Click](https://github.com/STIDchannel)          |
| <img src="https://avatars.githubusercontent.com/u/209294428?v=4" title="" alt="https://avatars.githubusercontent.com/u/209294428?v=4" width="95"> | Andrei    | Web Designer                                                            | [Click](https://github.com/ProstoAndriuha)       |



Music playlist used during codding: https://soundcloud.com/kazaxskij-diplomat/likes