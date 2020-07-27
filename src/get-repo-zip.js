import fs from 'fs';
import nodeGit from 'nodegit';
import archiver from 'archiver';

const  {
  BITBUCKET_USERNAME,
  BITBUCKET_PASSWORD,
  BITBUCKET_REPO_PATH_ORIGIN,
  BITBUCKET_REPO_PATH_LOCAL,
} = process.env;

const fetchOpts = {
  callbacks: {
    certificateCheck: () => 0,
    credentials: () => nodeGit.Cred.userpassPlaintextNew(BITBUCKET_USERNAME, BITBUCKET_PASSWORD)
  }
};

const target = 'target.zip';

export default function getRepoZip(branch) {
  console.log(branch)
  return cloneRepo(branch)
    .then(zipRepo)
    .then(deleteRepo)
    .then(() => target)
    .catch(console.error);
}

function cloneRepo(branch) {
  const cloneOptions = {
    checkoutBranch: branch,
    fetchOpts
  };
  return nodeGit.Clone(BITBUCKET_REPO_PATH_ORIGIN, BITBUCKET_REPO_PATH_LOCAL, cloneOptions);
}

function zipRepo() {
  return new Promise((res, rej) => {

    const output = fs.createWriteStream(target);
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
