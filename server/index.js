const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get Homebrew updates and new packages
app.get('/api/homebrew/updates', async (req, res) => {
  try {
    // Get Homebrew update info
    const { stdout: updateOutput } = await execAsync('brew update');
    
    // Get outdated packages
    const { stdout: outdatedOutput } = await execAsync('brew outdated --json');
    const outdated = JSON.parse(outdatedOutput);
    
    // Get recently updated packages (last 7 days)
    const { stdout: recentOutput } = await execAsync('brew list --formula');
    const installedFormulas = recentOutput.trim().split('\n');
    
    // Get Homebrew analytics for new packages
    const analyticsResponse = await fetch('https://formulae.brew.sh/analytics/install/30d/');
    const analyticsHtml = await analyticsResponse.text();
    const $ = cheerio.load(analyticsHtml);
    
    const popularPackages = [];
    $('table tbody tr').each((i, element) => {
      if (i < 20) { // Top 20 packages
        const name = $(element).find('td').eq(0).text().trim();
        const installs = $(element).find('td').eq(1).text().trim();
        popularPackages.push({ name, installs });
      }
    });
    
    res.json({
      lastUpdate: new Date().toISOString(),
      outdatedCount: outdated.length,
      outdatedPackages: outdated,
      installedCount: installedFormulas.length,
      popularPackages,
      updateOutput: updateOutput.split('\n').slice(-10).join('\n') // Last 10 lines
    });
  } catch (error) {
    console.error('Error fetching Homebrew data:', error);
    res.status(500).json({ error: 'Failed to fetch Homebrew data' });
  }
});

// Get specific package info
app.get('/api/homebrew/package/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { stdout: infoOutput } = await execAsync(`brew info ${name}`);
    res.json({ name, info: infoOutput });
  } catch (error) {
    res.status(404).json({ error: 'Package not found' });
  }
});

// Install a package
app.post('/api/homebrew/install/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { stdout, stderr } = await execAsync(`brew install ${name}`);
    res.json({ success: true, output: stdout, error: stderr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system info
app.get('/api/system/info', async (req, res) => {
  try {
    const { stdout: brewVersion } = await execAsync('brew --version');
    const { stdout: systemInfo } = await execAsync('uname -a');
    const { stdout: diskUsage } = await execAsync('df -h / | tail -1');
    
    res.json({
      brewVersion: brewVersion.trim(),
      systemInfo: systemInfo.trim(),
      diskUsage: diskUsage.trim()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system info' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Homebrew Dashboard server running on port ${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
}); 