const generalConfig = {
    expressPort: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    JWT_SECRET: process.env.JWT_SECRET || "adkn1032cxvbnn12314k1239fnua8s1032nkdkd441032nkdkmvxy4",
    JWT_LIFETIME: process.env.JWT_LIFETIME || '1d'
}

// backend + frontend da se moze uploadovati pjesma 

// admin panel sa formom 
// da se uploaduje pjesma
// na frontendu lista svih pjesama

// github handle

module.exports = generalConfig;