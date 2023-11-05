module.exports = {
  env: {
    node: true,
  },
  extends: ['@nuxt/eslint-config', 'prettier'],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'no-undef': 'off',
  },
}
