console.log("Running...");

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
var data;
function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", '/data', true);
    xhr.onreadystatechange = () => {  // here we define what happens when readystate is changed (response hase come)
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data = JSON.parse(xhr.response)
            console.log(data);  // this is the demanded object because it executes when data is loaded
            updateTrackList();
        }
    }
    xhr.send();
}

function ready() {
    getData();
    // console.log(data);  // this is undefined because get data execute line by line but and takes 1ms for example but response comes 2s later 

    var uploadBtn = document.getElementById('upload-btn')
    uploadBtn.addEventListener('click', upload)

    // record-btn
    var recordBtn = document.getElementById('record-btn')
    recordBtn.addEventListener('click', record)

    var saveAndStopBtn = document.getElementById('save-and-stop-btn')
    saveAndStopBtn.addEventListener('click', saveAndStop)

    var closeSaveRecordingButton = document.getElementById('close-modal-btn-2')
    closeSaveRecordingButton.addEventListener('click', closeSaveRecordingModal)

    // add-class-btn
    var addClassButton = document.getElementById('add-class-btn')
    addClassButton.addEventListener('click', addClass)

    var saveClassButton = document.getElementById('save-class-button')
    saveClassButton.addEventListener('click', saveClass)

    var closeModalButton = document.getElementById('close-modal-btn')
    closeModalButton.addEventListener('click', closeAddClassModal)

    var dismissClassButton = document.getElementById('dismiss-class-button')
    dismissClassButton.addEventListener('click', closeAddClassModal)
}

function upload(event) {
    alert('upload');
    console.log("upload");
}

function record(event) {
    let saveRecordingModal = document.getElementById('save-recording-modal');
    saveRecordingModal.style.visibility = "visible";
}

function closeSaveRecordingModal(event) {
    let saveRecordingModal = document.getElementById('save-recording-modal')
    saveRecordingModal.style.visibility = "hidden"
}

function addClass(event) {
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "visible"
}

function closeAddClassModal(event) {
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "hidden"
}

function saveAndStop(event) {
    let trackName = document.getElementById('recording-name').value
    let trackClass = document.getElementById('recording-class').value
    let trackTime = "00:10"
    let now = new Date()
    let trackDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`

    let newTrack = {
        name: trackName,
        class: trackClass,
        time: trackTime,
        date: trackDate,
    };
    const xhr = new XMLHttpRequest();

    xhr.open("POST", '/tracks/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data.tracks.push(newTrack);
            updateTrackList();
            console.log(`add ${newTrack.name} to tracks`);
        }
    }
    xhr.send(JSON.stringify(newTrack));

    closeSaveRecordingModal();
}

function updateTrackList() {
    let container = document.getElementsByClassName('tracks')[0];
    container.innerHTML = "";
    data.tracks.forEach(track => {
        let trackDOM = document.createElement('div');
        trackDOM.classList.add('track');
        
        let trackContent = `
        <div class="play">
            <span class="track-name">${track.name}</span>
            <i class="fa fa-play-circle"></i>
            <span class="time">${track.time}</span>
        </div>
        <div class="class-type-select">
            <select name="classes">
                
            </select>
        </div>
        <div class="date">
            <span>${track.date}</span>
        </div>
        <div class="more">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </div>
        `;
        trackDOM.innerHTML = trackContent;
        let selecContainer = trackDOM.querySelector("div.class-type-select select");
        data.classes.forEach(element => {
            let optionDOM = document.createElement('option');
            optionDOM.innerHTML = element;
            if (element == track.class) {
                optionDOM.selected = 'selected';
            }
            selecContainer.append(optionDOM);
        });
        container.append(trackDOM);
    });
}

function saveClass(event) {
    let inputField = document.getElementById('class-name');
    var newClassName = inputField.value;
    inputField.value = "";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/classes/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data.classes.push(newClassName)
            updateClassList()
            // updateTrackList()
            console.log(`add ${newClassName} to classes`);
        }
    }
    xhr.send(JSON.stringify({
        value: newClassName
    }));

    closeAddClassModal();
}

function updateClassList() {
    let continer = document.getElementsByClassName('class-checkbox')[0];
    continer.innerHTML = "";
    data.classes.forEach(element => {
        let label = document.createElement('label');
        label.classList.add('checkbox-container');
    
        // div class="class-checkbox"
        let labelContent = `
                ${element}
                <input type="checkbox" checked="checked">
                <span class="checkmark"></span>
                `;
        label.innerHTML = labelContent;
        continer.append(label);
    });
}
