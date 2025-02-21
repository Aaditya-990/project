// Event listener for form submission
document.getElementById('submitBtn').addEventListener('click', function() {
    // Get JSON input from the user
    const input = document.getElementById('jsonInput').value;
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Clear any previous errors

    // Validate the JSON
    const validatedJson = validateJson(input);
    if (!validatedJson) {
        errorDiv.textContent = 'Invalid JSON format.';
        return;
    }

    // Call the backend API with the valid JSON
    fetch('http://localhost:5000/api/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedJson)
    })
    .then(response => response.json())
    .then(data => {
        // Show multi-select section and result section
        document.getElementById('multiSelectSection').style.display = 'block';
        document.getElementById('resultSection').style.display = 'block';

        // Store the raw response for later filtering
        window.responseData = data;

        // Display unfiltered response
        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => {
        errorDiv.textContent = `Error: ${err.message}`;
    });
});

// Event listener for multi-select dropdown change
document.getElementById('multiSelect').addEventListener('change', function() {
    if (!window.responseData) return;

    const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
    const filteredData = filterResponse(window.responseData.data, selectedOptions);

    // Display the filtered result
    document.getElementById('result').textContent = JSON.stringify({ data: filteredData }, null, 2);
});

// Validate the JSON input
function validateJson(input) {
    try {
        return JSON.parse(input); // Try to parse JSON
    } catch (e) {
        return null; // Return null if invalid
    }
}

// Filter the response data based on selected options
function filterResponse(data, selectedOptions) {
    let filteredData = [...data];

    if (selectedOptions.includes('Alphabets')) {
        filteredData = filteredData.filter(item => /^[A-Za-z]$/.test(item));
    }

    if (selectedOptions.includes('Numbers')) {
        filteredData = filteredData.filter(item => /^[0-9]$/.test(item));
    }

    if (selectedOptions.includes('Highest alphabet')) {
        const alphabets = filteredData.filter(item => /^[A-Za-z]$/.test(item));
        if (alphabets.length > 0) {
            filteredData = [alphabets.sort().reverse()[0]]; // Get the highest alphabet
        }
    }

    return filteredData;
}
