const port = 8000;
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');
const multer = require('multer');
const { execFile } = require('child_process');

app.use(express.static(path.resolve(__dirname, "..")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', 'py'));
  },
  filename: (req, file, cb) => {
    cb(null, 'v.mp4');
  }
});

const upload = multer({ storage: storage });

app.post('/api/video/upload', upload.single('video'), (req, res) => {
  const vFileName = req.file.filename;
  res.json({ videoUrl: '/api/video/download/' + vFileName });
});

app.get('/api/video/download/:fname', (req, res) => {
  const filename = req.params.fname;
  const filepath = path.resolve(__dirname, '..', 'py', filename);
  const newfilepath = path.resolve(__dirname, '..', 'py', 'v.mp4');

  fs.rename(filepath, newfilepath, (err) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Error renaming file');
    } else {
      console.log('File renamed successfully');
      res.download(newfilepath);
    }
  });
});

const scriptPath = path.resolve(__dirname, '..', 'py', 'script.py');

app.get('/api/video/gettranslate/', (req, res) => {
  const vPath = path.resolve(__dirname, '..', 'py', 'v.mp4');
  console.log(vPath);

  const pythonExecutable = 'python'; // Adjust this if Python executable is named differently

  execFile(pythonExecutable, [scriptPath, vPath], (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to run script' });
      return;
    }
    if (stderr) {
      console.error('Stderr:', stderr);
    }

    console.log('Results:', stdout);
    res.status(200).json({ translate: stdout });
  });
});

app.get('/translate', (req, res) => {
  res.writeHead("200", 'ok', { 'content-type': 'text/html;charset=utf-8' });
  const translate = fs.readFileSync(path.resolve(__dirname, '..', 'translate.html'));
  res.write(translate);
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
