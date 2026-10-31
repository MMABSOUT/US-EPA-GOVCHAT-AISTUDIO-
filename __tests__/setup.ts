import { config } from 'dotenv';
import path from 'path';
import React from 'react';

// Expose React globally for JSX transformation when running vitest without automatic jsx runtime
(globalThis as any).React = React;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

config({ path: path.resolve(process.cwd(), '.env') });
