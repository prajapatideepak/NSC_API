const {app, BrowserWindow} = require('electron');

function createWindow(){
    //Create the browser window.
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences:{
        }
    })

    win.loadURL('http://localhost:3000')
}

app.on('ready', createWindow);

//Quit when all window are close.
app.on('window-all-close', function(){
    //On OS X it si common for applications and their menu bar to stay active until the user quires explicitly with Cmd + Q
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', function(){
    //On OS X it is common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
})