const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connction', (client) => {
        setInterval(() => {
            client.send();
        },1000);
    });
};