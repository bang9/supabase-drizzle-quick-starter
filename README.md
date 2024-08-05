# Supabase + Drizzle + Fastify Quick starter

## Features

- **Supabase** for authentication and database management.
- **Drizzle-ORM** for easy and efficient database operations.
- **Fastify** for a high-performance server.
- **GitHub Actions** for continuous integration and continuous deployment (CI/CD).
- **Docker** for containerization of the application.
- **AWS App Runner** for seamless deployment and scaling.

```mermaid
graph TD;
    subgraph Application
        A[Supabase]
        B[Drizzle-ORM]
        C[Fastify]
    end

    subgraph CI/CD
        D[GitHub Actions]
        E[Docker]
    end

    subgraph Deployment
        F[AWS ECR]
        G[AWS App Runner]
    end

    subgraph "Supabase + Drizzle + Fastify Quick Starter"
        Application
        CI/CD
        Deployment
    end

    Application --> CI/CD
    CI/CD --> Deployment

    A --> B
    B --> C

    D --> E

    F --> G

    %% Remove background color
    classDef default fill:#fff,stroke:#000,stroke-width:1px;

```

## Deploy pipeline

- Detect Changes in supabase/migrations: DB migration to supabase database
- Detect Changes in apps/server: Docker build -> Upload to ECR -> Deploy to AWS App Runner

```mermaid
graph TD;
    A[Push to GitHub] --> B[GitHub Actions Triggered]
    B --> C{Changes Detected}
    C -->|supabase/migrations| D[Apply DB Migrations to Supabase]
    C -->|apps/server| E[Run Tests and Build Docker Image]
    E --> F[Upload Docker Image to AWS ECR]
    F --> G[Deploy Docker Image to AWS App Runner]
```
