function forwardMoveSelectedItems() {
    var availableFields = document.getElementById('availableFields');
    var displayedFields = document.getElementById('displayedFields');

    // Move selected options from Available Fields to Displayed Fields
    for (var i = 0; i < availableFields.options.length; i++) {
        if (availableFields.options[i].selected) {
            displayedFields.add(new Option(availableFields.options[i].text, availableFields.options[i].value));
        }
    }
}

function backwardMoveSelectedItems() {
    var availableFields = document.getElementById('availableFields');
    var displayedFields = document.getElementById('displayedFields');

    for (var i = 0; i < displayedFields.options.length; i++) {
        if (displayedFields.options[i].selected) {
            displayedFields.options[i].remove();
            i--;
        }
    }
}

function onNextClick() {
    const displayedFields = document.getElementById('displayedFields');
    const selectedFields = Array.from(displayedFields.options).map(option => option.value);
    const fileInput = document.getElementById('input_file');
    const fileType = document.getElementById('file_type').value;
    const characterEncoding = document.getElementById('character_encoding').value
    const delimiter = document.getElementById('delimiter').value;
    const isHeaderChecked = document.getElementById('header_checkbox').value

    if (fileInput.files.length == 0) {
        alert('Please choose a file.');
    }else{
        const file = fileInput.files[0];

        const inputFileType = file.type;

        if(!inputFileType.includes(fileType)){
            alert('File Type does not match with input file format');
        }else{
            const reader = new FileReader();

            reader.onload = function (e) {
                const fileContent = e.target.result;

                // Parse the CSV content based on the delimiter
                const rows = fileContent.split('\n').map(row => row.split(delimiter));

                // Display the parsed content
                document.getElementById('fileContent').innerText = JSON.stringify(rows, null, 2);

                console.log(JSON.stringify(rows, null, 2));
            };

            // Read the file as text
            reader.readAsText(file);
        }
    }

    sessionStorage.setItem('selectedFields', JSON.stringify(selectedFields));

    // window.location.href = 'result.html';
}