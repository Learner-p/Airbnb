# WanderLust

WanderLust is a full-stack web application for listing, searching, and reviewing travel destinations and stays. Users can create accounts, add new listings with images (stored on Cloudinary), search/filter listings by keywords and country, and leave reviews with star ratings.

## Features

- User authentication (signup, login, logout)
- Add, edit, and delete listings with image uploads (Cloudinary)
- Responsive design for mobile and desktop
- Search and filter listings by keyword and country
- Leave reviews with star ratings and comments
- Delete your own reviews
- Flash messages for user feedback
- Secure session management with MongoDB

## Tech Stack

- Node.js, Express.js
- MongoDB & Mongoose
- EJS templating
- Bootstrap 5 (responsive UI)
- Passport.js (authentication)
- Multer & multer-storage-cloudinary (image uploads)
- Cloudinary (image hosting)
- Joi (validation)
- connect-mongo (session store)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add:
   ```
   ATLASDB_URL=your_mongodb_connection_string
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   SECRECT=your_session_secret
   ```

4. **Run the app:**
   ```sh
   npm start
   ```
   or (for development with auto-reload)
   ```sh
   nodemon app.js
   ```

5. **Visit in your browser:**
   ```
 [  http://localhost:3000](https://wanderlust-project-9mz9.onrender.com/listings)
   ```

## Folder Structure

- `/models` - Mongoose models
- `/routes` - Express routes
- `/controllers` - Route controllers
- `/views` - EJS templates
- `/public` - Static assets (CSS, JS)
- `/utils` - Utility functions and error classes



