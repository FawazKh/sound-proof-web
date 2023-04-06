# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 443 available to the world outside this container
EXPOSE 443

# Define environment variables
ENV FLASK_APP app.py
ENV GUNICORN_CMD_ARGS="--bind=0.0.0.0:443 --workers=4 --threads=12 --keyfile /app/adhoc.key --certfile /app/adhoc.crt"

# Generate a self-signed SSL certificate
RUN openssl req -x509 -newkey rsa:4096 -nodes -out adhoc.crt -keyout adhoc.key -days 365 -subj "/C=US/ST=California/L=San Francisco/O=MyApp/OU=App/CN=localhost"

# Run the command to start Gunicorn
CMD ["gunicorn", "app:app"]
