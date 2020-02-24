import winston from "winston";

/* A transport is the way in which winston separates and saves various log types in different files. */
let transports = [
  new winston.transports.File({
    filename: "error.log", // generates an error.log file where only real errors are saved
    level: "error"
  }),
  new winston.transports.File({
    filename: "combined.log", // a combined log where we save all other log messages, such as warnings or info logs.
    level: "verbose"
  })
];

if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.Console()); // directly log all messages to the console while developing on the server.
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports
});

export default logger;
