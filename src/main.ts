import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as bootstrap from 'bootstrap';

console.log('Bootstrap:', bootstrap);
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
