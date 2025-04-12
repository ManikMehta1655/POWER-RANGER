// Data storage utilities
console.log('Data utilities loaded');

// Helper function to show messages
function showMessage(message, elementId = 'message') {
    try {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
        } else {
            console.log(message);
        }
    } catch (error) {
        console.error('Error displaying message:', error);
    }
}

// Initialize data utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Data utilities initialized');
});
