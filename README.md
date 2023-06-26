# Build the Docker Image:
docker build -t your-app-name .

# Push Docker Image to Docker Hub or Other Registry:
docker login  # Log in to your Docker Hub account
docker tag your-app-name your-dockerhub-username/your-app-name
docker push your-dockerhub-username/your-app-name

# Deploy Your Docker Image:
There are many ways to deploy Docker images. The exact method will depend on your host or cloud provider. For example, if you're using a cloud provider, they will have specific instructions on how to deploy Docker containers. If you're deploying to a VM or physical server, you could SSH into the server, install Docker, and use docker run to start your application.

// Smells like DigitalOcean - Ubuntu


expose app to internet
server {
    listen 80;

    location /v1/vaults {
        proxy_pass http://localhost:<your-app-port>;
    }
}