# Use Python as the base image
FROM python:3.10

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose backend port 8002
EXPOSE 8002

# Run Django server
CMD ["gunicorn", "--bind", "0.0.0.0:8002", "Blog_app.wsgi:application"]
