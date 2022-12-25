import SeaBattleBackendServer from "./server.js";
import cleanup from "node-cleanup";
import * as config from "./services/config.service.js";
import * as DatabaseService from "./services/database.service.js";;

// Config
config.initConfig();

DatabaseService.connect();

// Start server
const server = new SeaBattleBackendServer();
server.start(config.getPort());

cleanup(() => {
	DatabaseService.client.close()
	server.stop();
	console.log("Application shutdown successful");
});
