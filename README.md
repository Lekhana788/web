# [Enter Your Project Name]

## Project Description

A modern, responsive full-stack web application built with Node.js, Express, MongoDB, and a polished front-end using Bootstrap 5 and glassmorphism design. This app features user registration, login, a secure dashboard, CRUD operations, search, pagination, sorting, filtering, light/dark mode, toast notifications, and responsive mobile-first layout.

## Folder Structure

```
project/
│
├── client/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── pages/
│   └── index.html
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── package.json
└── README.md
```

## Installation

1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file in the `server/` folder with the following values:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_connection_uri`
   - `JWT_SECRET=your_jwt_secret`
4. Run the backend with `npm run dev`.
5. Open `client/index.html` in the browser or host it with a static server.

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive a JWT.
- `GET /api/auth/profile` - Get current authenticated user profile.

### Tasks
- `GET /api/tasks` - Get tasks with optional search, page, sort, and filter.
- `POST /api/tasks` - Create a new task.
- `GET /api/tasks/:id` - Get task by ID.
- `PUT /api/tasks/:id` - Update task.
- `DELETE /api/tasks/:id` - Delete task.

## Environment Variables

- `PORT` - Server port.
- `MONGODB_URI` - MongoDB Atlas connection URI.
- `JWT_SECRET` - Secret key for signing JWT tokens.

## Deployment

### Frontend → Vercel
1. Create a new Vercel project.
2. Connect the repository.
3. Set the build command to `npm run build` if using a build step, or simply deploy static files.
4. If needed, point the output directory to `client`.

### Backend → Render
1. Create a new Web Service on Render.
2. Connect the repository and set the root to `server`.
3. Set environment variables in Render.
4. Deploy using `npm start`.

### Database → MongoDB Atlas
1. Create a new Atlas cluster.
2. Create a database user.
3. Whitelist your client IP or use `0.0.0.0/0` for testing.
4. Copy the connection string into `MONGODB_URI`.

## Sample Data

Use the app to register a user and create tasks from the dashboard.

## Future Enhancements

- Add admin panel with user role management.
- Email verification and password reset flow.
- Real-time updates with WebSockets.
- Dark mode sync with system preferences.
- Analytics charts and user activity logs.

## Screenshots

- `screenshots/landing-page.png`
- `screenshots/dashboard.png`
- `screenshots/profile-page.png`
- `screenshots/task-management.png`
