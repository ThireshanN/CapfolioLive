export const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "admincapfolio",
    port: "3306",
    database: "Capfolio",
  },
  listPerPage: 10,
};

//module.exports.config = config;