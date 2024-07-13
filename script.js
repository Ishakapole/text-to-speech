document.addEventListener("DOMContentLoaded", function() {
    const textToConvert = document.getElementById("textToConvert");
    const convertBtn = document.getElementById("convertBtn");
    const startRecordingBtn = document.getElementById("startRecordingBtn");
    const stopRecordingBtn = document.getElementById("stopRecordingBtn");
    const speechToText = document.getElementById("speechToText");
    const languageSelect = document.getElementById("languageSelect");
    const languageSelectSTT = document.getElementById("languageSelectSTT");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const clearBtn = document.getElementById("clearBtn");
    const copyToClipboardBtn = document.getElementById("copyToClipboardBtn");

    let recognition;

    // Dark Mode Toggle
    darkModeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode");
    });

    // Text to Speech Functionality
    convertBtn.addEventListener('click', function () {
        const speechSynth = window.speechSynthesis;
        const enteredText = textToConvert.value;
        const selectedLang = languageSelect.value;

        if (!speechSynth.speaking && enteredText.trim().length) {
            const utterance = new SpeechSynthesisUtterance(enteredText);
            utterance.lang = selectedLang;
            speechSynth.speak(utterance);
            convertBtn.innerHTML = '<i class="fas fa-volume-up"></i> Playing...';
            
            utterance.onend = () => {
                convertBtn.innerHTML = '<i class="fas fa-play"></i> Play Converted Sound';
            };
        }
    });

    // Speech to Text Functionality
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else {
        recognition = new SpeechRecognition();
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default language setting

    startRecordingBtn.addEventListener('click', function () {
        recognition.lang = languageSelectSTT.value; // Set recognition language based on dropdown
        recognition.start();
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
    });

    stopRecordingBtn.addEventListener('click', function () {
        recognition.stop();
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        speechToText.value = transcript;
    };

    recognition.onerror = function (event) {
        console.error('Error occurred in recognition:', event.error);
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
    };

    // Copy to Clipboard Functionality
    copyToClipboardBtn.addEventListener('click', function () {
        speechToText.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    });

    // Clear Button Functionality
    clearBtn.addEventListener('click', function () {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel(); // Cancel speech synthesis if it's speaking
        }
        textToConvert.value = ''; // Clear text area
        convertBtn.innerHTML = '<i class="fas fa-play"></i> Play Converted Sound'; // Reset convert button text
        speechToText.value = ''; // Clear speech to text area
    });
});
