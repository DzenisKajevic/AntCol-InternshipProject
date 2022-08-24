const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');


async function connectDB() {
    try {
        const dbURI = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
        console.log(`Connecting to ${dbURI}`);
        await mongoose.connect(dbURI, {
            maxPoolSize: 50,
            authSource: dbConfig.database,
            user: dbConfig.user,
            pass: dbConfig.password,
        })
        console.log("Connected to DB");
        //.then(() => console.log('connected'))
        //.catch(e => console.log(e));
    }
    catch (e) {
        console.log(e);
    }
};

/*
async function query(sql, params) {
  const connection = await mysql.createConnection(dbConfig);
  const [results, ] = await connection.execute(sql, params);

  return results;
}
*/

module.exports = {
    connect: connectDB
}
