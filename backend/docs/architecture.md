# Architecture Diagrams

## System Architecture

```mermaid
graph TD
    Client[Client App (Frontend)]
    API[Node.js / Express API]
    DB[(MongoDB Database)]
    Cloud[Cloudinary Storage]
    Socket[Socket.IO Realtime]

    Client -->|HTTP / JSON| API
    Client -->|WebSockets| Socket
    API -->|Mongoose| DB
    API -->|Upload| Cloud
    Socket -->|State| API
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB

    User->>Client: Enters Credentials
    Client->>API: POST /auth/login
    API->>DB: Find User by Email
    DB-->>API: User Document
    API->>API: Compare Password (bcrypt)
    alt Password Match
        API->>API: Generate JWT
        API-->>Client: 200 OK + Token
        Client->>Client: Store Token (LocalStorage)
    else Invalid Credentials
        API-->>Client: 400 Bad Request
    end
```
