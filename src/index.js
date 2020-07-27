import readline from 'readline';
import getRepoZip from './get-repo-zip';
import postToAzure from './post-to-azure';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

getBranchName()
  .then(getRepoZip)
  .then(postToAzure)
  .then(() => rl.close())
  .catch(console.error);

function getBranchName() {
  let branch = process.argv[2];
  return branch ? Promise.resolve(branch) : questionPromise('Branch Name: ')
}

function questionPromise(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  }) ;
}
