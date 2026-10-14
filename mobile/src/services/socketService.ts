import { io, Socket } from 'socket.io-client';
import { api } from '@/services/api';
import { useEmergencyStore } from '@/store/emergencyStore';
import { useIncidentStore } from '@/store/incidentStore';
import { useAlertStore } from '@/store/alertStore';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  public connect(token?: string) {
    if (this.socket && this.isConnected) return;

    const host = api.getHost();
    const url = `http://${host}:3000`;

    try {
      this.socket = io(url, {
        transports: ['websocket'],
        auth: { token: token || 'bearer-demo-token' },
        reconnectionAttempts: 3,
        timeout: 4000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('📡 Connected to SentinelX Socket.IO server at', url);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('📡 Disconnected from SentinelX Socket.IO');
      });

      // Bind incoming events directly to stores
      this.socket.on('emergency_update', (data: any) => {
        console.log('🚨 Received emergency_update:', data);
        if (data && data.id) {
          useEmergencyStore.getState().addEmergencyFromSocket(data);
        }
      });

      this.socket.on('incident_update', (data: any) => {
        console.log('📋 Received incident_update:', data);
        if (data && data.id && data.status) {
          useIncidentStore.getState().updateIncidentStatus(data.id, data.status);
        }
      });

      this.socket.on('public_alert', (data: any) => {
        console.log('📢 Received public_alert:', data);
        if (data && data.title) {
          useAlertStore.getState().broadcastAlert(data.title, data.message, data.severity, data.area);
        }
      });
    } catch (err) {
      console.warn('Socket connection initialization error:', err);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
