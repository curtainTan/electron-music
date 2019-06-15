const { $ } = require( './helper' )
const { ipcRenderer } = require('electron')
const nodePath = require('path')


let musicFilesPath = []

$("select").addEventListener( "click", () => {
    ipcRenderer.send("open-music-file")
} )

$("add-select").addEventListener( "click", () => {
    ipcRenderer.send( "add-tracks", musicFilesPath )
} )




const renderListHtml = ( paths ) => {
    let musicList = $("musicList")
    let musicItemHTML = paths.reduce( ( html, music ) => {
        html += `<li class="list-group-item">${nodePath.basename(music)}</li>`
        return html
    }, '' )
    musicList.innerHTML = `<ul class="list-group">${musicItemHTML}</ul>`
}

ipcRenderer.on("selected-file", ( event, path ) => {
    if( Array.isArray( path ) ){
        renderListHtml( path )
        musicFilesPath = path
    }
})







