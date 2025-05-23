module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript', { allowDeclareFields: true, onlyRemoveTypeImports: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
}; 