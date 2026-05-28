import { version, subVersion, description } from '../../../package.json';

export default {
  appName: 'DRG Seeker Frontend',
  version,
  subVersion,
  appDescription: description,
  apiBaseUrl: 'http://localhost:3000',
  apiHis: 'http://localhost:3001',
  saveHIS: false,
  tokenName: 'drg-seeker-token'
}