# Vidispine Storage Checker
Node console app to check the status of your Vidispine storages.

## Run it
  1. Clone this repo: `$ git clone https://github.com/ianaya89/vs-storage-checker.git` or download it.
  2. Open your terminal and locate the repo directory.
  3. Install node dependencies: `$ npm install`
  4. Open the `env.js` file and set up the environments:
    
    `
      var envs = {
        dev: new Environment('host', 'username', 'password'),
        qa: new Environment('host', 'username', 'password'),
        uat: new Environment('host', 'username', 'password'),
        prod: new Environment('host', 'username', 'password')
      };
    `
    
  5. Run the application indicating the environment: `$ node app.js -e dev`
