const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 5000;

require("dotenv").config();

/* Connecting to the database and then starting the server. */
// https://stackoverflow.com/questions/38921414/mongodb-what-are-the-default-user-and-password


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("HELLO")
    app.listen(PORT, console.log("Server started on port ", process.env.PORT ));
  })
  .catch((err) => {
    console.log(err);
  });


