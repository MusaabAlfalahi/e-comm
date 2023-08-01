const mongoose = require("mongoose");

//Database Connection
const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })
};

module.exports = dbConnection;
