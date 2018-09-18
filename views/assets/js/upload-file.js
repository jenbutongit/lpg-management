window.onload = function () {
    let uploadForm
    uploadForm = document.getElementById('upload')

    if(document.getElementById('uploadButton')) {
        document.getElementById('uploadButton').onclick = function upload() {
            let formData = new FormData(uploadForm)
            let fileInput = document.getElementById('file-upload')
            let file = fileInput.files[0]
            let courseId = document.getElementById('courseId').value

            formData.append('file', file)
            formData.append('container', courseId)

            let xhttp = new XMLHttpRequest()

            xhttp.upload.onprogress = function (event) {
                const loaded = Math.round((event.loaded / event.total) * 100)
                document.getElementById("progress").innerText = "( " + loaded + "% ) " + "Uploaded"
                document.getElementById("file-size").innerText = "File size: " + Math.round(event.total / 1000000) + "MB"
            }

            xhttp.onreadystatechange = function () {
                if (this.readyState == this.HEADERS_RECEIVED) {
                    const mediaLocation = xhttp.getResponseHeader("Location")
                    const mediaId = mediaLocation.substr(mediaLocation.lastIndexOf("/") + 1)
                    document.getElementById("mediaId").value = mediaId;

                    document.getElementById("uploadButton").style.visibility = "hidden"

                    document.getElementById("progress").innerText = "File uploaded"
                }
            }

            xhttp.open("POST", "http://localhost:9001/media", true, 'user', 'password')
            xhttp.withCredentials = true
            xhttp.send(formData)
            return false
        }
    }
}