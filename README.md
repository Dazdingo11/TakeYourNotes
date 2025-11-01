# TakeYourNotes

TakeYourNotes is a full-stack notes application built with **Node.js**, **Express**, and **JavaScript**.  
It provides a smooth, inline editing experience that lets users create, edit, and manage their notes directly in the browser.

> "Never forget a thought. Capture fast, edit in place."

---

## Overview

TakeYourNotes combines a minimal UI with a fast REST API backend.  
It was designed as a bootcamp project to demonstrate full-stack integration from building a server with Express to deploying a complete web app.

---

## Features

- Add, edit, and delete notes without reloading the page
- Inline editing directly inside the note cards
- Responsive dark-themed interface
- Persistent data storage using a JSON file
- RESTful Express API with clean endpoints

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express |
| Data Storage | JSON file |
| Deployment | Render.com |

---

## Project Structure

```
notes-app/
├── public/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
├── data.json
├── server.js
├── package.json
└── README.md
```

---

## Local Setup

To run TakeYourNotes locally:

```bash
git clone https://github.com/Dazdingo11/TakeYourNotes.git
cd TakeYourNotes
npm install
npm start
```

Then open your browser and visit:

```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/notes` | Retrieve all notes |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

---

## Deployment

TakeYourNotes is deployed on **Render.com** as a live web application.  
The app automatically serves both frontend and API routes from a single Express server.

**Live Demo:**  
*(Add your Render link here once deployed)*

**Repository:**  
[https://github.com/Dazdingo11/TakeYourNotes.git](https://github.com/Dazdingo11/TakeYourNotes.git)

---

## Author

**GitHub:** [Dazdingo11](https://github.com/Dazdingo11)

---

## License

This project is open source and available under the MIT License.
