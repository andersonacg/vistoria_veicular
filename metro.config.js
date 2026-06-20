const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Por padrão o Metro não transpila node_modules.
// @supabase/auth-js e @react-native-async-storage usam private class fields
// (#campo) que precisam ser transformados antes de chegar ao Hermes.
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(' +
    'react-native' +
    '|@react-native(-community)?' +
    '|expo(nent)?' +
    '|@expo(nent)?/.*' +
    '|@expo-google-fonts/.*' +
    '|react-navigation' +
    '|@react-navigation/.*' +
    '|@unimodules/.*' +
    '|unimodules' +
    '|native-base' +
    '|react-native-svg' +
    '|@supabase/.*' +
    '|@react-native-async-storage/.*' +
  '))',
];

module.exports = config;
