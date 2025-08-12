# Prizebond Auto Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple and efficient web tool to automatically check your prize bond numbers against the latest prizebond draws.

---

## Features

- Load multiple JSON files containing your saved prize bond numbers.
- Manually input prize bond numbers (one per line).
- Automatically fetch and check the latest 10 prize bond draws.
- Display matches with clickable links to the official draw PDFs.
- Responsive and clean UI built with [Tailwind CSS](https://tailwindcss.com/).
- User-friendly: Select, clear, and start auto check with ease.
- Easily extendable and open for contributions.

---

## Demo

You can run the app locally or deploy it on any static hosting with backend APIs to load bonds and fetch draws.

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend API endpoints:
  - `POST /api/load-my-bonds` — Accepts JSON file names, returns bond numbers
  - `GET /api/json-files` — Lists available JSON bond files
  - `GET /api/fetch-last-10` — Fetches last 10 prize bond draws
  - `POST /api/auto-check` — Checks bonds against prize draws

### Installation

1. Clone the repo:

   ```bash
   git clone [https://github.com/ShahiShohanur/prizebond-auto-checker](https://github.com/ShahiShohanur/prizebond-auto-checker)
   cd prizebond-auto-checker
   ```

2. Install Dependencies :

   ```bash
   npm i
   ```

3. Run and save your time. 🥳
   ```bash
   node prizebond-node-ui
   ```
4. Enjoy 🥳🥳🥳🥳
   ```bash
    [http://localhost:3003]: http://localhost:3003/
   ```
