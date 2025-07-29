const apiKey = "YOUR_DEEPSEEK_API_KEY";

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.querySelector("#jarvisReply span").textContent = transcript;
    getSmartReply(transcript);
  };

  recognition.onerror = (event) => {
    speak("Sorry, I didn't catch that.");
  };
}

function getSmartReply(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("open youtube")) {
    speak("Opening YouTube.");
    window.open("https://www.youtube.com", "_blank");
    return;
  }
  if (lower.includes("open google")) {
    speak("Opening Google.");
    window.open("https://www.google.com", "_blank");
    return;
  }
  if (lower.startsWith("search for")) {
    const query = lower.replace("search for", "").trim();
    speak("Searching Google for " + query);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    return;
  }
  if (lower.includes("what is the time")) {
    const time = new Date().toLocaleTimeString();
    speak("The time is " + time);
    document.querySelector("#jarvisReply span").textContent = "The time is " + time;
    return;
  }
  if (lower.includes("what is today's date") || lower.includes("what is the date")) {
    const date = new Date().toLocaleDateString();
    speak("Today's date is " + date);
    document.querySelector("#jarvisReply span").textContent = "Today's date is " + date;
    return;
  }
  if (lower.includes("tell me a joke")) {
    const jokes = [
      "Why did the web developer go broke? Because he used up all his cache.",
      "I would tell you a UDP joke, but you might not get it.",
      "Why do Java developers wear glasses? Because they don’t C#."
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    speak(joke);
    document.querySelector("#jarvisReply span").textContent = joke;
    return;
  }
  if (lower.includes("change theme")) {
    document.body.classList.toggle("light-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    speak("Switched to " + theme + " theme.");
    return;
  }
  if (lower.includes("open calculator")) {
    speak("Opening online calculator.");
    window.open("https://www.google.com/search?q=calculator", "_blank");
    return;
  }
  if (lower.includes("play music")) {
    speak("Opening Spotify.");
    window.open("https://open.spotify.com", "_blank");
    return;
  }
  if (lower.includes("open chatgpt")) {
    speak("Opening ChatGPT.");
    window.open("https://chat.openai.com", "_blank");
    return;
  }

  speak("Let me think...");

  fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are Jarvis, a smart assistant." },
        { role: "user", content: prompt }
      ]
    })
  })
    .then((res) => res.json())
    .then((data) => {
      const reply = data.choices[0].message.content;
      document.querySelector("#jarvisReply span").textContent = reply;
      speak(reply);
    })
    .catch((err) => {
      console.error(err);
      speak("Sorry, I had trouble thinking.");
    });
}