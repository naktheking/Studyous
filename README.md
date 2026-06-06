# STUDYOUS

Studyous is a web application that runs locally on your computer. Make posts planning your study sessions, add friends to view, like, and comment on their posts, and view your own post statistics and weekly streaks.

## Setup and Usage

**Prerequisites**
- Node.js v18
- npm
- MongoDB Atlas account
- Google Cloud account (for OAuth)

**Installations**

To install the necessary packages required for this application, first run the following command in your terminal:
```bash
npm install
```

To install the necessary packages required to test the backend this application, run the following commands in your terminal from the Studyous directory:
```bash
cd tests
npm install
npm install --save-dev jest
npm install --save-dev supertest
```

To install the necessary packages required to run end-to-end tests for this application, run the following commands in your terminal from the Studyous directory:
```bash
cd tests
npm install
npm install -D @playwright/test
npx playwright install
```


**Setting Up .env**

To set up your own connection to the MongoDB database and Google OAuth login, create a .env file in the Studyous root directory.

In your .env file, paste the following:
```env
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=
```
Next, fill in the corresponding credentials as follows:
- Create a MongoDB Atlas database and copy the connection string into `MONGODB_URI`.
- Create OAuth credentials in Google Cloud. Copy the Client ID and Client Secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, respectively.
- Generate any random value for `SESSION_SECRET`. Your value should be at least 20 characters, containing numbers, letters, and special characters in no particular order.

**Running the program**

Once inside the Studyous directory, open two separate terminals. 
In the first terminal, run the following:
```bash
   cd backend
   npm run dev
```
Once you have received the output `Connected to MongoDB`, switch to the second terminal and run
```bash
   cd frontend
   npm run dev
```

Once the previous steps have been completed, enter the URL `http://localhost:5173/` in your preferred browser to view and interact with the application locally.

**Testing the program**

Once inside the Studyous directory, run the following commands to run backend tests:
```bash
   cd tests
   npm run test
```
Once inside the Studyous directory, run the following commands to run end-to-end tests:
```bash
   cd tests
   npm run e2e
```

## Features

**Login**
- Studyous features a secure login through Google—just link your Google account to sign up.
  
**Post**
- Create a post featuring the location, time, and date of your current or future study sessions.
- Posts are visible to all of your friends.

**Friends & Feed**
- Enter your friends' username to send them a friend request. Once added, you will be able to see their posts.
- Study sessions posted by your friends will appear as a scrolling feed. Like, comment, or react to your friends' posts to show your support.

**Post Statistics**
- View your own past posts, as well as some statistics about your posting history.
- Features your total number of posts, weekly streak and hours spent studying, and top studying location of all time.

## Tests

===Backend===
**Accounts**
-Tests the features of creating an account with a username and password, and logging in with those credentials

**Friends**
-Tests the features of sending a friend request, accepting a friend request, and rejecting a friend request

**Posts**
-Tests the feature of creating and getting posts

===End-To-End===
**Accounts**
-Tests the UI interaction and overall functionality of creating an account with a username and password, and logging in with those credentials

**Friends**
-Tests the UI interaction and overall functionality of sending a friend request, accepting a friend request, and rejecting a friend request

