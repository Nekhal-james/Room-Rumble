<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Room Rumble

This project is a real-time multiplayer word-guessing game built with React, TypeScript, and Firebase.

## Project Setup

**1. Install Dependencies:**
`npm install`

**2. Add Firebase:**
`npm install firebase`

## Firebase Setup (Your "Backend")

To make this game work, you must create a Firebase project. This will be your database and hosting provider.

1.  **Create Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Add Web App:** In your project's "Project Overview", click the Web icon (`</>`) to add a new web app.
3.  **Get Config:** Name your app and Firebase will give you a `firebaseConfig` object. Copy this object.
4.  **Update `firebaseConfig.ts`:** Paste the `firebaseConfig` object into the `firebaseConfig.ts` file, replacing the placeholder object.
5.  **Create Firestore Database:**
    - In the Firebase console, go to "Build" > "Firestore Database".
    - Click "Create database".
    - Start in **Production mode**.
    - Choose a location (e.g., `us-central`).
6.  **Set Security Rules:**
    - Go to the "Rules" tab within Firestore.
    - Delete all the existing text.
    - Copy the entire contents of the `firestore.rules` file from this project and paste them in.
    - Click "Publish".
7.  **Enable Anonymous Auth:**
    - Go to "Build" > "Authentication".
    - Click "Get started".
    - Go to the "Sign-in method" tab.
    - Click on "Anonymous" (it will be in the list) and **Enable** it. Save.

## Run Locally

After setting up Firebase:
`npm run dev`

Your app will be running, connected to your Firebase backend!

## Deploy Online with Firebase Hosting

1.  **Install Firebase CLI:** (You only need to do this once)
    `npm install -g firebase-tools`

2.  **Login to Firebase:**
    `firebase login`

3.  **Initialize Hosting:** (Run this in your project's root folder)
    `firebase init hosting`

    - Select "Use an existing project" and choose the project you just created.
    - What do you want to use as your public directory? **dist** (This is where Vite builds your files).
    - Configure as a single-page app (rewrite all URLs to /index.html)? **Yes**.
    - Set up automatic builds and deploys with GitHub? **No** (You can do this later).

4.  **Build Your App for Production:**
    `npm run build`

5.  **Deploy!**
    `firebase deploy`

Your game is now live on the internet! Firebase will give you the URL.
