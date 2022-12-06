console.log("Running...")
var data
var chunks = []
var audioBlob
var mediaRecorder = null
var recDate

var intervalID
var timer
getData()

function getData() {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", '/data', true)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data = JSON.parse(xhr.response)
            updateTrackList()
            addListners()
        }
    }
    xhr.send()
}

function postData() {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", '/data', true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('data updated')
        }
    }
    xhr.send(JSON.stringify(data))
}

var uploadRecordSection
var timeStopSection
var uploadBtn
var fileInput
var recordBtn
var saveAndStopBtn
var closeSaveRecordingButton
var timeDOM
var stopBtn
var stopRecCheckBox
var addClassButton
var saveClassButton
var closeModalButton
var dismissClassButton
var classCheckBoxContiner
var checkList
var classSelects
var addClassModal
var saveRecordingModal
var recordingName
var recordingClass
var inputField

function addListners() {
    uploadRecordSection = document.getElementById("upload-record")
    timeStopSection = document.getElementById("time-stop")

    uploadBtn = document.getElementById('upload-btn')
    uploadBtn.addEventListener('click', upload)

    fileInput = document.getElementById('input-file')
    fileInput.addEventListener('change', changeFile)

    // record-btn
    recordBtn = document.getElementById('record-btn')
    recordBtn.addEventListener('click', startRecord)

    saveAndStopBtn = document.getElementById('save-and-stop-btn')
    saveAndStopBtn.addEventListener('click', saveAndStop)

    closeSaveRecordingButton = document.getElementById('close-modal-btn-2')
    closeSaveRecordingButton.addEventListener('click', closeSaveRecordingModal)

    timeDOM = document.getElementById('time')

    // stop-rec btn
    stopBtn = document.getElementById('stop-btn')
    stopBtn.addEventListener('click', stopRecord)

    stopRecCheckBox = document.getElementById('stop-rec-checkbox')

    // add-class-btn
    addClassButton = document.getElementById('add-class-btn')
    addClassButton.addEventListener('click', addClass)

    saveClassButton = document.getElementById('save-class-button')
    saveClassButton.addEventListener('click', saveClass)

    closeModalButton = document.getElementById('close-modal-btn')
    closeModalButton.addEventListener('click', closeAddClassModal)

    dismissClassButton = document.getElementById('dismiss-class-button')
    dismissClassButton.addEventListener('click', closeAddClassModal)

    classCheckBoxContiner = document.querySelector('.class-checkbox')

    // class-checkbox
    checkList = document.querySelectorAll('.class-checkbox input')
    checkList[0].addEventListener('change', allChange)
    for (let i = 1; i < checkList.length; i++) {
        const element = checkList[i]
        element.addEventListener('change', updateTrackList)
    }

    // select
    classSelects = document.querySelectorAll(".class-type-select select")
    classSelects.forEach(element => {
        element.addEventListener('change', changeClass)
    })

    addClassModal = document.getElementById('add-class-modal')
    saveRecordingModal = document.getElementById('save-recording-modal')
    recordingName = document.getElementById('recording-name')
    recordingClass = document.getElementById('recording-class')
    inputField = document.getElementById('class-name')
}

function upload(event) {
    fileInput.click()
}

function changeFile(event) {
    var file = fileInput.files[0]
    audioBlob = file
    showsaveRecordingModal()
    recDate = new Date()
}

function startRecord(event) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support recording!')
        return
    }
    // start recording
    navigator.mediaDevices.getUserMedia({
        audio: true,
    })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }
            mediaRecorder.onstart = (event) => {
                timer = 0
                timeDOM.innerHTML = `${(parseInt(timer / 60))}:${timer % 60}`
                intervalID = setInterval(() => {
                    timer++
                    timeDOM.innerHTML = `${(parseInt(timer / 60))}:${timer % 60}`
                }, 1000)

                uploadRecordSection.style.display = 'none'  // block
                timeStopSection.style.display = 'flex'  // none

                if (stopRecCheckBox.checked) {
                    let stopRecSeconds = document.getElementById('stop-rec-seconds')
                    let timeout = parseInt(stopRecSeconds.value) * 1000
                    setTimeout(() => {
                        if (mediaRecorder.state == 'recording') {
                            mediaRecorder.stop()
                        }
                    }, timeout + 100)
                }
            }
            mediaRecorder.onstop = (event) => {
                recDate = new Date()
                clearInterval(intervalID)
                audioBlob = new Blob(chunks, { type: 'audio/mp3' })
                chunks = []

                timeDOM.innerHTML = `${0}:${0}`
                uploadRecordSection.style.display = 'block'  // block
                timeStopSection.style.display = 'none'  // none
                showsaveRecordingModal()
            }
        })
        .catch((err) => {
            console.error(`The following error occurred: ${err}`)
        })
}

function stopRecord(event) {
    mediaRecorder.stop()
}

function showsaveRecordingModal(event) {
    saveRecordingModal.style.visibility = "visible"
    let selecContainer = saveRecordingModal.children[1].children[1].children[3]
    selecContainer.innerHTML = ""
    data.classes.forEach(element => {
        let optionDOM = document.createElement('option')
        optionDOM.innerHTML = element
        selecContainer.append(optionDOM)
    })
}

function closeSaveRecordingModal(event) {
    recordingName.value = ""
    saveRecordingModal.style.visibility = "hidden"
}

