# Assignment 4

**Due at 4:59pm on Wednesday, 11/23/2016**

**Code Blog entry due at 4:59pm on Monday, 11/28/2016**

The goals of this assignment are to start to do some routing with Express and to start working with Handlebars for templating both on the server and on the client.  Your job is to complete a server app and several Handlebars templates and to incorporate client-side functionality that inserts elements into the DOM with the help of Handlebars.

Once completed, your app will run a more comprehensive version the ToDoIt app we've been working with in previous assignments.  Indeed, this app is starting to resemble what a small production web app might look like.

Details follow about the tasks you must complete for the assignment.  Note that many of these components are intertwined, so you won't necessarily be able to implement them in the order in which they're listed below.

## Handlebars templates

You are provided with several complete Handlebars templates and a few incomplete ones in `views/` and its subdirectories.  You must complete the following templates to round out the view functionality of the app:

  * `views/partials/todo.handlebars` - This template should represent a single todo note:

  ![todo note screenshot](/screenshots/todo-note.png?raw=true)

  More details on how to implement this template are included inside the template file.  These notes will be included in the notes page in `views/notes-page.handlebars`.

  * `views/partials/user-select.handlebars` - This template should display all of the users listed in `users-data.json` in a selection dropdown:

  ![user selection list screenshot](/screenshots/user-selection-list.png?raw=true)

  More details on how to implement this template are included in the template file.  This user selection list is included in the index page implemented in `views/index-page.handlebars`.

  * `views/notes-page.handlebars` - This template should display all of the notes for a given user:

  ![notes page screenshot](/screenshots/notes-page.png?raw=true)

  More details on how to implement this template are included in the template file.  You will route to this page from your server app.

## Client-side creation of notes

You must complete the client-side function `generateTodoHTML()` in `public/generate-todo.js`.  This function will be called whenever the user clicks the "accept" button in the new note modal.  It will be provided with the values from the input fields in that modal and should use the Handlebars template you implemented in `views/partials/todo.handlebars` to generate and return an HTML string representing a new todo note filled out with the passed-in values.

The event handling, genration of a DOM note from your HTML string, and insertion of that DOM node into the document are already hooked up, so you don't need to worry about those things.  All you have to do is use your todo template to produce the correct HTML string.

## Server-side routing

You should add routing to the Express app in `server.js` to make the entire app behave as expected.  The routing needs to handle four main cases:

  * Files in `public/` should be served statically and should be availale out of the root path ('/').  For example, the file `public/style.css` should be available at the path '/style.css'.

  * The root path ('/') should be routed to the index page implemented by `views/index-page.handlebars`.

  * The dynamic path '/notes/<USER>' should be routed to the notes page implemented by `views/notes-page.handlebars`, but only for existing users.

  * Any non-existent path, or any path '/notes/<USER>' for a user that does not exist should be routed to the 404 page implemented by `views/404-page.handlebars`.

Each of these pages must receive the appropriate data to fill in the corresponding Handlebars templates.  In particular:

  * For every page, the page title (displayed in the browser tab) must be set.  See `views/layouts/main.handlebars` to figure out how to set this. For the index and 404 pages, the title should simply be 'ToDoIt'. For a user's notes page, the title should be 'ToDoIt - <NAME>', where <NAME> is the "logged-in" user's name.

  * The index page must receive data to enable it to complete the list of users in your template in `views/partials/user-select.handlebars`.

  * The navbar (implemented in `views/partials/header.handlebars`), is set up to display the user's name whenever there is a user "logged in". You must provide the appropriate data to your pages to make this happen.  You can see an example of the "logged-in" behavior in the screenshot of the notes page above.

  * The notes page obviously must receive the data it needs to display the "logged-in" user's notes.

## Development using npm

With this assignment, you will need to use npm much more than you did in the last assignment.  The first thing you should do when you clone this code onto your development machine is to install the required dependencies:
```
npm install
```

As you are developing, you should get into the habit of using `npm` to start your server instead of using `node` directly.  In particular, to start your server, you should run:
```
npm start
```

For this assignment, starting your server this way is particularly important, because the package is set up so that some extra needed work is done before the server starts.  Specifically, because you will be using your todo note template on the client (in addition to using it in the server), that template must be *precompiled* into JavaScript.  A `build` step is defined in the `scripts` section of `package.json` to perform this precompilation and to output the resulting JS code into a file in `public/` so it can be accessed and used by your client-side code.

In addition, a `prestart` script is defined in `package.json` so that the precompilation is run *automatically* before the server is started whenever you run `npm start`.  This will ensure that the freshest version of your template is made available to the client when it requests it.

## Understanding infrastructure

Note that one important part of this assignment will be understanding the existing infrastructure provided to you to get you started.  You should trace through the code given to you so that you understand how it fits together and how you must modify it.  This might seem like a daunting task, but the ability to understand code given to you is an important skill.  This will be a good, small-sized project in which to practice that skill.  Still, don't hesitate to ask questions on Piazza or in person.

## Grading criteria

Note that, while there is a good deal of infrastructure provided to you in this assignment, you should only modify the following files:

  * `server.js`
  * `views/notes-page.handlebars`
  * `views/partials/todo.handlebars`
  * `views/partials/user-select.handlebars`
  * `public/generate-todo.js`

In addition, no dependencies beyond the ones already defined in `package.json` (express and express-handlebars) should be used.

The assignment is worth 100 points total:

  * 10 points: all files in `public/` are served statically at the appropriate path

  * 15 points: the root path ('/') is routed to the index page, and the appropriate data is provided to fill out all details of the index page template (page title and user selection list).

  * 20 points: the dynamic route '/notes/<USER>' routes to the corresponding user's notes page, and the appropriate data is provided to fill out all details of the notes page template (page title, navbar username, and all of the user's pre-defined notes)

  * 10 points: any other unhandled path is routed to the 404 page, and a 404 status is returned

  * 10 points: the todo note template is completed so that the todo notes contain all the appropriate information in the correct format

  * 10 points: the notes page template is completed so that all of a user's pre-defined notes are displayed

  * 10 points: the user selection list template is completed so that all the pre-defined users are able to be "logged in"

  * 15 points: the function `generateTodoHTML()` is correctly implemented so that new todo notes can be added on the client

## Code Blog

Add an entry to your Code Blog reflecting on your experience with this assignment.  Here are some questions you could answer (though these aren't the only ones):

  * What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

  * What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

  * What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Piazza forum?  The TAs?  How did you use each of these resources?

  * What are one or two things you had to Google to complete the assignment?

Publish your new entry to the same place where you published your other Code Blog entries.

This Code Blog entry is due at 4:59pm on Monday 11/28/2016.

## Submission

As always, we'll be using GitHub Classroom for this assignment. You will submit your assignment via GitHub.  Just make sure your completed `server.js` file is committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. github.com/OSU-CS290-F16/assignment-4-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.
