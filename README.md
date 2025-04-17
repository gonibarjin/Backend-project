This project is a small full-stack application where the backend supports a frontend interface for adding, editing, and deleting your favourite media entries. It is built with React (frontend), Express (backend), and MongoDB Atlas (database).

Please read the following documentation files:

- **`accessibility-seo.md`**
  Explains how the application is built with accessibility and SEO in mind.

- **`privacy-tracking.md`**
  Describes what kind of tracking is implemented, why it’s used, and how privacy is respected.

- **`threats-vulnerabilities.md`**
  Lists two common security vulnerabilities, with a detailed explanation of how one is mitigated in the code.

- **`performance-report.md`**
  A walkthrough of the performance optimization process using Lighthouse and Vite plugin inspect.

## Prerequisites:

Make sure Node.js (v18 or later) is installed!

## Running the Project:

    1. Clone the repository

    2. Run npm install in both backend-project and frontend (cd ../frontend) folders.

    3. Create a .env file inside the backend folder with the following line:
        Mongo_URI=(This should be replaced with the connection string I have provided in the submission form!)

    4. Start the backend server with npm run dev (the backend will now run on http://localhost:3000 or the port    defined in the code)

    5. Start the frontend with npm run dev by opening a new terminal and going to the frontend folder (cd ../frontend) (The frontend should now be running at http://localhost:5173)
