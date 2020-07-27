const fs = require('fs');
const nodeGit = require('nodegit');
const dotenv = require('dotenv');
const archiver = require('archiver');

dotenv.config();

const  {
  BITBUCKET_USERNAME,
  BITBUCKET_PASSWORD,
  BITBUCKET_REPO_PATH_ORIGIN,
  BITBUCKET_REPO_PATH_LOCAL,
  BITBUCKET_BRANCH_NAME
} = process.env;

const fetchOpts = {
  callbacks: {
    certificateCheck: () => 0,
    credentials: () => nodeGit.Cred.userpassPlaintextNew(BITBUCKET_USERNAME, BITBUCKET_PASSWORD)
  }
};

const cloneOptions = {
  checkoutBranch: BITBUCKET_BRANCH_NAME,
  fetchOpts
};

nodeGit.Clone(BITBUCKET_REPO_PATH_ORIGIN, BITBUCKET_REPO_PATH_LOCAL, cloneOptions)
  .then(zipRepo)
  .then(deleteRepo)
  .catch(console.error);

function zipRepo() {
  return new Promise((res, rej) => {

    const output = fs.createWriteStream('target.zip');
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes\nArchiver has been finalized and the output file descriptor has closed.');
      res();
    });
    archive.on('error', (err) => err && rej());

    archive.pipe(output);
    archive.directory(BITBUCKET_REPO_PATH_LOCAL, false);
    archive.finalize();
  })
}

function deleteRepo() {
  fs.rmdir(BITBUCKET_REPO_PATH_LOCAL, {recursive: true}, (err) => err && console.error(err))
}
