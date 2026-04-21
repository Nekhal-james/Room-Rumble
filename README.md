<div align="center">
  <h1>🎮 Room Rumble</h1>
  <p><strong>A real-time multiplayer word-guessing game built for speed, fun, and seamless realtime sync!</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  </p>
</div>

<br />

Welcome to **Room Rumble**! This project is a lightning-fast, real-time word-guessing game that leverages the power of React for the frontend and Firebase for real-time multiplayer support.

---

## ✨ Features

- **Real-Time Multiplayer**: Instantly sync game state across all clients using Firebase Firestore.
- **Anonymous Authentication**: Frictionless onboarding so players can jump straight into the action.
- **Modern Tech Stack**: Scaffolded with Vite for blazing-fast development, typed with TypeScript for reliability, and built with React.

---

## 🚀 Quick Start

### 1. Clone & Install

Start by getting the code and installing the necessary dependencies.

```bash
# Install dependencies
npm install

# (Optional) Firebase is already listed in package.json, but you can explicitly ensure it's installed
npm install firebase
```

### 2. Firebase Setup (Your Real-Time Backend)

This game relies on Firebase to handle real-time data sync. You must create your own Firebase project to run it.

1.  **Create Project:** Visit the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Add Web App:** Click the `</>` (Web) icon on the Project Overview page to register a web app.
3.  **Get Config:** Firebase will generate a `firebaseConfig` object. Copy this.
4.  **Update Config:** Open `firebaseConfig.ts` in this repository and replace the placeholder object with the one you copied.
5.  **Database Initialization:**
    - Navigate to **Build > Firestore Database** in the left sidebar.
    - Click **Create database** and select **Production mode**. Choose a location closest to your users.
6.  **Security Rules:**
    - Go to the **Rules** tab in Firestore.
    - Delete the existing rules and paste the exact contents of the `firestore.rules` file found in this project. Click **Publish**.
7.  **Authentication:**
    - Navigate to **Build > Authentication** and click **Get started**.
    - Under the **Sign-in method** tab, enable **Anonymous** authentication and save.

### 3. Run Locally

Once Firebase is configured, spin up the local development server:

```bash
npm run dev
```

Your app will launch locally, instantly connected to your shiny new Firebase backend!

---

## 🌍 Deploy to the Web

Ready to share your game with the world? Firebase Hosting makes it incredibly easy.

1.  **Install Firebase CLI:** *(One-time setup)*
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Hosting:**
    ```bash
    firebase init hosting
    ```
    - Select **Use an existing project** and choose your game project.
    - Set the public directory to **`dist`** (Vite's default build folder).
    - Configure as a single-page app (Rewrite all URLs to `/index.html`)? **Yes**.
    - Set up automatic builds and deploys with GitHub? **No** (You can do this later).

4.  **Build the App:**
    ```bash
    npm run build
    ```

5.  **Deploy Everything!**
    ```bash
    firebase deploy
    ```

Firebase will provide you with a live, shareable URL. Have fun rumbling!
