# Hostinger Deployment Guide

## 1. Prepare Your Files

**CRITICAL:** Do NOT include the `node_modules` folder in your zip file. This is the #1 cause of 503 errors because Windows dependencies don't work on Linux servers.

1.  Select all files in your `server` folder **EXCEPT**:
    - `node_modules` folder
    - `.git` folder (if strictly `server` folder)
    - `.env` (You should set environment variables in Hostinger dashboard, but if you must, you can include it only if it doesn't contain local secrets)
2.  Right-click -> Send to -> Compressed (zipped) folder.
3.  Name it `server.zip`.

## 2. Upload to Hostinger

1.  Go to your File Manager (public_html or subdomain folder).
2.  Upload `server.zip`.
3.  Right-click `server.zip` -> Extract.
4.  Ensure the files are in the root of your domain/subdomain, not inside a subfolder like `server/`.

## 3. Install Dependencies

1.  In Hostinger, verify you have **Node.js 18** or higher selected.
2.  Go to the **NPM** section (or SSH/Terminal).
3.  Run:
    ```bash
    npm install
    ```
    _This downloads the correct Linux versions of your dependencies._

## 4. Run the Server

1.  Ensure your `package.json` has:
    ```json
    "scripts": {
      "start": "node index.js"
    }
    ```
2.  Hostinger usually runs `npm start` automatically.

## 5. Troubleshooting

- **503 Error**: Usually means the server crashed. Check `server_debug.log` if you have one, or the Hostinger Error Logs.
- **Database**: Ensure `database/users.sqlite` is writable. Permissions should be 644 or 666.
