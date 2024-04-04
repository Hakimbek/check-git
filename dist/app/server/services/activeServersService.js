class ActiveServersService {
    constructor() {
        this.servers = [];
    }

    isServerActive(name, port) {
        return this.servers.some(server => server.name === name || server.port === port);
    }

    add(server) {
        if (!server || !server.port || !server.name) {
            throw new Error('Server should be initialized before to be registered');
        } else {
            this.servers.push(server);
        }
    }

    remove(name) {
        const index = this.servers.findIndex(server => server.name === name);

        if (~index) {
            this.servers.splice(index, 1);
        }
    }
}

module.exports = new ActiveServersService();
