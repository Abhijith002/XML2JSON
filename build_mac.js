var createDMG = require('electron-installer-dmg');
const opts = {
    appPath: './release-builds/xml2json-darwin-x64/xml2json.app/',
    name: 'xml2json',
    title: 'Convert XML data to JSON making a SOAP call to HRMART',
    icon: './assets/walmart-icon.icns'
};

createDMG(opts, function done (err) { })