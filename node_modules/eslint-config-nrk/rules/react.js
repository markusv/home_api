module.exports = {
  plugins: [
    'react'
  ],
  rules: {
    'react/no-array-index-key': 2,                         // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
    'react/display-name': 0,                               // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    'react/forbid-component-props': 0,                     // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
    'react/forbid-prop-types': 0,                          // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
    'react/no-children-prop': 2,                           // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
    'react/no-danger': 1,                                  // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger-with-children': 2,                    // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
    'react/no-deprecated': 0,                              // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
    'react/no-did-mount-set-state': 1,                     // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
    'react/no-did-update-set-state': 1,                    // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    'react/no-direct-mutation-state': 2,                   // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
    'react/no-find-dom-node': 2,                           // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    'react/no-is-mounted': 2,                              // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
    'react/no-multi-comp': [                               // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
      1, {
        ignoreStateless: true
      }
    ],
    'react/no-render-return-value': 2,                     // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
    'react/no-set-state': 0,                               // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
    'react/no-string-refs': 1,                             // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
    'react/no-unescaped-entities': 2,                      // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
    'react/no-unknown-property': 2,                        // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/no-unused-prop-types': 0,                       // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
    'react/prefer-es6-class': 0,                           // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
    'react/prefer-stateless-function': 0,                  // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prop-types': 2,                                 // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/react-in-jsx-scope': 2,                         // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    'react/require-default-props': 0,                      // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
    'react/require-optimization': 0,                       // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
    'react/require-render-return': 2,                      // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
    'react/self-closing-comp': 2,                          // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    'react/sort-comp': 2,                                  // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
    'react/sort-prop-types': 0,                            // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
    'react/style-prop-object': 0,                          // github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
  }
};
