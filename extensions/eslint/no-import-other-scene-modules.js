'use strict';

const path = require('path');

module.exports = (context) => {
  const relativeSrcPath = path.relative(context.getCwd(), context.getFilename());

  return {
    ImportDeclaration: function (node) {
      if (!relativeSrcPath.startsWith('src/modules/')) return;
      if (!node.source.value.startsWith('../')) return;

      const importFilename = path.resolve(context.getFilename(), '..', node.source.value);
      const relativeImportPath = path.relative(context.getCwd(), importFilename);

      const currentModuleName = relativeSrcPath.split('/')[2];
      const importModuleName = relativeImportPath.split('/')[2];

      if (currentModuleName !== importModuleName) {
        context.report({
          node: node,
          message: `'${currentModuleName}' modules must not import '${importModuleName}' modules`,
        });
      }
    },
  };
};
