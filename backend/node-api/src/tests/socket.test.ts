import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

describe('Real-Time Data Pathway (WebSockets)', () => {
    let io: Server;
    let serverSocket: any;
    let clientSocket: ClientSocket;
    let httpServer: ReturnType<typeof createServer>;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        
        // Setup mock namespace behavior
        io.on('connection', (socket) => {
            serverSocket = socket;
            
            socket.on('join_room', (room) => {
                socket.join(room);
            });
        });
        
        httpServer.listen(() => {
            const port = (httpServer.address() as any).port;
            clientSocket = Client(`http://localhost:${port}`);
            
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        httpServer.close();
    });

    it('should successfully establish a bidirectional connection', () => {
        expect(clientSocket.connected).toBe(true);
    });

    it('should broadcast an alert exactly as formatted in the backend', (done) => {
        const mockAlert = {
            id: 'alert-999',
            type: 'EMERGENCY_DISPATCH',
            location: { lat: 34.0522, lng: -118.2437 },
            message: 'Active suspect spotted',
            priority: 'HIGH'
        };

        // When the client receives the alert, verify the payload structure
        clientSocket.on('alert:new', (data) => {
            expect(data.id).toBe('alert-999');
            expect(data.type).toBe('EMERGENCY_DISPATCH');
            expect(data.location.lat).toBe(34.0522);
            done();
        });

        // Simulate Node.js broadcasting the alert
        serverSocket.emit('alert:new', mockAlert);
    });
});
