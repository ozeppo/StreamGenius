
# StreamGenius 🎶🧠

StreamGenius is an advanced music player that combines traditional player features with modern AI technology. The application is fully open-source and self-hosted, meaning you can run it on your own server and customize it to suit your needs.

## Key Features

- **Music Playback:** Play songs from your collection with options for looping, shuffling, and traditional queue management.
- **AI Shuffle:** The AI-powered shuffle intelligently sorts your play queue so that similar songs play next to each other, making for a smooth listening experience.
- **Playlist Management:** Create, edit, and manage playlists easily. Add songs to playlists directly from the music list or the player interface.
- **Artist and Album Management:** View detailed artist profiles and album collections. Upload custom images for artists, albums, and playlists.
- **Customizable UI:** Enjoy a sleek, dark-themed interface reminiscent of popular music streaming services like Spotify and Apple Music.
- **Responsive Design:** The application is designed to work seamlessly across different devices, from desktops to mobile.

## Installation Guide

To set up the StreamGenius on your own server, follow these steps:

### Prerequisites

- **Node.js** and **npm** installed on your server.
- **MongoDB** for the backend database.
- **ffmpeg** for audio processing.

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ozeppo/StreamGenius.git
   cd ai-music-player
   ```

2. **Install Dependencies:**

   Navigate to both the backend and frontend directories and install the required dependencies:

   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the backend directory with the following content:

   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Start the Application:**

   First, start the backend server:

   ```bash
   cd backend
   npm start
   ```

   Then, start the frontend development server:

   ```bash
   cd ../frontend
   npm run serve
   ```

5. **Access the Application:**

   Open your web browser and navigate to `http://localhost:8080` to access the StreamGenius.

## Project Structure

- **Backend:** Handles API routes, music analysis, and database management.
- **Frontend:** The Vue.js application that provides the user interface.

## Customization

You can customize the application by editing the Vue.js components in the `frontend/src` directory or by modifying the Express.js routes in the `backend/src` directory.

## Contributing

We welcome contributions! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Screenshots

<!-- Placeholder for screenshots of the application -->
![Home Screen](https://i.imgur.com/1TH2KGU.png)
![Artist Profile](https://i.imgur.com/US4TjwV.png)
![Albums](https://i.imgur.com/SzSL0BS.png)
