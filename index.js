const electron = require('electron');
//Now i'm going to add some very important modules to make it work
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let main_window; //var for main window
let add_window;
//Listen for app to be ready

app.on('ready',function(){

//Create new window
main_window = new BrowserWindow({}); // No configuration for now
//Load html file into window - if you don't have one - create it!
main_window.loadURL(url.format({
    pathname: path.join(__dirname,'main_window.html'),
    protocol: 'file:',
    slashes: true

})); //What does it do? It's just giving directory name to main html file like file://dirname etc.


// Quit application when closed (quit every single window when app close, because in default... Subwindows stay opened when app is closed - it doesn't make any sense)
main_window.on('closed',function(){
app.quit();
});











//Build menu from template

const main_menu = Menu.buildFromTemplate(main_menu_template);

//Insert menu
Menu.setApplicationMenu(main_menu);
});

// addWindow`
function createAddWindow(){

//Create new window
add_window = new BrowserWindow({

    width: 500,
    height: 500,
    title: 'Add item'


}); // Comfigurate width and height of the window
//Load html file into window - if you don't have one - create it!
add_window.loadURL(url.format({
    pathname: path.join(__dirname,'add_window.html'),
    protocol: 'file:',
    slashes: true

}));


//Garbage collection handle
add_window.on('close',function(){
add_window = null; //it removes everything from PC's memory. 
});


}


// Catch item:add
ipcMain.on('item:add',function(e,item){
    
  
    main_window.webContents.send('item:add',item);
    add_window.close();

});













//Create Menu template
const main_menu_template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    main_window.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit App',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();

                }
            }
        ]
    }




];

//If mac, add empty object to menu
if(process.platform == 'darwin'){
    main_menu_template.unshift({});
}

// Add dev tools if not in production
if(process.env.NODE_ENV !== 'production'){
    main_menu_template.push({
        label: 'Dev Tools',
        submenu:[
        {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
                
                }
            },
            {
                role: 'reload'
            }
        
    ]

    });
}