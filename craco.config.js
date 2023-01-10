const StyleAliasesFixPlugin = {
  overrideWebpackConfig: (data) => {
      const config = data.webpackConfig;
      const rules = config.module.rules[1];

      const locations = rules.oneOf.reduce((rulesAcc, rule, ruleIndex) => {
          const use = rule.use || [];
          const useIndex = use.findIndex(u => u.loader?.includes('sass-loader'));
          return (useIndex < 0) ? rulesAcc : {
              ...rulesAcc,
              [ruleIndex]: useIndex,
          };
      }, {});

      const resolvePathsOptions = {
          sassOptions: {
              includePaths: [
                "./src/stylesheets",
                "./node_modules/@uswds",
                "./node_modules/@uswds/uswds/packages",
                "./node_modules/uswds/src/stylesheets/theme"
              ]
          },
      };

      Object.entries(locations)
          .forEach(([ruleIndex, useIndex]) => rules.oneOf[+ruleIndex].use[useIndex].options = {
              ...rules.oneOf[+ruleIndex].use[useIndex].options,
              ...resolvePathsOptions
          });
      return config;
  },
};

module.exports = {
  plugins: [
      {
          plugin: StyleAliasesFixPlugin,
      },
  ],
};
