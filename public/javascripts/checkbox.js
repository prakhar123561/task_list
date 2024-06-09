document.addEventListener('DOMContentLoaded', function () {
const checkboxes = document.querySelectorAll('.check');
const deleteButton = document.getElementById('deleteButton');

const deleteSound = document.getElementById('deleteSound');

let isAudioPlaying = false;

// Add an event listener to checkboxes to toggle the display of the delete button
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', toggleDeleteButton);
});

// Add an event listener to the "Delete Selected" button for Ajax submission
deleteButton.addEventListener('click', deleteSelected);

function toggleDeleteButton() {
    // Check if at least one checkbox is checked
    const atLeastOneChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

       // Enable or disable the delete button based on checkbox status
       deleteButton.disabled = !atLeastOneChecked;

    // Display the delete button if at least one checkbox is checked
    if (atLeastOneChecked) {
        deleteButton.style.display = 'block';
    } else {
        deleteButton.style.display = 'none';
    }
}

function deleteSelected() {
    if (isAudioPlaying) {
        // If the audio is already playing, don't play it again
        return;
    }

    // Collect the selected checkboxes
    const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    // Collect the 'todoid' values of the selected checkboxes
    const todoids = selectedCheckboxes.map(checkbox => checkbox.value);

    if (todoids.length === 0) {
        alert('Please select at least one item to delete.');
        return;
    }


  // Set the flag to prevent rapid audio playback
  isAudioPlaying = true;

  // Send an Ajax request to delete the selected items
  fetch('/todo/todo_delete', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todoid: todoids }),
  })
  .then(response => {
      if (response.status === 200) {
// Play the delete sound after a short delay
setTimeout(() => {
    deleteSound.currentTime = 0; // Reset the audio to the beginning
    deleteSound.play();
}, 100); // Adjust the delay time as needed

          // Refresh the page to reflect the changes
          window.location.reload();
      } else {
          console.error('Error deleting items.');
      }
  })
  .catch(error => console.error(error))
  .finally(() => {
      isAudioPlaying = false; // Reset the flag
  });
}

// Play the delete sound
deleteSound.currentTime = 0; // Reset the audio to the beginning
deleteSound.play();


})
