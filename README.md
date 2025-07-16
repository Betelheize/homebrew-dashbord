# 🍺 Homebrew Dashboard

A modern terminal UI-style web dashboard for monitoring Homebrew packages, updates, and new releases. Stay technologically updated with a beautiful interface that mimics your favorite terminal.

![Homebrew Dashboard](https://img.shields.io/badge/Homebrew-Dashboard-green?style=for-the-badge&logo=homebrew)

## ✨ Features

- **🔄 Real-time Updates**: Monitor Homebrew updates and new packages
- **📊 System Information**: View Homebrew version, system info, and disk usage
- **📦 Package Management**: Install packages directly from the dashboard
- **⭐ Popular Packages**: Discover trending packages from Homebrew analytics
- **🎨 Terminal UI**: Beautiful terminal-inspired interface with green matrix theme
- **📱 Responsive Design**: Works on desktop and mobile devices
- **⚡ Live Terminal Output**: See real-time installation progress

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Homebrew installed on macOS
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd homebrew-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
homebrew-dashboard/
├── server/                 # Backend Express server
│   └── index.js           # API endpoints
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Terminal UI styles
│   │   └── index.js       # React entry point
│   └── public/
│       └── index.html     # HTML template
├── package.json           # Backend dependencies
└── README.md             # This file
```

### Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm run install-all` - Install dependencies for both backend and frontend

## 🔧 API Endpoints

### Homebrew Data
- `GET /api/homebrew/updates` - Get Homebrew updates and package information
- `GET /api/homebrew/package/:name` - Get specific package information
- `POST /api/homebrew/install/:name` - Install a package

### System Information
- `GET /api/system/info` - Get system and Homebrew version information

## 🎨 UI Components

### Dashboard Panels

1. **System Info Panel**
   - Homebrew version
   - System information
   - Disk usage

2. **Updates Panel**
   - Number of outdated packages
   - Installed packages count
   - Last update timestamp
   - List of outdated packages

3. **Popular Packages Panel**
   - Trending packages from Homebrew analytics
   - Installation counts
   - Quick install buttons

4. **Package Info Panel**
   - Detailed package information
   - Installation options
   - Package description and dependencies

5. **Terminal Output**
   - Real-time installation progress
   - Error messages
   - System commands output

## 🎯 Use Cases

### For Developers
- Monitor Homebrew updates without leaving your browser
- Discover new useful packages
- Quick installation of popular tools
- System health monitoring

### For System Administrators
- Centralized Homebrew management
- Batch package monitoring
- System resource tracking
- Installation history

## 🔒 Security Considerations

- The dashboard runs local commands using `brew`
- No external package installation without user consent
- All operations are logged in the terminal output
- API endpoints are protected against injection attacks

## 🐛 Troubleshooting

### Common Issues

1. **"brew command not found"**
   - Ensure Homebrew is installed: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. **Permission denied errors**
   - Make sure the Node.js process has permission to execute `brew` commands
   - Check if Homebrew is in your PATH

3. **Port already in use**
   - Change the port in `server/index.js` or kill the process using the port

4. **CORS errors**
   - Ensure the backend is running on port 3001
   - Check that the proxy is correctly configured in `client/package.json`

### Debug Mode

To enable debug logging, set the environment variable:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Homebrew](https://brew.sh/) - The package manager for macOS
- [React](https://reactjs.org/) - The web framework used
- [Express](https://expressjs.com/) - The backend framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting](#troubleshooting) section
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

**Made with ❤️ for the Homebrew community**
