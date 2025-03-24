## Radient Backend - User Authentication & Session Management
This project implements secure User Authentication and robust Session Management for a Node.js Express application. It uses MongoDB as the primary database for user data and Redis for caching session data to enhance performance and scalability.

## Folder structure
![image](https://github.com/user-attachments/assets/11179637-1218-442f-a55f-81b2334764fc)

## Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Session Store: Redis
- Email Service: Nodemailer (or any SMTP service)
- Validation: express-validator
- Password Hashing: bcrypt
- Logging: winston
- Testing: Jest 

## Installation
# Clone Repo


- git clone https://github.com/Sumithrat49/Radient.git
- cd Radient
   ## Install Dependencies
- npm install
## Set Environment Variables Create a .env file in root:


- PORT=
- MONGO_URI=your_mongodb_uri
- REDIS_URL=your_redis_url
- SESSION_SECRET=your_session_secret
- JWT_SECRET=your_jwt_secret
- EMAIL_USER=your_email@example.com
- EMAIL_PASS=your_email_password
- CLIENT_URL=http://localhost:3000
## Run App
 - npm start


## Security Measures
- Password hashing with bcrypt & salting.
- Input validation & sanitization with express-validator.
- Session storage in Redis with expiration handling.
- Recommend running over HTTPS in production.
- Avoid storing sensitive tokens in plain text.

 ## Logging
- Uses winston for logging authentication activities.
- Logs events like successful logins, failed attempts, password reset requests, and session terminations.
- Logs stored in logs/ directory.
## Testing
- Unit tests for controller functions & services.
- Integration tests for API endpoints.
- Uses Jest or Mocha & Supertest for testing.

## Run tests:

- npm run test or
- npx test

## Registration:
![image](https://github.com/user-attachments/assets/9d04d8b4-a817-42d3-af86-12abc71dfd1e)

## Login
![image](https://github.com/user-attachments/assets/4feefa34-cdc8-48a8-9ab7-2bf7b18850b1)

## forgot-password
![image](https://github.com/user-attachments/assets/ff1db93b-2c46-4fd0-b42e-b4d36a4f8b45)

## Logout 
![image](https://github.com/user-attachments/assets/f9c14409-37c1-4bb4-8934-31e4980c750e)



