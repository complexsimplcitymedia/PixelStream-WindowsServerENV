# WebRTC Streaming Server

A production-ready WebRTC streaming server optimized for Unreal Engine Pixel Streaming with support for VP8, VP9, and H.264 codecs.

## 🚀 Quick Start

### Prerequisites

- Windows Server 2019/2022 with latest updates
- WSL 2 with Ubuntu 20.04
- Node.js 20.x LTS
- Git

### Installation Steps

1. **Enable WSL 2**
```powershell
# Run in PowerShell as Administrator
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

2. **Install Ubuntu on WSL 2**
```powershell
wsl --set-default-version 2
# Install Ubuntu 20.04 from Microsoft Store
```

3. **Clone Repository**
```bash
git clone https://github.com/webrtc
cd webrtc-streaming-server
```

4. **Install Dependencies**
```bash
npm install
```

5. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

6. **Configure Firewall**
```powershell
# Run in PowerShell as Administrator
New-NetFirewallRule -DisplayName "WebRTC Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "WebRTC Media" -Direction Inbound -Protocol UDP -LocalPort 49152-65535 -Action Allow
```

## 🛠️ Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (production/development)
- `LOG_LEVEL`: Logging level (info/debug/error)
- `CORS_ORIGIN`: CORS origin (default: *)

### WebRTC Configuration

Edit `src/config/webrtc-config.js` to modify:
- Codec preferences
- Bitrate settings
- ICE servers
- Video quality layers

## 🚀 Deployment

### Using Docker (Recommended)

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

```bash
# Start production server
npm start

# Or using PM2 for process management
npm install -g pm2
pm2 start src/server.js --name webrtc-server
```

## 🔍 Monitoring

### Health Check
```
GET /api/health
```

### Metrics
```
GET /metrics
```

Metrics include:
- Active connections
- Stream statistics
- Error counts
- Performance metrics

## 🔒 Security Considerations

1. **Firewall Configuration**
   - Only expose necessary ports (3000, 49152-65535)
   - Restrict access to trusted IPs if possible

2. **SSL/TLS**
   - Configure SSL certificate for production
   - Use secure WebSocket connections (wss://)

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Monitor for abuse

## 📝 Logging

Logs are stored in:
- Development: Console output
- Production: 
  - `/var/log/webrtc/error.log`
  - `/var/log/webrtc/combined.log`

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failures**
   - Check firewall rules
   - Verify ICE server configuration
   - Ensure correct port ranges

2. **Performance Issues**
   - Monitor server resources
   - Check network bandwidth
   - Verify encoder settings

3. **Codec Problems**
   - Confirm hardware encoder support
   - Check client codec compatibility
   - Verify WebRTC configuration

## 📚 API Documentation

### WebSocket Events

- `find_match`: Request matchmaking
- `stream_offer`: Initialize WebRTC stream
- `ice_candidate`: Handle ICE candidates
- `stream_stats`: Report stream statistics

### REST Endpoints

- `GET /api/health`: Server health check
- `GET /metrics`: Server metrics and statistics

## ⚠️ Important Notes

1. **Production Deployment**
   - Always use process manager (PM2)
   - Configure proper logging
   - Set up monitoring
   - Use SSL/TLS
   - Configure proper CORS

2. **Resource Requirements**
   - Minimum 4 CPU cores
   - 8GB RAM recommended
   - Sufficient network bandwidth
   - SSD storage for logs

3. **Scaling Considerations**
   - Monitor resource usage
   - Consider load balancing
   - Implement proper error handling
   - Set up alerting

## 🆘 Support

For issues and support:
1. Check troubleshooting guide
2. Review logs
3. Open GitHub issue
4. Contact support team

## 📄 License

[MIT License](LICENSE)
