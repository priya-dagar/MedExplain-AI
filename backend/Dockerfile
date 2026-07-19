# --- Build stage ---
FROM python:3.11-slim AS builder

WORKDIR /app

# System deps needed to build some Python packages (e.g. psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# --- Runtime stage ---
FROM python:3.11-slim

WORKDIR /app

# Runtime-only system deps (psycopg2 needs libpq at runtime too)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# No --reload in production — that's a dev-only uvicorn flag
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]