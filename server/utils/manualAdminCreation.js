const bcryptjs = require('bcryptjs');

// cd to utils, node .\manualAdminCreation.js

async function hashPass(password) {
    const salt = await bcryptjs.genSalt(10);
    password = await bcryptjs.hash(password, salt);
    console.log(password);
}

hashPass("admin");