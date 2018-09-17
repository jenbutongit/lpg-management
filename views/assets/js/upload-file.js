window.onload = function () {
    let uploadForm
    uploadForm = document.getElementById('upload')

    document.getElementById('uploadButton').onclick = function upload() {
        let formData = new FormData(uploadForm)
        let fileInput = document.getElementById('file-upload')
        let file = fileInput.files[0]
        let courseId = document.getElementById('courseId').value

        formData.append('file', file)
        formData.append('container', courseId)

        let xhttp = new XMLHttpRequest()

        xhttp.upload.onprogress = function(event) {
            const loaded = Math.round((event.loaded / event.total) * 100)
            // document.getElementById("progressBar").value = loaded
            // document.getElementById("fileSize").value = Math.round(event.total / 2000000)
        }

        xhttp.onreadystatechange = function() {
            if(this.readyState == this.HEADERS_RECEIVED){
                const mediaLocation = xhttp.getResponseHeader("Location")
                const mediaId = mediaLocation.substr(mediaLocation.lastIndexOf("/") + 1)
                document.getElementById("mediaId").value = mediaId;

                document.getElementById("uploadButton").style.visibility = "hidden"
            }
        }

        xhttp.open("POST", "http://localhost:9001/media", true, 'user', 'password')
        xhttp.withCredentials = true
        xhttp.send(formData)
        return false
    }
}