function addClass(event) {
    addClassModal.style.visibility = "visible"
}

function closeAddClassModal(event) {
    inputField.value = ""
    addClassModal.style.visibility = "hidden"
}

function saveAndStop(event) {
    let id = recDate.getTime()

    const formData = new FormData()
    formData.append('audio', audioBlob, `${id}.mp3`)
    fetch('/record', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            return response.json()
        })
        .then(() => {

            var getDuration = function (url, next) {
                var _player = new Audio(url)
                _player.addEventListener("durationchange", function (e) {
                    if (this.duration != Infinity) {
                        var duration = this.duration
                        _player.remove()
                        next(duration)
                    };
                }, false)
                _player.load()
                _player.currentTime = 24 * 60 * 60 //fake big time
                _player.volume = 0
                _player.play()
                //waiting...
            }

            let trackName = recordingName.value
            let trackClass = recordingClass.value
            getDuration(`/${id}.mp3`, function (duration) {
                let trackDate = `${recDate.getFullYear()}-${recDate.getMonth()}-${recDate.getDay()} ${recDate.getHours()}-${recDate.getMinutes()}-${recDate.getSeconds()}`

                let newTrack = {
                    id: id,
                    name: trackName,
                    class: trackClass,
                    time: duration,
                    date: trackDate,
                }

                closeSaveRecordingModal()

                const xhr = new XMLHttpRequest()
                xhr.open("POST", '/tracks/new', true)
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        data.tracks.push(newTrack)
                        updateTrackList()
                        console.log(newTrack)
                    }
                }
                xhr.send(JSON.stringify(newTrack))
            })
        })
        .catch((err) => {
            console.error(err)
            console.error('An error occurred, please try again later')
        })
}

function allChange(event) {
    let allChecked = event.target.checked
    let classCheckbox = document.querySelector(".class-checkbox")
    for (let i = 1; i < classCheckbox.children.length; i++) {
        const element = classCheckbox.children[i]
        element.children[0].checked = allChecked
    }
    updateTrackList()
}

function updateTrackList() {
    let checkedClasses = []
    let classCheckbox = document.querySelector(".class-checkbox")
    for (let i = 1; i < classCheckbox.children.length; i++) {
        const element = classCheckbox.children[i]
        if (element.children[0].checked == true) {
            checkedClasses.push(data.classes[i - 1])
        }
    }

    let all = classCheckbox.children[0].children[0]
    if (checkedClasses.length == data.classes.length) {
        all.checked = true
    } else {
        all.checked = false
    }

    let container = document.querySelector('.tracks')
    container.innerHTML = ""
    data.tracks.forEach(track => {
        if (checkedClasses.includes(track.class) == false) {
            return
        }
        let trackDOM = document.createElement('div')
        trackDOM.classList.add('track')

        let trackContent = `
        <div class="play">
            <span class="track-name">${track.name}</span>
            <i class="fa fa-play-circle"></i>
            <audio src="/${track.id}.mp3" preload="auto"></audio>
            <span class="time">${parseInt(track.time / 60)}:${parseInt(track.time % 60)}</span>
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
        `
        trackDOM.innerHTML = trackContent
        trackDOM.dataset.id = track.id

        trackDOM.children[0].children[1].addEventListener('click', (event) => {
            let faDOM = event.target
            let audio = event.target.nextElementSibling
            audio.onplay = () => {
                faDOM.classList.replace('fa-play-circle', 'fa-pause-circle')
            }
            // audio.onended = () => {
            //     faDOM.classList.replace('fa-pause-circle', 'fa-play-circle');
            // }
            audio.onpause = () => {
                faDOM.classList.replace('fa-pause-circle', 'fa-play-circle')
            }
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        })

        let selecContainer = trackDOM.querySelector("div.class-type-select select")
        selecContainer.addEventListener('change', changeClass)
        data.classes.forEach(element => {
            let optionDOM = document.createElement('option')
            optionDOM.innerHTML = element
            if (element == track.class) {
                optionDOM.selected = 'selected'
            }
            selecContainer.append(optionDOM)
        })

        container.append(trackDOM)
    })
}

function saveClass(event) {
    let newClassName = inputField.value

    const xhr = new XMLHttpRequest()
    xhr.open("POST", '/classes/new', true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data.classes.push(newClassName)
            updateClassList()
            updateTrackList()
            console.log(`add ${newClassName} to classes`)
        }
    }
    xhr.send(JSON.stringify({
        value: newClassName
    }))

    closeAddClassModal()
}

function updateClassList() {
    while (classCheckBoxContiner.childElementCount > 1) {
        classCheckBoxContiner.removeChild(classCheckBoxContiner.lastChild)
    }
    data.classes.forEach(element => {
        let label = document.createElement('label')
        label.classList.add('checkbox-container')

        let labelContent = `
                ${element}
                <input type="checkbox" checked="checked">
                <span class="checkmark"></span>
                `
        label.innerHTML = labelContent
        label.children[0].addEventListener('change', updateTrackList)
        classCheckBoxContiner.append(label)
    })
}

function changeClass(event) {
    let newClassName = event.target.value
    let trackId = event.target.parentElement.parentElement.dataset.id
    data.tracks.forEach(element => {
        if (element.id == trackId) {
            element.class = newClassName
        }
    })
    postData()
    updateTrackList()
}
