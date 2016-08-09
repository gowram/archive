# Heroku Usage Archive

Heroku postgres based archive solution for steelbrick usage billing.

### Installation

The simplest and recommended method of installation is through Heroku. Simply click the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://git.soma.salesforce.com/r-venkatachalam/heroku-usage-archive/tree/master)

### Local Installation

If you would like to run the app locally, check your [system requirements](#system-requirements), clone this
repository, and run the following from the command line:

```sh
# You only need to run the following two commands once
npm install
npm run build # static files
# This must be run each time you want to work on the project
npm start 
```

Navigate to <http://localhost:5000/> in your browser to access the app. 


### Salesforce Integration

This application can be used to demonstrate Salesforce Steelbrick usage archive with Salesforce.
To try that out, set up your Salesforce account as follows:

1. Create a Salesforce account
2. Install this Salesforce package: link to be added later

Now that your Salesforce account is set up, it's time to configure the application.
This process is different depending on whether you're setting things up locally
or if you'll be running it on Heroku.

#### Configuration

1. Be sure that you've provisioned the app before. If you have, then you will have
a `.env` file.
2. Open up `.env` and add three new fields:
  - `SALESFORCE_USER`: your Salesforce username. This is generally an email.
  - `SALESFORCE_PASSWORD`: your Salesforce password
  - `SALESFORCE_TOKEN`: your Salesforce token
  - `ARCHIVE_RULE`: your Salesforce query matching 
  - `CRON_TIME`: to set archive schedule 
    the guide [--add salesforce package here --]()
3. Restart the Node application. It will upload a Contact and the devices as Assets
  to your Salesforce account



### System Requirements

- Heroku &amp; Heroku CLI
  - heroku account with creditcard attached to account

- Node > 6
  - [http://nodejs.org](http://nodejs.org) (All Platforms)
  - `brew install node` via [Homebrew](http://brew.sh/) (OSX)
  - `apt-get/yum install node` (Linux)
