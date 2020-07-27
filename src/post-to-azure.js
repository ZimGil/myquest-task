import { promises as fs } from 'fs';
import axios from 'axios';

const {
  AZURE_USERNAME,
  AZURE_PASSWORD
} = process.env;

const foo = 'https://sangha-test-candidate-nodejs2020.scm.azurewebsites.net/api/zipdeploy';
const requestConfig = {
  auth: {
    username: AZURE_USERNAME,
    password: AZURE_PASSWORD
  }
};

export default function(filePath) {
  return fs.readFile(filePath)
    .then((fileBuffer) => axios.post(foo, fileBuffer, requestConfig));
}
