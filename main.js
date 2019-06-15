const { app, BrowserWindow, ipcMain, dialog } = require( 'electron' )
const Datatore = require("./musicData/dataStore")

console.log( app.getPath('userData') )

const myStore = new Datatore({ name: "MusicData" })

class AppWindow extends BrowserWindow{
    constructor( config, fileLoaction ){
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true            // 可以使用nodejs的api
            },
            autoHideMenuBar: true
        }
        // const finalConfig = Object.assign( basicConfig, config )
        const finalConfig = { ...basicConfig, ...config }
        super( finalConfig )
        this.loadFile( fileLoaction )
        this.once( "ready-to-show", () => {
            this.show()
        } )
    }
}

app.on( 'ready', () => {
    const mainWindow = new AppWindow( {}, './render/index.html' )
    let addWindow;

    mainWindow.webContents.on( "did-finish-load", () => {
        mainWindow.send( "getTracks", myStore.getTracks() )
    } )

    ipcMain.on( "add-music-window", () => {
        addWindow = new AppWindow( {
            width: 500,
            height: 400,
            parent: mainWindow
        }, "./render/add.html" )
    } )
    ipcMain.on( "open-music-file", ( event ) => {
        dialog.showOpenDialog({
            properties: [ "openFile", "multiSelections" ],
            filters: [
                { name: "music", extensions: ["mp3"] }
            ]
        }, ( files ) => {
            event.sender.send("selected-file", files)
        })
    } )
    ipcMain.on( "add-tracks", (event, tracks) => {
        const updateTracks = myStore.addTracks( tracks ).getTracks()
        console.log( updateTracks )
        // addWindow.close()
        mainWindow.send( "getTracks", updateTracks )
    } )
    ipcMain.on( "delete-track", ( event, deletedId ) => {
        console.log( "传过来的id", deletedId )
        myStore.deleteTrack( deletedId )
        const updatedTracks = myStore.getTracks()
        mainWindow.send( "getTracks", updatedTracks )
    } )

} )







