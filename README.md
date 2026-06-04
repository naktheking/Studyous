# STUDYOUS

Studyous is a web application that runs locally on your computer. Make posts planning your study sessions, add friends to view, like, and comment on their posts, and view your own post statistics and weekly streaks.

## Setup and Usage

**Installations**
To install the necessary libraries required for this application, run the following commands in your terminal:
```bash
npm install
```

**Running the program**
Once inside the Studyous directory, open two separate terminals. In one, `cd` into the `backend` directory. In the other, `cd` into the `frontend` directory.
Run the `npm run dev` command inside the `backend` terminal. Once you have received the output `Connected to MongoDB`, return to the `frontend` terminal and run `npm run dev`.

Once the previous steps have been completed, enter the URL `http://localhost:5173/` in your browser to view and interact with the application locally.

## Features

**Login**
- Studyous features a secure login through Google—just link your Google account to sign up.
  
**Post**
- Create a post featuring the location, time, and date of your current or future study sessions.
- Posts are visible to all of your friends.

**Friends & Feed**
- Enter your friends' username to see their posts.
- Study sessions posted by your friends will appear as a scrolling feed. Like, comment, or react to your friends' posts to show your support.

**Post Statistics**
- View your own past posts, as well as some statistics about your posting history.
- Features your total number of posts, weekly streak and hours spent studying, and top studying location of all time.


