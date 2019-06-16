exports.$ = ( id ) => {
    return document.getElementById( id )
}




exports.convertDuration = ( time ) => {
    // m
    const minutes = "0" + Math.floor( time / 60 )
    // s
    const seconds = "0" + Math.floor( time - minutes * 60 )
    return minutes.substr( -2 ) + ":" + seconds.substr( -2 )
}








