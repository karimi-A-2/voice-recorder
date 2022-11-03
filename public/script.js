console.log("Running...");

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

var trackId = 1;

function ready() {
    var uploadBtn = document.getElementById('upload-btn')
    uploadBtn.addEventListener('click', upload)

    var recordBtn = document.getElementById('record-btn')
    recordBtn.addEventListener('click', record)

    var addClassButton = document.getElementById('add-class-btn')
    addClassButton.addEventListener('click', addClass)

    var closeModalButton = document.getElementById('close-modal-btn')
    closeModalButton.addEventListener('click', closeModal)

    var saveClassButton = document.getElementById('save-class-button')
    saveClassButton.addEventListener('click', saveClass)

    var dismissClassButton = document.getElementById('dismiss-class-button')
    dismissClassButton.addEventListener('click', closeModal)
}

function upload(event) {
    alert('upload');
    console.log("upload");
}

function saveClass(event) {
    let inputField = document.getElementById('class-name');
    var newClassName = inputField.value;
    inputField.value = "";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/classes/new', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(`add ${newClassName} to classes`);

            let label = document.createElement('label')
            label.classList.add('checkbox-container')
            let continer = document.getElementsByClassName('class-checkbox')[0];

            // div class="class-checkbox"
            let labelContent = `
            ${newClassName}
            <input type="checkbox" checked="checked">
            <span class="checkmark"></span>
            `
            label.innerHTML = labelContent
            continer.append(label)
        }
    }
    xhr.send(JSON.stringify({
        value: newClassName
    }));

    closeModal();
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
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "visible"
}

function closeModal(event) {
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "hidden"
}
