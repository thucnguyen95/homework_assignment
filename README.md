# homework_assignment
This is a homework assignment. I did my best not to utilize bootstrap/materialui.

## Getting Started
1. git clone the repository
2. cd into the cloned repository
3. Run `npm install` 
4. Run `npm start` to serve the application locally (dev mode)
5. Run `npm test` to execute the test runner

## Notes
The application is served on port **8080**. If npm start doesn't navigate to this tab, please visit **localhost:8080** to view the application.

Please run `npm test` multiple times if testing. I am unsure as to why there is a possible timeout. It may be due to the use of act() from react-dom/test-utils or that I didn't properly configure the testing environment, or because of the use of lambdas being discouraged in Mocha. I'd love to know how this can be resolved.