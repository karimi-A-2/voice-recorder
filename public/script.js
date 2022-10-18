console.log("Running...");

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

var trackId = 1;
var classId = 3;

function ready() {
    var uploadButton = document.getElementsByClassName('upload-btn')
    uploadButton[0].addEventListener('click', upload)

    var recordButton = document.getElementsByClassName('record-btn')
    recordButton[0].addEventListener('click', record)

    var addClassButton = document.getElementsByClassName('add-class-btn')
    addClassButton[0].addEventListener('click', addClass)
}

function upload(event) {
    alert('uploading');
    console.log("upload");
}

function record(event) {
    let track = document.createElement('div')
    track.classList.add('track')
    let continer = document.getElementsByClassName('tracks')[0];

    let trackName = 'recording ' + trackId;
    let trackDate = 'Date ' + trackId;
    let trackTime = 'track Time ' + trackId;

    let trackContent = `
    <div class="play">
        <span class="track-name">${trackName}</span>
        <i class="fa fa-play-circle"></i>
        <span class="time">${trackTime}</span>
    </div>
    <div class="class-type-select">
        <select name="classes">
            <option value="c1">C1</option>
        </select>
    </div>
    <div class="date">
        <span>${trackDate}</span>
    </div>
    <div class="more">
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
    </div>
    `
    track.innerHTML = trackContent
    continer.append(track)
    console.log(`recording ${trackId} added`);
    trackId += 1
}

function addClass(event) {
    let checkbox = document.createElement('label')
    checkbox.classList.add('checkbox-container')
    let continer = document.getElementsByClassName('class-checkbox')[0];
    className = 'C' + classId
    checkboxContent = `
    ${className}
    <input type="checkbox" checked="checked">
    <span class="checkmark"></span>
    `
    checkbox.innerHTML = checkboxContent
    continer.append(checkbox)
    console.log("class " + classId + " added");
    classId += 1
}
