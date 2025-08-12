# Prizebond Auto Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple and efficient web tool to automatically check your prize bond numbers against the latest prizebond draws.
This flexibility allows you to easily manage and check your bonds using the app.

---

## Features

- **Loading JSON files:** Select one or more JSON files containing your bond numbers from the file list. (data/yourJsonFile.json)
- **Both Bangla and English formats are supported:** Enter your bond numbers manually, one per line, in the provided input box or in the JSON.

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
   git clone https://github.com/ShahiShohanur/prizebond-auto-checker
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
    Visit: http://localhost:3003/
   ```

---

## You are welcome to contribute [Check Guide](CONTRIBUTING.md)

---

If you find this project helpful or enjoyable, please consider giving it a ⭐ star on GitHub. It really helps us grow and improve!

Thank you for contributing! Together we make the Prizebond Auto Checker better. 🚀
