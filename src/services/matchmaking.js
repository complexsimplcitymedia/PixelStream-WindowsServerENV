import { v4 as uuidv4 } from 'uuid';

class MatchmakingService {
  constructor() {
    this.rooms = new Map();
    this.waitingClients = new Set();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, {
      id: roomId,
      clients: new Set(),
      maxClients: 2
    });
    return roomId;
  }

  joinRoom(clientId, roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    if (room.clients.size >= room.maxClients) return false;
    
    room.clients.add(clientId);
    return true;
  }

  findMatch(clientId) {
    if (this.waitingClients.size > 0) {
      const roomId = this.createRoom();
      const waitingClient = Array.from(this.waitingClients)[0];
      this.waitingClients.delete(waitingClient);
      
      this.joinRoom(waitingClient, roomId);
      this.joinRoom(clientId, roomId);
      
      return roomId;
    } else {
      this.waitingClients.add(clientId);
      return null;
    }
  }

  leaveRoom(clientId, roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    room.clients.delete(clientId);
    if (room.clients.size === 0) {
      this.rooms.delete(roomId);
    }
  }
}

export const matchmaking = new MatchmakingService();