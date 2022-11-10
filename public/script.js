console.log("Running...");
var data;
getData();

function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", '/data', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data = JSON.parse(xhr.response)
            updateTrackList();
            addListners();
        }
    }
    xhr.send();
}

function postData() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/data', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('data updated');
        }
    }
    xhr.send(JSON.stringify(data));
}

function addListners() {
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

    var classSelects = document.querySelectorAll(".class-type-select select")

    classSelects.forEach(element => {
        element.addEventListener('change', changeClass)
    });
}

function upload(event) {
    alert('upload');
    console.log("upload");
}

function record(event) {
    let saveRecordingModal = document.getElementById('save-recording-modal');
    saveRecordingModal.style.visibility = "visible";
    let selecContainer = saveRecordingModal.querySelector("select");
    selecContainer.innerHTML = ""
    data.classes.forEach(element => {
        let optionDOM = document.createElement('option');
        optionDOM.innerHTML = element;
        selecContainer.append(optionDOM);
    });
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
    let now = new Date()
    let id = now.getTime()
    let trackName = document.getElementById('recording-name').value
    let trackClass = document.getElementById('recording-class').value
    let trackTime = "00:10"
    let trackDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`

    let newTrack = {
        id: id,
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
    let container = document.querySelector('.tracks');
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
        trackDOM.dataset.id = track.id;
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
            updateTrackList()
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
    while(continer.childElementCount > 1) {
        continer.removeChild(continer.lastChild)
    }
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

function changeClass (event) {
    let newClassName = event.target.value;
    let trackId = event.target.parentElement.parentElement.dataset.id;
    updateTrack(trackId, newClassName)
    function updateTrack(id, newClassName) {
        data.tracks.forEach(element => {
            if (element.id == id) {
                element.class = newClassName;
            }
        });
    }
    postData();
}
