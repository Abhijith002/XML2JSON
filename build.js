const electronInstaller = require('electron-winstaller');
// var req = require('./')
async function build() {
try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './xml2json-win32-x64/',
      outputDirectory: './',
      authors: 'Abhijith Manjunath',
      exe: 'XML2JSON.exe',
      loadingGif: './assets/loading.gif',
      description: 'Convert XML data to JSON making a SOAP call to HRMART',
      version: '1.0.0',
      // iconUrl: './assets/walmart-icon.ico',
      setupIcon: './assets/walmart-icon.ico'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
}

build();