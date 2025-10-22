# String Analyser Service

A RESTful API service for analyzing and managing strings with advanced filtering capabilities including natural language query support.

## Features

- Create and analyze strings with detailed properties (length, palindrome check, word count, character frequency, etc.)
- Filter strings using multiple criteria
- Natural language query support
- SHA-256 hash generation for unique identification
- In-memory storage for fast access

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd string-analyser-service
```

2. Install dependencies:
```bash
npm install
```

## Dependencies

- **express**: Web framework for Node.js (v4.19.2)
- **crypto**: Built-in Node.js module for hash generation

All dependencies are listed in `package.json` and will be installed with `npm install`.

## Environment Variables

The application supports the following optional environment variable:

- `PORT`: Server port (default: `3000`)

To set a custom port:
```bash
PORT=8080 npm start
```

## Running Locally

### Option 1: Run with Node.js

Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

You should see:
```
String Analysis API running on port 3000
```

### Option 2: Run with Docker

**Build the Docker image:**
```bash
docker build -t string-analyser-service .
```

**Run the container:**
```bash
docker run -p 3000:3000 string-analyser-service
```

**Run with custom port:**
```bash
docker run -p 8080:8080 -e PORT=8080 string-analyser-service
```

**Run in detached mode:**
```bash
docker run -d -p 3000:3000 --name string-analyser string-analyser-service
```

**View logs:**
```bash
docker logs string-analyser
```

**Stop the container:**
```bash
docker stop string-analyser
docker rm string-analyser
```

## Project Structure

```
string-analyser-service/
├── src/
│   ├── config/          # Configuration files
│   │   └── app.js
│   ├── controllers/     # Request handlers
│   │   └── stringController.js
│   ├── models/          # Data models
│   │   └── stringModel.js
│   ├── routes/          # API routes
│   │   └── stringRoutes.js
│   ├── services/        # Business logic
│   │   └── stringService.js
│   └── utils/           # Utility functions
│       └── stringAnalyzer.js
├── server.js            # Application entry point
├── package.json
└── README.md
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Create/Analyze String
**POST** `/strings`

Creates and analyzes a new string.

**Request Body:**
```json
{
  "value": "hello world"
}
```

**Success Response (201 Created):**
```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T22:30:56.227Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing "value" field
- `422 Unprocessable Entity`: Invalid data type
- `409 Conflict`: String already exists

---

#### 2. Get Specific String
**GET** `/strings/:string_value`

Retrieves a specific string by its value.

**Example:**
```bash
curl http://localhost:3000/strings/hello%20world
```

**Success Response (200 OK):**
```json
{
  "id": "b94d27b9...",
  "value": "hello world",
  "properties": { ... },
  "created_at": "2025-10-22T22:30:56.227Z"
}
```

**Error Response:**
- `404 Not Found`: String does not exist

---

#### 3. Get All Strings with Filtering
**GET** `/strings`

Retrieves all strings with optional filtering.

**Query Parameters:**
- `is_palindrome`: boolean (`true`/`false`)
- `min_length`: integer (minimum string length)
- `max_length`: integer (maximum string length)
- `word_count`: integer (exact word count)
- `contains_character`: string (single character to search for)

**Example:**
```bash
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1&contains_character=a"
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-22T22:30:47.410Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "word_count": 1,
    "contains_character": "a"
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values or types

---

#### 4. Natural Language Filtering
**GET** `/strings/filter-by-natural-language`

Filter strings using natural language queries.

**Query Parameters:**
- `query`: Natural language query string

**Supported Query Patterns:**
- `"all single word palindromic strings"` → `word_count=1`, `is_palindrome=true`
- `"strings longer than 10 characters"` → `min_length=11`
- `"strings shorter than 5 characters"` → `max_length=4`
- `"palindromic strings that contain the first vowel"` → `is_palindrome=true`, `contains_character=a`
- `"strings containing the letter z"` → `contains_character=z`

**Example:**
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**Success Response (200 OK):**
```json
{
  "data": [ ... ],
  "count": 2,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "is_palindrome": true,
      "word_count": 1
    }
  }
}
```

**Error Response:**
- `400 Bad Request`: Missing "query" parameter or unable to parse

---

#### 5. Delete String
**DELETE** `/strings/:string_value`

Deletes a string by its value.

**Example:**
```bash
curl -X DELETE http://localhost:3000/strings/hello%20world
```

**Success Response:**
- `204 No Content`: String deleted successfully

**Error Response:**
- `404 Not Found`: String does not exist

---

#### 6. Health Check
**GET** `/health`

Check service health status.

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "strings_count": 5
}
```

---

## Testing the API

### Using cURL

**1. Create a string:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"value": "racecar"}' \
  http://localhost:3000/strings
```

**2. Get all strings:**
```bash
curl http://localhost:3000/strings
```

**3. Filter palindromes:**
```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

**4. Natural language query:**
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**5. Get specific string:**
```bash
curl http://localhost:3000/strings/racecar
```

**6. Delete a string:**
```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

**7. Health check:**
```bash
curl http://localhost:3000/health
```

### Test Data Examples

```bash
# Add palindromes
curl -X POST -H "Content-Type: application/json" -d '{"value": "racecar"}' http://localhost:3000/strings
curl -X POST -H "Content-Type: application/json" -d '{"value": "madam"}' http://localhost:3000/strings
curl -X POST -H "Content-Type: application/json" -d '{"value": "rotor"}' http://localhost:3000/strings

# Add non-palindromes
curl -X POST -H "Content-Type: application/json" -d '{"value": "hello world"}' http://localhost:3000/strings
curl -X POST -H "Content-Type: application/json" -d '{"value": "test string"}' http://localhost:3000/strings
```

## Example Workflows

### Finding all single-word palindromes containing 'a':
```bash
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1&contains_character=a"
```

### Finding strings between 5 and 10 characters:
```bash
curl "http://localhost:3000/strings?min_length=5&max_length=10"
```

### Using natural language:
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%206%20characters"
```

## Notes

- **In-Memory Storage**: The service uses in-memory storage (Map). Data will be lost when the server restarts. For production, integrate with a database (MongoDB, PostgreSQL, etc.).
- **SHA-256 Hash**: Each string is uniquely identified by its SHA-256 hash.
- **URL Encoding**: When passing string values in URLs, ensure proper URL encoding (e.g., spaces as `%20`).
- **Case Sensitivity**: Palindrome checks ignore case and whitespace. Character contains searches are case-sensitive.

## Future Enhancements

- [ ] Persistent database storage
- [ ] User authentication and authorization
- [ ] Rate limiting
- [ ] Pagination for large result sets
- [ ] More advanced natural language processing
- [ ] Batch operations
- [ ] String update functionality
- [ ] Export/import functionality

## License

ISC

## Author

David Brown

---

For issues or questions, please open an issue in the repository.
