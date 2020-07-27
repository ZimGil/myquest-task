# myquest-task

### Setup
1. Clone the repo to your machine
2. Run `npm install`
3. Run `npm run build`
4. Set environment variables:
```
BITBUCKET_USERNAME= // BitBucket Username
BITBUCKET_PASSWORD= // Bitbucket Password
BITBUCKET_REPO_PATH_ORIGIN= // Path to Bitbucket Repository
AZURE_USERNAME= // AZURE Username
AZURE_PASSWORD= // AZURE Password
AZURE_ZIPDEPLOY_PATH= // Path to AZURE ZipDeploy API
```

### Usage
There are 2 way to run this application:
1. `npm start [branchName]`
> Will use the attached branch name
2. `npm start`
> Will ask for a branch name on init
