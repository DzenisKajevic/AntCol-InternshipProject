Install dependencies:
    cd server
    npm install
    (if npm install doesn't work, do npm install --legacy-peer-deps)
To start the server, run:
    cd server
    node index.js
To access the Docs API (Swagger documentation), go to:
    localhost:3001/api-docs
How to use locked API calls:
    Use the register / login route
    Copy the returned JWT token
    Paste the JWT into one of the locks