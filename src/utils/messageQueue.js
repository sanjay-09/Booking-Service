const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME,REMINDER_BINDING_KEY} = require('../config/serverConfig');

const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel(); 
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, REMINDER_BINDING_KEY);


        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service,  REMINDER_BINDING_KEY) => {
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');

        // channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, REMINDER_BINDING_KEY);

        channel.consume(applicationQueue.queue, msg => {
            console.log('received data');
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
    
}

const publishMessage = async (channel, REMINDER_BINDING_KEY, message) => {
    try {
       
        await channel.publish(EXCHANGE_NAME, REMINDER_BINDING_KEY, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}