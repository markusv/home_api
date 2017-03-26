/* eslint-disable no-console, global-require */
const difference = require('lodash.difference');
const path = require('path');
// Files containing our rules
const coreRulesFile = require('../rules/core');
const es6RulesFile = require('../rules/es6');
const reactRulesFile = require('../rules/react');
const jsxRulesFile = require('../rules/jsx');
// eslint rules
const latestEslintRules = Object.keys(require('eslint/conf/eslint.json').rules);
const latestReactRules = Object.keys(require('eslint-plugin-react').rules)
  .map((ruleName) => {
    return `react/${ruleName}`;
  });

// retrieve rules from core.js
const coreRules = coreRulesFile.extends.reduce((accumulatedRules, file) => {
  const rules = require(path.join('../rules/', file)).rules;
  return Object.assign({}, accumulatedRules, rules);
}, {});

// retrieve rules from es6.js
const es6Rules = es6RulesFile.rules;

// merge rules
const base = Object.keys(Object.assign({}, coreRules, es6Rules));
const react = Object.keys(Object.assign({}, reactRulesFile.rules, jsxRulesFile.rules))
  .filter((ruleName) => ruleName.startsWith('react/'));

const replacements = require('eslint/conf/replacements.json').rules;
const addedRules = difference(latestEslintRules, base);

let removedRules = difference(base, latestEslintRules);
const replacedRules = removedRules.filter((removed) => {
  return removed in replacements;
});

removedRules = difference(removedRules, replacedRules);

const replacedRuleMapping = replacedRules.map((removed) => {
  return {from: removed, to: replacements[removed]};
});

function printRules(rules) {
  if (!rules.length) {
    return '  None';
  }
  return `  ${rules.join('\n  ')}`;
}


console.log('New rules: \n%s', printRules(addedRules));
console.log('Removed rules: \n%s', printRules(removedRules));
console.log('Replaced rules: \n%s', printRules(
  replacedRuleMapping.map((repl) => {
    return `${repl.from} => ${repl.to}`;
  })
));

console.log();

const addedReactRules = difference(latestReactRules, react);
const removeReactRules = difference(react, latestReactRules);
console.log('--- eslint-plugin-react ---');
console.log('New rules: \n%s', printRules(addedReactRules));
console.log('Removed rules: \n%s', printRules(removeReactRules));
