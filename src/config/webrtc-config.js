export const webRTCConfig = {
  // Support multiple codecs with preferences
  codecs: {
    // Primary codec for NVIDIA GPUs with NVENC
    h264: {
      mimeType: 'video/H264',
      sdpFmtpLine: 'level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f'
    },
    // Fallback codec for CPU encoding
    vp9: {
      mimeType: 'video/VP9',
      sdpFmtpLine: 'profile-id=0'
    },
    // Alternative CPU encoding option
    vp8: {
      mimeType: 'video/VP8'
    }
  },
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  sdpSemantics: 'unified-plan',
  // WebRTC configuration based on Unreal requirements
  encoderSettings: {
    maxBitrate: 20000000, // 20 Mbps default max bitrate
    minBitrate: 100000,   // 100 Kbps minimum bitrate
    maxFramerate: 60,
    degradationPreference: 'MAINTAIN_FRAMERATE',
    // Port range for WebRTC as per Unreal requirements
    portRange: {
      min: 49152,
      max: 65535
    }
  },
  // Multiple quality layers for adaptive streaming
  encodings: [
    {
      rid: 'high',
      maxBitrate: 20000000,
      maxFramerate: 60,
      scaleResolutionDownBy: 1.0,
      scalabilityMode: 'L3T3'
    },
    {
      rid: 'medium',
      maxBitrate: 10000000,
      maxFramerate: 30,
      scaleResolutionDownBy: 1.5,
      scalabilityMode: 'L2T2'
    },
    {
      rid: 'low',
      maxBitrate: 5000000,
      maxFramerate: 30,
      scaleResolutionDownBy: 2.0,
      scalabilityMode: 'L1T1'
    }
  ]
};