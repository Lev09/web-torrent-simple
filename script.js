window.onload = function () {
    document.querySelector("#inputFile").onchange = onFileSelection;

    if (readTorrentIdFromUrl() != "") {
        prepareDownload();
    }
}


function readTorrentIdFromUrl() {
    return window.location.hash.slice(1);
}

function prepareDownload() {
    var torrentId = readTorrentIdFromUrl();
    document.querySelector("#torrentIdInput").value = torrentId;
}

var client = new WebTorrent();

client.on('error', function (err) {
    console.error('ERROR: ' + err.message)
})

function download() {
    var torrentId = document.querySelector("#torrentIdInput").value;
    if (torrentId == "") {
        return;
    }

    client.add(torrentId, onTorrent);
}

function onTorrent(torrent) {
    torrent.on('done', function () {
        alert('download finished');
    });

    torrent.files.forEach(function (file) {
        file.appendTo('#result')
        file.getBlobURL(function (err, url) {
            if (err) {
                console.log(err.message)
            }
            alert('<a href="' + url + '">Download file: ' + file.name + '</a>')
        })
    })
}

function onFileSelection() {
    var file = this.files[0];

    if (!file) {
        return;
    }

    client.seed(file, onSeed);
}
 
function onSeed(torrent) {
    var infoMagnet = document.createElement("P");
    var magnet = document.createTextNode("Seeding torrent Magnet: " + torrent.magnetURI);
    infoMagnet.appendChild(magnet);

    var infoHash = document.createElement("P");
    var hash = document.createTextNode("torrent Hash: " + torrent.infoHash);
    infoHash.appendChild(hash);

    document.querySelector("#uploadInfo").appendChild(infoHash);
    document.querySelector("#uploadInfo").appendChild(infoMagnet);
}