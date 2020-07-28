import fs from 'fs';
import util from 'util';
import childProcess from 'child_process'
import nodeGit from 'nodegit';
import archiver from 'archiver';

const exec = util.promisify(childProcess.exec);

const  {
  BITBUCKET_USERNAME,
  BITBUCKET_PASSWORD,
  BITBUCKET_REPO_PATH_ORIGIN
} = process.env;

const fetchOpts = {
  callbacks: {
    certificateCheck: () => 0,
    credentials: () => nodeGit.Cred.userpassPlaintextNew(BITBUCKET_USERNAME, BITBUCKET_PASSWORD)
  }
};

const localRepoPath = 'repo'
const zippedRepoFilePath = `${localRepoPath}.zip`;

export default function getRepoZip(branch) {
  return cloneRepo(branch)
    .then(npmInstall)
    .then(zipRepo)
    .then(deleteRepo)
    .then(() => zippedRepoFilePath)
}

function cloneRepo(branch) {
  const cloneOptions = {
    checkoutBranch: branch,
    fetchOpts
  };
  return nodeGit.Clone(BITBUCKET_REPO_PATH_ORIGIN, localRepoPath, cloneOptions);
}

function npmInstall() {
  return exec(`npm install --prefix ${localRepoPath}`)
}

function zipRepo() {
  return new Promise((res, rej) => {

    const output = fs.createWriteStream(zippedRepoFilePath);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes\nArchiver has been finalized and the output file descriptor has closed.');
      res();
    });
    archive.on('error', (err) => err && rej());

    archive.pipe(output);
    archive.directory(localRepoPath, false);
    archive.finalize();
  })
}

function deleteRepo() {
  fs.rmdir(localRepoPath, {recursive: true}, (err) => err && console.error(err))
}
