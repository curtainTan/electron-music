
const { ipcRenderer } = require('electron')
const { $, convertDuration } = require( './helper' )


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

const renderPlayHTML = ( name, duration ) => {
    const playerEl = $("player-status")
    const html = `<div class="col font-weight-bold" >
                    正在播放：${ name }
                  </div>
                <div class= "col">
                    <span id="current-seeker">00:00</span> / ${ duration }
                </div>`
    playerEl.innerHTML = html
}

const updateProgressHTML = ( currentTime, duration ) => {
    const seeker = $("current-seeker")
    seeker.innerHTML = convertDuration( currentTime )
    // 计算长度\
    console.log( "数据", currentTime, duration )
    const progress = Math.floor( currentTime / duration * 100 )
    const bar = $("player-progress")
    bar.innerHTML = progress + "%"
    bar.style.width = progress + "%"
}

musicAudio.addEventListener( "loadedmetadata", () => {
    // 渲染播放器状态
    renderPlayHTML( currentTrack.fileName, convertDuration( musicAudio.duration ) )
} )

musicAudio.addEventListener( "timeupdate", () => {
    // 更新时间
    updateProgressHTML( musicAudio.currentTime, musicAudio.duration )
} )


$("tracksList").addEventListener( "click", ( event ) => {
    event.preventDefault()
    const { dataset, classList } = event.target
    const id = dataset && dataset.id
    if( id && classList.contains("fa-play") ){
        // 开始播放音乐
        if( currentTrack && currentTrack.id === id ){
            // 继续播放音乐
            musicAudio.play()
        } else {
            // 播放新的歌曲，还原之前的图标
            currentTrack = allTracks.find( track => track.id === id )
            musicAudio.src = currentTrack.path
            musicAudio.play()
            const resetIconEle = document.querySelector( ".fa-pause" )
            if( resetIconEle ){
                resetIconEle.classList.replace( "fa-pause","fa-play" )
            }
        }
        classList.replace( "fa-play", "fa-pause" )
    } else if ( id && classList.contains( "fa-pause" ) ){
        // 暂停
        musicAudio.pause()
        classList.replace( "fa-pause","fa-play" )
    } else if( id && classList.contains( "fa-trash-alt" ) ){
        // 发送时间，删除音乐
        ipcRenderer.send( "delete-track", id )
    }
} )






