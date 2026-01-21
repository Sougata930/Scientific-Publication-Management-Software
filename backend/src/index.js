import { app } from "./app.js";

import { connectDb } from "./db/db.js";
import "dotenv/config";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed !!", err);
  });
