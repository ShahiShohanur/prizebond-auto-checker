const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper: bangla digits to english digits
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const banglaToEnglish = (s) =>
  s
    .split('')
    .map((c) => {
      const i = banglaDigits.indexOf(c);
      return i >= 0 ? String(i) : c;
    })
    .join('');

// Extract all numbers from JSON or PDF text (only length > 5)
function extractNumbers(obj) {
  const nums = new Set();
  (function walk(o) {
    if (!o) return;
    if (Array.isArray(o)) o.forEach(walk);
    else if (typeof o === 'object') Object.values(o).forEach(walk);
    else if (typeof o === 'string' || typeof o === 'number') {
      const str = String(o);
      // match English digits with length > 5
      (str.match(/\d{6,}/g) || []).forEach((n) => nums.add(n));
      // match Bangla digits with length > 5
      (str.match(/[০-৯]{6,}/g) || []).map(banglaToEnglish).forEach((n) => nums.add(n));
    }
  })(obj);
  return [...nums];
}

// Check if PDF exists
function checkPDFExists(drawNo) {
  const url = `https://www.bb.org.bd/investfacility/prizebond/${drawNo}thdraw.pdf`;
  return new Promise((r) =>
    https
      .get(url, (res) => {
        res.destroy();
        r(res.statusCode === 200);
      })
      .on('error', () => r(false))
  );
}

// Find latest draw (start from 150 down)
async function findLatestDraw() {
  let draw = 150;
  while (draw > 0) {
    if (await checkPDFExists(draw)) return draw;
    draw--;
  }
  return null;
}

// Fetch and extract numbers from PDF url
async function fetchPDFNumbers(url) {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  const pdf = await pdfParse(data);
  return extractNumbers(pdf.text);
}

// Serve main page
app.get('/', (req, res) => {
  res.render('index');
});

// List JSON files
app.get('/api/json-files', (req, res) => {
  fs.readdir(DATA_DIR, (e, f) => {
    if (e) return res.status(500).json({ error: e.message });
    res.json({ files: f.filter((x) => x.endsWith('.json')) });
  });
});

// Load and extract numbers from selected JSON files
app.post('/api/load-my-bonds', (req, res) => {
  const files = req.body.files || [];
  if (!Array.isArray(files) || files.length === 0) return res.json({ numbers: [] });

  let bondNumbers = new Set();
  for (const file of files) {
    const safeFile = path.basename(file);
    if (!safeFile.endsWith('.json')) continue;
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, safeFile), 'utf8');
      const data = JSON.parse(raw);
      extractNumbers(data).forEach((n) => bondNumbers.add(n));
    } catch {}
  }

  res.json({ numbers: [...bondNumbers] });
});

// Fetch last 10 draws with extracted numbers (length > 5)
app.get('/api/fetch-last-10', async (req, res) => {
  try {
    const latest = await findLatestDraw();
    if (!latest) return res.json({ success: true, draws: [] });

    const draws = [];
    for (let d = latest; d > latest - 10 && d > 0; d--) {
      const url = `https://www.bb.org.bd/investfacility/prizebond/${d}thdraw.pdf`;
      try {
        const nums = await fetchPDFNumbers(url);
        draws.push({ draw: d, numbers: nums, url });
      } catch {
        draws.push({ draw: d, numbers: [], url });
      }
    }

    res.json({ success: true, draws });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auto-check matches: input my bonds + last 10 draws numbers
app.post('/api/auto-check', async (req, res) => {
  try {
    let myBonds = req.body.myBonds || [];
    if (!Array.isArray(myBonds) || myBonds.length === 0)
      return res.status(400).json({ error: 'No bond numbers provided' });
    myBonds = myBonds.map((n) => n.replace(/\D/g, '')).filter(Boolean);

    const lastDraws = req.body.draws || [];
    if (!Array.isArray(lastDraws)) return res.status(400).json({ error: 'Invalid draws data' });

    // Map: bondNumber => [drawsFoundIn]
    const foundInDraws = {};

    for (const bond of myBonds) {
      for (const draw of lastDraws) {
        // normalize draw numbers
        const normDrawNums = draw.numbers.map((n) => n.replace(/^0+/, ''));
        if (normDrawNums.includes(bond.replace(/^0+/, ''))) {
          if (!foundInDraws[bond]) foundInDraws[bond] = [];
          foundInDraws[bond].push({ draw: draw.draw, url: draw.url });
        }
      }
    }

    res.json({ success: true, foundInDraws });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
