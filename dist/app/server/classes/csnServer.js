const activeServers = require('../services/activeServersService');
const express = require('express');
const logger = require('../services/loggerService');
const {
    LOGGING_LEVELS: { ERROR, INFO },
    LOGGING_MESSAGES: { PORT_AND_NAME_SHOULD_UNIQ },
} = require('../loggerConstants');

const defaultPort = 8000;
const defaultServerName = 'CSN App';

class CsnServer {
    constructor() {
        this.name = '';
        this.port = null;
        this.app = express();
        this.expressServer = null;
    }

    start(port, rootDir, name) {
        if (this.expressServer) {
            logger.log(ERROR, `Server ${this.name} is already started`);

            return;
        }

        const applicationPort = port || process.env.PORT || this.getPortFromProcessArgs() || defaultPort;
        const applicationName = name || defaultServerName;

        if (activeServers.isServerActive(applicationName, applicationPort)) {
            logger.log(ERROR, PORT_AND_NAME_SHOULD_UNIQ);

            return;
        }

        this.name = applicationName;
        this.port = applicationPort;

        this.expressServer = this.app.listen(applicationPort, () =>
            logger.log(INFO, `${this.name} started on port ${applicationPort}`)
        );

        this.expressServer.on('close', () => activeServers.remove(this.name));

        activeServers.add(this);
    }

    close() {
        if (this.expressServer) {
            this.expressServer.close();
        }
    }

    getPortFromProcessArgs() {
        const portIndex = process.argv.indexOf('--PORT');

        return ~portIndex && process.argv[portIndex + 1];
    }
}

module.exports = CsnServer;
