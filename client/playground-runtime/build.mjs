import { build } from 'esbuild';
import fs from 'node:fs';
const out = '../public/playground';
fs.mkdirSync(out, { recursive: true });
const common = { bundle: true, minify: true, format: 'iife', platform: 'browser', target: 'es2022', legalComments: 'none', define: { 'process.env.NODE_ENV': '"production"', ngDevMode: 'false', ngJitMode: 'true' } };
fs.writeFileSync('react-entry.js', `
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Client from 'react-dom/client';
import * as Jsx from 'react/jsx-runtime';
window.__pg = { 'react': React, 'react-dom': ReactDOM, 'react-dom/client': Client, 'react/jsx-runtime': Jsx };`);
fs.writeFileSync('angular-entry.js', `
import '@angular/compiler';
import * as core from '@angular/core';
import * as interop from '@angular/core/rxjs-interop';
import * as common from '@angular/common';
import * as forms from '@angular/forms';
import * as bp from '@angular/platform-browser';
import * as rxjs from 'rxjs';
import * as ops from 'rxjs/operators';
window.__pg = { '@angular/core': core, '@angular/core/rxjs-interop': interop, '@angular/common': common, '@angular/forms': forms, '@angular/platform-browser': bp, 'rxjs': rxjs, 'rxjs/operators': ops };`);
await build({ ...common, entryPoints: ['react-entry.js'], outfile: out + '/react-runtime.js' });
await build({ ...common, entryPoints: ['angular-entry.js'], outfile: out + '/angular-runtime.js' });
for (const f of fs.readdirSync(out)) console.log(f, (fs.statSync(out + '/' + f).size / 1024).toFixed(0) + ' KB');
