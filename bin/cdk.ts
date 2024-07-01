#!/usr/bin/env node

import { App } from 'aws-cdk-lib';

import { ApiStack } from '../cdk/lib/stacks/api-stack';

const app = new App();

const apiStack = new ApiStack(app, 'ApiStack', {
});
