# IMPORTANT
- List the text fields before the file in the file upload post requests, otherwise filtering based on those fields won't work
(Multer and browser issue, since uploads don't wait for the whole form to be uploaded
Ref: https://github.com/expressjs/multer/issues/322, https://github.com/expressjs/multer/issues/146).

Install dependencies:
    cd server
    npm install
    (if npm install doesn't work, do npm install --legacy-peer-deps)
To setup db:
- create "root" user:
    db.createUser(
    { user: "root",
                    pwd: root,  // Or  "<cleartext password>
                    roles: [ { role: "clusterAdmin", db: "admin" },
                            { role: "readAnyDatabase", db: "admin" },
                            "readWrite"] }
    )
- optionally (recommended) force login on mongodb so that the db isn't accessible without an account    
To start the server, run:
    cd server
    node index.js
To access the Docs API (Swagger documentation), go to:
    localhost:3001/api-docs
Making API calls:
    Use the register / login route
    Copy the returned JWT token
    Paste the JWT into one of the locks
Preventing duplicate files
    Set index in MongoDB (programmatically setting it does not work)
    Index: (author, songName) => unique
    (This is a workaround, the file gets uploaded again, then checked for duplicate info, due to the metadata being added separately)