
const { ipcRenderer } = require( 'electron' )


window.addEventListener( 'DOMContentLoaded', () => {
    ipcRenderer.send("message", "Helloween")
    ipcRenderer.on( "replay", ( event, arg ) => {
        console.log( arg )
        document.getElementById("message").innerHTML = arg
    } )
} )






