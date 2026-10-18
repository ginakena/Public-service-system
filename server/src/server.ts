import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import dns from "node:dns";

// Set the DNS server to use for resolving hostnames
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();