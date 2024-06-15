
const { Queue } = require('bull'); // Example using Bull with Redis
const queues = new Map();

function getQueue(clientId) {
    if (!queues.has(clientId)) {
        queues.set(clientId, new Queue(`queue_${clientId}`));
    }
    return queues.get(clientId);
}

function addRequestToQueue(clientId, request) {
    const queue = getQueue(clientId);
    queue.add(request);
}

module.exports = { getQueue, addRequestToQueue };
