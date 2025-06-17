import amqp from 'amqplib';

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queue = process.env.RABBITMQ_QUEUE || 'deliveries-queue';
    }

    async connect() {
        try {
            const defaultConfig = { // Para conectarse en local
                user: 'guest',
                password: 'guest',
                host: 'localhost',
                port: '5672'
            };

            // Handle both local and CloudAMQP URL formats
            let url;
            if (process.env.RABBITMQ_URL) {
                url = process.env.RABBITMQ_URL;
            } else {
                url = `amqp://${process.env.RABBITMQ_USER || defaultConfig.user}:${process.env.RABBITMQ_PASSWORD || defaultConfig.password}@${process.env.RABBITMQ_HOST || defaultConfig.host}:${process.env.RABBITMQ_PORT || defaultConfig.port}`;
            }
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            
            // Ensure queue exists
            await this.channel.assertQueue(this.queue, {
                durable: true
            });

            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async consume(callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            console.log(`Waiting for messages in ${this.queue}`);
            
            this.channel.consume(this.queue, async (msg) => {
                if (msg !== null) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing message:', error);
                        // Reject the message and requeue it
                        this.channel.nack(msg, false, true);
                    }
                }
            });
        } catch (error) {
            console.error('Error consuming messages:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('RabbitMQ connection closed');
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
            throw error;
        }
    }
}

export default new RabbitMQService(); 