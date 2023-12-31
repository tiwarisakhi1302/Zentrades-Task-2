const delimiters = new Map([
    ['comma', ','],
    ['semicolon', ';'],
]);

let data = {};

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
    const isHeaderChecked = document.getElementById('header_checkbox').checked;

    if (fileInput.files.length == 0) {
        alert('Please choose a file.');
    }else{
        const file = fileInput.files[0];

        const inputFileType = file.type;

        if (!inputFileType.includes(fileType)) {
            alert('File Type does not match with input file format');
            data = {};
        } else {
            const reader = new FileReader();
            reader.readAsText(file, characterEncoding);

            reader.onload = function (e) {
                const fileContent = e.target.result;

                if (fileType == 'csv') {
                    if (!isHeaderChecked) {
                        alert('CSV file must contain headers');
                    }
                    else {
                        const headers = fileContent.split('\n')[0].trim().split(delimiters.get(delimiter));

                        data = fileContent.split('\n').filter((row, index) => (index > 0)).map(row => {
                            const values = row.trim().split(delimiters.get(delimiter));
                            const rowObject = {};

                            headers.forEach((header, index) => {
                                rowObject[header.trim()] = values[index];
                            });
                            return rowObject;
                        });
                    }
                    
                } else if (fileType === 'json') {
                    try {
                        products = JSON.parse(fileContent).products;

                        data = Object.keys(products).map(key => ({
                            id: key,
                            ...products[key]
                        }));
                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                    }
                }
                if (data.length > 0) {
                    sessionStorage.setItem('selectedFields', JSON.stringify(selectedFields));
                    sessionStorage.setItem('data', JSON.stringify(data));

                    window.location.href = 'result.html';
                }
                else {
                    alert('No data found');
                }
            };
        }
    }
}