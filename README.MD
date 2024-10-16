# The WarmEmbrace App

Concept: Psychological Help Center
The project is an online platform for scheduling appointments with psychologists. It allows different user roles—psychologists, patients—to manage and interact with appointments effectively.


The WarmEmbrace is the final project for the Code The Dream `Node.js` class.
This is the full stack repository. 

## Technologies

The Back end is built with `Node.js` with `Express JS`.
`MongoDB` is used as a storage database.
The Front is a row `HTML` and `JS`.`React` Front coming soon.

## Additional features

- Attempt to implement Google OAuth for authenticating and registering users (coming soon)

## Links

- The URL: Link (deployed at Render)   https://zero6-jobs-api-08192024.onrender.com/

## ENV file structure

`.env` file has the following structure:
MONGO_URI = (database URI)
MONGO_URI_TEST = (database URI for testing)
PORT = 3000
JWT_SECRET =
JWT_LIFETIME =
SESSION_SECRET=


### **Requirements for the Project (Rubric)**
Create a Node/Express application from scratch using the MongoDB database. It must contain the following elements:
 
**Models & Controllers**
- [x] At least two Mongoose data models. One of these must be a User data model, as you need to implement logon.
- [x] Implement user registration and logon. A full stack project, authentication must use JWT tokens.
- [x] Model attributes should use several different data types (number, string, boolean, date, array etc.).
- [ ] Include validation of your attributes to prevent the creation of invalid records.
- [x] For any models beside the User model, implement all the CRUD (create, read, update, delete) operations in your controllers and routes.
- [] Bonus: implement some non-CRUD operations (like searching, sorting, paging, etc.).
- [x] Implement access control middleware so that at least the create/update/delete operations require authentication. You can have unauthenticated read operations if it makes sense in your application.
- [x] Implement access control logic in your controllers, so that one user can’t access another user’s data. This logic must be present for every controller operation or your application is not secure.
- [ ] Include appropriate notifications to the user. For full stack applications, the messages should be returned as needed with the API. (For some APIs, the HTTP status code suffices.) Then the front end displays the message or messages to the user. For server side rendered applications, you need to store the message in the user session, perhaps using the connect-flash NPM package.
- [x] Implement error handling middleware so that all exceptions and error conditions are handled and so that the user gets user friendly messages for each event.
- [x] Use best practices in the organization of application code and in indentation. You may want to use eslint and prettier to make sure your code complies.

**User Interface**
The user interface is the front end for full stack applications, or the EJS views for server side rendered applications. In either case, the UI should have these capabilities:
- [x] Registration, logon, and logoff are supported.
- [x] All CRUD operations for each of the data models besided the User model are supported.
- [x] Links or buttons should be provided to help the users navigate the application.
- [x] Style your application. Again, this is not the focus, so keep it simple until you have done everything else.
- [x] Deployment  https://zero6-jobs-api-08192024.onrender.com/       
- [x] Include security protections for your application. Include security packages like xss-clean and helmet, appropriately configured.
- [x] Deploy the application to Render.com. [https://zero6-jobs-api-08192024.onrender.com/]

**Bonus Items (these are entirely optional)**
- [x] Do something extra: 

> - more complicated data model
> - additional NPM packages
> - callouts to other public APIs - cloudinary 

- [x] Implement some test cases using Mocha, Chai, and Puppeteer.
- [x] For full stack applications, implement Swagger to document the API.
