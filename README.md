<h1 align="center">SeatBooked 💺</h1>
<h3 align="center">An Online Ticket Booking Platform</h3>

## Built with Microservice Architecture

- **Authentication Service** `/auth` - This service is responsible for managing the Authentication workflow of the platform.
- **Client Service** `/client` - This service is responsible for managing the Client-side web view of the platform built using Next.js.
- **Expiration Service** `/expiration` - This service is responsible for managing the ticket expiration logic of the platform.
- **Orders Service** `/orders` - This service is responsible for managing all the order routes and order logic of the platform.
- **Payments Service** `/payments` - This service is responsible for managing all the payment routes and payment logic of the platform.
- **Tickets Service** `/tickets` - This service is responsible for managing all the ticket routes and ticket logic of the platform.

## Getting Started

Follow the steps below, after cloning the project:

### 🖐 Requirements

- Node
- Yarn
- Docker
- Skaffold (Handles the workflow for building, pushing and deploying your kubernetes application)

### ⏳ Installation

- (Use **docker** to run the project locally (must). [Install docker with these docs](https://docs.docker.com/engine/install/)

- (Use **skaffold** to run the project locally (must). [Install skaffold with these docs](https://skaffold.dev/docs/install/)

```bash
skaffold dev
```

**Note - Use the following command to create .env secrets `kubectl create secret generic [secret-name] --from-literal=[secret-key]=[secret-value]`. For example `kubectl create secret generic JwtTokenKey --from-literal=JWT_KEY=XYZ`**

This command will start up all the above mentioned services at once by going through kubernetes files in `./infrastructure/k8s` directory and download all the docker images from dockerhub required to run the application locally.

Feel free to raise any issues or to make a pull request.
Enjoy, Happy Coding 🎉
