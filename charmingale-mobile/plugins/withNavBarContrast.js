const { withAndroidStyles } = require('@expo/config-plugins');

module.exports = function withNavBarContrast(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;
    const appTheme = styles.resources.style?.find((s) =>
      s.$.name.includes('AppTheme') || s.$.name.includes('Theme')
    );

    if (appTheme) {
      appTheme.item = appTheme.item || [];
      appTheme.item = appTheme.item.filter(
        (i) => i.$.name !== 'android:enforceNavigationBarContrast'
      );
      appTheme.item.push({
        $: { name: 'android:enforceNavigationBarContrast' },
        _: 'false',
      });
    }

    return config;
  });
};