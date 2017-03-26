/* global describe, it */
/* eslint-disable no-sync, global-require */
const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;

function keysStartWith (keys, str) {
  return keys.every((key) => key.indexOf(str) === 0);
}

function keysDoNotStartWith (keys, str) {
  return keys.every((key) => key.indexOf(str) === -1);
}

describe('eslint-config-nrk', () => {
  it('should not combine base rules with react rules', () => {
    const files = fs.readdirSync(path.resolve(__dirname, '../rules'));

    files
      .forEach((file) => {
        const config = require(`../rules/${file}`);
        if (typeof config.rules === 'undefined') {
          return;
        }
        if (file === 'react.js') {
          // Make sure all react rules starts with `react/`
          assert.equal(keysStartWith(Object.keys(config.rules), 'react/'), true);
        } else if (file === 'jsx.js') {
          // Naive test: make sure the config is an object
          assert.equal(typeof config === 'object', true);
        } else {
          // Make sure none of the base rules starts with `react/`
          assert.equal(keysDoNotStartWith(Object.keys(config.rules), 'react/'), true);
        }
      });
  });
});
