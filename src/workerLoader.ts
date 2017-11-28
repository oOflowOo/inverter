import 'polyfills.ts';
import '@angular/core';
import '@angular/common';

import { platformWorkerAppDynamic } from '@angular/platform-webworker-dynamic';
import { WorkerModule } from "app/worker/worker.module";

platformWorkerAppDynamic().bootstrapModule(WorkerModule);
