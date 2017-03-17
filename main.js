const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const shell = require('electron').shell
const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let newsWindow
const BASE_PATH = os.userInfo().homedir

if (process.env.NODE_ENV === 'hotDevelopment')
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })

function createWindow() {
  // Create the directory to download files
  const dir = path.join(BASE_PATH, '.KawAnime')

  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    titleBarStyle: 'hidden',
    show: false,
    title: 'KawAnime',
    preload: 'https://unpkg.com/vue/dist/vue.js',
    scrollBounce: true
  })

  // and load the index.html of the src.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your src supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()

  // Dev tools
  if (process.env.NODE_ENV !== 'production')
  {
    require('vue-devtools').install()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin')
  {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the src when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null)
  {
    createWindow()
  }
})

// In this file you can include the rest of your src's specific main process
// code. You can also put them in separate files and require them here.
exports.openANewsWindow = (uri) => {
  // Create the browser window.
  newsWindow = new BrowserWindow({
    width: 800,
    height: 500,
    parent: mainWindow,
    minimizable: false,
    maximizable: false
  })

  // and load the index.html of the src.
  newsWindow.loadURL(uri)

  newsWindow.once('ready-to-show', () => {
    newsWindow.show()
  })

  // Emitted when the window is closed.
  newsWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your src supports multi windows, this is the time
    // when you should delete the corresponding element.
    newsWindow = null
  })
}