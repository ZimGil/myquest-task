import { promises as fs } from 'fs';
import axios from 'axios';

const {
  AZURE_USERNAME,
  AZURE_PASSWORD,
  AZURE_ZIPDEPLOY_PATH
} = process.env;

const requestConfig = {
  auth: {
    username: AZURE_USERNAME,
    password: AZURE_PASSWORD
  }
};

export default function(filePath) {
  return fs.readFile(filePath)
    .then((fileBuffer) => axios.post(AZURE_ZIPDEPLOY_PATH, fileBuffer, requestConfig));
}
