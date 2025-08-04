import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function server() {
  try {
    await mongoose.connect(config.database_env!);

    app.listen(config.port, () => {
      console.log(` server is running on port ${config.port}`);
    });
  } catch (error: any) {
    console.log(`server error: ${error.message}`);
  }
}
server();