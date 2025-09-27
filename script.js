(function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('capture');
    const context = canvas.getContext('2d');
    const photoContainer = document.getElementById('photos');

    // Access the webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(error) {
                console.error("Error accessing webcam: ", error);
            });
    }

    // Capture the images
    captureButton.addEventListener('click', function() {
        const folderName = prompt("Enter folder name for the captured images:");
        if (!folderName) {
            alert("Folder name is required to capture images.");
            return;
        }

        let photoCount = 0;
        const zip = new JSZip();
        const imgFolder = zip.folder(folderName);

        function capturePhoto() {
            if (photoCount < 10) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imgData = canvas.toDataURL('image/png');
                const img = document.createElement('img');
                img.src = imgData;
                img.style.width = '150px';
                img.style.height = 'auto';
                photoContainer.appendChild(img);
                
                // Add image data to the zip folder
                imgFolder.file(`photo${photoCount + 1}.png`, imgData.split(',')[1], { base64: true });

                photoCount++;
                setTimeout(capturePhoto, 1000); // Schedule the next photo capture after 5 seconds
            } else {
                // Generate and download the zip file after capturing all photos
                zip.generateAsync({ type: "blob" })
                    .then(function(content) {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(content);
                        a.download = `${folderName}.zip`;
                        a.click();
                    });
            }
        }

        capturePhoto(); // Start the photo capture process
    });
})();
