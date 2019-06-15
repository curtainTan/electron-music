
const { ipcRenderer } = require('electron')
const { $ } = require( './helper' )


let musicAudio = new Audio()
let allTracks
let currentTrack

ipcRenderer.on( "getTracks", ( event, tracks ) => {
    console.log( "---------加载--", tracks )
    renderListHTML( tracks )
    allTracks = tracks
} )

$("add-music-button").addEventListener( "click", () => {
    ipcRenderer.send("add-music-window")
} )

const renderListHTML = ( tracks ) => {
    const elTracks = $("tracksList")
    const tracksHTML = tracks.reduce( (html, oneTrack ) => {
        html += `<li class="row music-track list-group-item d-flex justify-content-between align-item-center">
            <div class="col-10">
                <i class="fas fa-music mr-2 text-secondary"></i>
                <b>${ oneTrack.fileName }</b>
            </div>
            <div class="col-2">
                <i class="fas fa-play mr-4" data-id="${oneTrack.id}" ></i>
                <i class="fas fa-trash-alt"  data-id="${oneTrack.id}" ></i>
            </div>
        </li>`
        return html
    }, "" )
    const emptyTracks = "<div class='alert alert-primary' >还没有添加音乐</div>"
    elTracks.innerHTML = tracks.length ? `<ul class="list-group">${tracksHTML}</ul>` : emptyTracks
}

$("tracksList").addEventListener( "click", ( event ) => {
    event.preventDefault()
    const { dataset, classList } = event.target
    const id = dataset && dataset.id
    if( id && classList.contains("fa-play") ){
        // 开始播放音乐
        currentTrack = allTracks.find( track => track.id === id )
        musicAudio.src = currentTrack.path
        musicAudio.play()
        classList.replace( "fa-play", "fa-pause" )
    }
} )






