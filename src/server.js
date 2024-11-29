import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { serverConfig } from './config/server-config.js';
import { matchmaking } from './services/matchmaking.js';
import { streaming } from './services/streaming.js';
import { metrics } from './services/metrics.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: serverConfig.cors,
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors(serverConfig.cors));
app.use(express.json());

// Routes
app.use('/api', healthRouter);

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json(metrics.getMetrics());
});

// WebSocket handling
io.on('connection', (socket) => {
  metrics.incrementConnections();
  logger.info(`Client connected: ${socket.id}`);

  socket.on('find_match', async () => {
    const roomId = matchmaking.findMatch(socket.id);
    if (roomId) {
      socket.join(roomId);
      io.to(roomId).emit('match_found', { roomId });
    }
  });

  socket.on('stream_offer', async ({ streamId, offer, codec = 'h264' }) => {
    try {
      metrics.incrementStreams();
      const answer = await streaming.handleOffer(streamId, offer, codec);
      socket.emit('stream_answer', { streamId, answer });
    } catch (error) {
      metrics.incrementErrors();
      logger.error('Error handling stream offer:', error);
      socket.emit('stream_error', { 
        error: 'Failed to process stream offer',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  socket.on('ice_candidate', async ({ streamId, candidate }) => {
    try {
      await streaming.addIceCandidate(streamId, candidate);
    } catch (error) {
      logger.error('Error handling ICE candidate:', error);
    }
  });

  socket.on('stream_stats', ({ streamId, stats }) => {
    logger.debug('Stream stats received:', { streamId, stats });
    metrics.updateStreamStats(streamId, stats);
  });

  socket.on('disconnect', () => {
    metrics.decrementConnections();
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// Start server
httpServer.listen(serverConfig.port, () => {
  logger.info(`Server running on port ${serverConfig.port}`);
});