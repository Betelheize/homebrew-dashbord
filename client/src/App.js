import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaTerminal, 
  FaDownload, 
  FaInfoCircle, 
  FaSync, 
  FaCog,
  FaBox,
  FaArrowUp,
  FaClock,
  FaStar
} from 'react-icons/fa';
import './App.css';

function App() {
  const [homebrewData, setHomebrewData] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homebrewResponse, systemResponse] = await Promise.all([
        axios.get('/api/homebrew/updates'),
        axios.get('/api/system/info')
      ]);
      setHomebrewData(homebrewResponse.data);
      setSystemInfo(systemResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch Homebrew data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageInfo = async (packageName) => {
    try {
      const response = await axios.get(`/api/homebrew/package/${packageName}`);
      setPackageInfo(response.data);
      setSelectedPackage(packageName);
    } catch (err) {
      setTerminalOutput(prev => [...prev, `❌ Error: Package ${packageName} not found`]);
    }
  };

  const installPackage = async (packageName) => {
    try {
      setInstalling(true);
      setTerminalOutput(prev => [...prev, `📦 Installing ${packageName}...`]);
      const response = await axios.post(`/api/homebrew/install/${packageName}`);
      setTerminalOutput(prev => [...prev, `✅ Successfully installed ${packageName}`]);
      fetchData(); // Refresh data
    } catch (err) {
      setTerminalOutput(prev => [...prev, `❌ Error installing ${packageName}: ${err.response?.data?.error || err.message}`]);
    } finally {
      setInstalling(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const addTerminalLine = (line) => {
    setTerminalOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  if (loading) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">
          <FaTerminal className="terminal-icon" />
          <span>Homebrew Dashboard</span>
          <div className="terminal-controls">
            <div className="control red"></div>
            <div className="control yellow"></div>
            <div className="control green"></div>
          </div>
        </div>
        <div className="terminal-content">
          <div className="loading-spinner">
            <FaSync className="spinning" />
            <span>Loading Homebrew data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <FaTerminal className="terminal-icon" />
        <span>Homebrew Dashboard</span>
        <div className="terminal-controls">
          <div className="control red"></div>
          <div className="control yellow"></div>
          <div className="control green"></div>
        </div>
      </div>
      
      <div className="terminal-content">
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ❌ {error}
          </motion.div>
        )}

        <div className="dashboard-grid">
          {/* System Info Panel */}
          <motion.div 
            className="terminal-panel system-panel"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="panel-header">
              <FaCog className="panel-icon" />
              <span>System Info</span>
            </div>
            <div className="panel-content">
              {systemInfo && (
                <>
                  <div className="info-row">
                    <span className="label">Homebrew:</span>
                    <span className="value">{systemInfo.brewVersion}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">System:</span>
                    <span className="value">{systemInfo.systemInfo}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Disk:</span>
                    <span className="value">{systemInfo.diskUsage}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Updates Panel */}
          <motion.div 
            className="terminal-panel updates-panel"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="panel-header">
              <FaSync className="panel-icon" />
              <span>Updates</span>
              <button 
                className="refresh-btn"
                onClick={fetchData}
                disabled={loading}
              >
                <FaSync className={loading ? 'spinning' : ''} />
              </button>
            </div>
            <div className="panel-content">
              {homebrewData && (
                <>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <FaArrowUp className="stat-icon" />
                      <span className="stat-number">{homebrewData.outdatedCount}</span>
                      <span className="stat-label">Outdated</span>
                    </div>
                    <div className="stat-item">
                      <FaBox className="stat-icon" />
                      <span className="stat-number">{homebrewData.installedCount}</span>
                      <span className="stat-label">Installed</span>
                    </div>
                    <div className="stat-item">
                      <FaClock className="stat-icon" />
                      <span className="stat-number">
                        {new Date(homebrewData.lastUpdate).toLocaleTimeString()}
                      </span>
                      <span className="stat-label">Last Update</span>
                    </div>
                  </div>
                  
                  {homebrewData.outdatedPackages.length > 0 && (
                    <div className="outdated-list">
                      <h4>Outdated Packages:</h4>
                      {homebrewData.outdatedPackages.slice(0, 5).map((pkg, index) => (
                        <div key={index} className="package-item">
                          <span className="package-name">{pkg.name}</span>
                          <span className="package-version">{pkg.current_version} → {pkg.newest_version}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Popular Packages Panel */}
          <motion.div 
            className="terminal-panel popular-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="panel-header">
              <FaStar className="panel-icon" />
              <span>Popular Packages</span>
            </div>
            <div className="panel-content">
              {homebrewData?.popularPackages && (
                <div className="popular-list">
                  {homebrewData.popularPackages.slice(0, 10).map((pkg, index) => (
                    <div 
                      key={index} 
                      className="popular-item"
                      onClick={() => fetchPackageInfo(pkg.name)}
                    >
                      <span className="package-name">{pkg.name}</span>
                      <span className="package-installs">{pkg.installs} installs</span>
                      <button 
                        className="install-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          installPackage(pkg.name);
                        }}
                        disabled={installing}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Package Info Panel */}
          {selectedPackage && packageInfo && (
            <motion.div 
              className="terminal-panel package-panel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="panel-header">
                <FaInfoCircle className="panel-icon" />
                <span>{selectedPackage}</span>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setSelectedPackage(null);
                    setPackageInfo(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="panel-content">
                <pre className="package-info">{packageInfo.info}</pre>
                <button 
                  className="install-btn full-width"
                  onClick={() => installPackage(selectedPackage)}
                  disabled={installing}
                >
                  <FaDownload />
                  Install {selectedPackage}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Terminal Output */}
        <motion.div 
          className="terminal-output"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="output-header">
            <span>Terminal Output</span>
            <button 
              className="clear-btn"
              onClick={() => setTerminalOutput([])}
            >
              Clear
            </button>
          </div>
          <div className="output-content">
            {terminalOutput.length === 0 ? (
              <span className="no-output">No terminal activity yet...</span>
            ) : (
              terminalOutput.map((line, index) => (
                <div key={index} className="output-line">
                  {line}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App; 