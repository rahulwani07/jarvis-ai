const output = document.getElementById("output");

// Text-to-Speech
function speak(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = 'en-US';
  window.speechSynthesis.speak(speech);
  output.textContent = "Jarvis: " + text;
}

// Voice Recognition
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onstart = () => {
    output.textContent = "Listening...";
  };

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    output.textContent = "You said: " + command;
    respondToCommand(command);
  };
}

function respondToCommand(command) {
  if (command.includes("hello")) {
    speak("Hello, I am Jarvis. How can I help you?");
  } else if (command.includes("time")) {
    const now = new Date().toLocaleTimeString();
    speak("The current time is " + now);
  } else if (command.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://www.youtube.com", "_blank");
  } else if (command.includes("open google")) {
    speak("Opening Google");
    window.open("https://www.google.com", "_blank");
  } else if (command.includes("search for")) {
    const query = command.replace("search for", "").trim();
    speak("Searching Google for " + query);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  } else {
    speak("Sorry, I don't understand that command.");
  }
}
