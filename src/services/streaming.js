import { webRTCConfig } from '../config/webrtc-config.js';
import { logger } from '../utils/logger.js';

class StreamingService {
  constructor() {
    this.streams = new Map();
    this.encoderCapabilities = null;
  }

  async initializeEncoderCapabilities() {
    if (!this.encoderCapabilities) {
      this.encoderCapabilities = await RTCRtpSender.getCapabilities('video');
      logger.info('Available video codecs:', this.encoderCapabilities.codecs);
    }
  }

  async createPeerConnection(streamId, preferredCodec = 'h264') {
    await this.initializeEncoderCapabilities();
    
    const peerConnection = new RTCPeerConnection({
      ...webRTCConfig,
      portRange: webRTCConfig.encoderSettings.portRange
    });

    // Add video transceiver with specific encoding parameters
    const transceiver = peerConnection.addTransceiver('video', {
      direction: 'sendonly',
      sendEncodings: webRTCConfig.encodings
    });

    // Configure preferred codec
    const codecConfig = webRTCConfig.codecs[preferredCodec];
    if (codecConfig) {
      const selectedCodec = this.encoderCapabilities.codecs.find(
        codec => codec.mimeType.toLowerCase() === codecConfig.mimeType.toLowerCase()
      );

      if (selectedCodec) {
        const params = {
          codecs: [selectedCodec],
          headerExtensions: transceiver.sender.getParameters().headerExtensions
        };
        await transceiver.setCodecPreferences(params.codecs);
        logger.info(`Using codec: ${selectedCodec.mimeType}`);
      } else {
        logger.warn(`Preferred codec ${preferredCodec} not available, using default`);
      }
    }

    // Configure bandwidth constraints
    const sender = transceiver.sender;
    const parameters = sender.getParameters();
    if (parameters.encodings) {
      parameters.encodings.forEach(encoding => {
        encoding.maxBitrate = webRTCConfig.encoderSettings.maxBitrate;
        encoding.maxFramerate = webRTCConfig.encoderSettings.maxFramerate;
      });
      await sender.setParameters(parameters);
    }

    // Handle ICE candidate gathering
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        logger.debug('New ICE candidate:', event.candidate);
      }
    };

    // Monitor connection state
    peerConnection.onconnectionstatechange = () => {
      logger.info(`Connection state changed: ${peerConnection.connectionState}`);
      if (peerConnection.connectionState === 'failed') {
        this.handleConnectionFailure(streamId);
      }
    };

    this.streams.set(streamId, peerConnection);
    return peerConnection;
  }

  async handleOffer(streamId, offer, preferredCodec) {
    try {
      const peerConnection = await this.createPeerConnection(streamId, preferredCodec);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      });

      await peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      logger.error('Error handling offer:', error);
      throw error;
    }
  }

  handleConnectionFailure(streamId) {
    logger.error(`Connection failed for stream ${streamId}`);
    this.closeConnection(streamId);
  }

  async addIceCandidate(streamId, candidate) {
    const peerConnection = this.streams.get(streamId);
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        logger.error('Error adding ICE candidate:', error);
      }
    }
  }

  closeConnection(streamId) {
    const peerConnection = this.streams.get(streamId);
    if (peerConnection) {
      peerConnection.close();
      this.streams.delete(streamId);
      logger.info(`Closed connection for stream ${streamId}`);
    }
  }
}

export const streaming = new StreamingService();