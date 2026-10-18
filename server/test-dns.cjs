const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.fdpcuro.mongodb.net",
  (err, records) => {
    if (err) {
      console.error("DNS lookup failed:", err);
      process.exitCode = 1;
      return;
    }

    console.log("SRV records resolved successfully:", records);
  }
);