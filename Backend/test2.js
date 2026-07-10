import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.axhpwvg.mongodb.net",
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);