module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },

  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    'comma-dangle': [1, 'never'],
    'space-before-function-paren': 0,
    eqeqeq: ['off']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
