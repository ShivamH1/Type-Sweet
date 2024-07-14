// Query the necessary elements from the DOM
const typingText = document.querySelector(".typing-text p"); // The paragraph element to display the text
const input = document.querySelector(".input-field"); // The input field for the user to type
const time = document.querySelector(".time span b"); // The element to display the remaining time
const mistakes = document.querySelector(".mistakes span"); // The element to display the number of mistakes
const wpm = document.querySelector(".wpm span"); // The element to display the words per minute
const cpm = document.querySelector(".cpm span"); // The element to display the characters per minute
const startButton = document.querySelector(".content button"); // The button to reset the game

// Initialize variables
let timer; // Timer for the game
let maxTime = 60; // Maximum time for the game
let timeLeft = maxTime; // Remaining time for the game
let charIdx = 0; // Index of the current character being typed
let mistake = 0; // Number of mistakes made by the user
let isTyping = false; // Flag to indicate if the user is currently typing

// Function to load a random paragraph from the array
function loadParagraph() {
  const paragraph = [
    // Array of paragraphs
    "Rain lashed against the windowpanes, the wind howling like a lonely wolf. Inside, the cozy cabin crackled with the warmth of a crackling fire. A pot bubbled merrily on the cast iron stove, sending tendrils of a delicious scent wafting through the air. Curled up on a plush armchair with a well-worn book, you couldn't help but feel a sense of contentment wash over you.",
    "The aroma of freshly baked bread filled the air, a symphony of sweet and savory dancing on the taste buds. Sunlight streamed through the kitchen window, painting golden squares across the worn wooden table. A steaming mug of coffee awaited, its warmth beckoning for a moment of pause before the day began.",
    "The city pulsed with a vibrant energy, a kaleidoscope of sights and sounds. Taxis honked, crowds buzzed, and neon signs cast an otherworldly glow. A lone guitarist strummed a melancholic tune on a street corner, his music weaving through the urban chaos. A sense of both excitement and anonymity hung heavy in the air.",
    "The library was a haven of tranquility, its shelves overflowing with whispered stories and forgotten knowledge. The scent of aged paper and leather mingled with the faint hum of air conditioning. A lone figure sat hunched over a book, their brow furrowed in concentration. Time seemed to slow down within these walls, a sanctuary from the outside world.",
    "The spaceship hummed with a low thrum, its metallic walls gleaming under the soft glow of the artificial lights. Outside, an endless expanse of stars stretched towards the inky blackness, a breathtaking display of celestial wonder. The captain sat at the helm, her eyes fixed on the star charts, navigating them towards the unknown depths of the galaxy.",
    "The bustling marketplace was a feast for the senses. Exotic fruits piled high in colorful mounds, spices overflowing from woven baskets, and the rhythmic thwack of a butcher chopping meat filled the air. A street performer juggled iridescent balls, their laughter mingling with the cries of vendors and the chatter of the crowd.",
    "The ancient ruins stood shrouded in mystery, remnants of a forgotten civilization. Moss clung to the weathered stones, vines snaked their way through crumbled archways, and the wind whispered secrets through the deserted halls. A sense of awe and wonder filled the air, a reminder of the passage of time and the impermanence of all things.",
    "Deep within the forest, sunlight struggled to penetrate the dense canopy of leaves. The air hung heavy with the scent of damp earth and decaying leaves, and the only sound was the occasional chirp of a bird or the rustle of unseen creatures in the undergrowth. A lone path snaked through the trees, leading towards an unknown destination.",
    "The train rattled along the tracks, the rhythmic clickety-clack a soothing lullaby. Rolling hills and lush valleys unfolded outside the window, a picturesque landscape bathed in the golden hues of the setting sun. Inside, passengers relaxed in their seats, some lost in thought, others engrossed in books or conversation.",
    "The classroom buzzed with activity. Papers rustled, pencils scratched, and students murmured amongst themselves. The teacher paced back and forth at the front, their voice rising above the din as they explained a complex concept. On the blackboard, intricate equations and diagrams attempted to capture the essence of the universe.",
  ];

  // Generate a random index to select a paragraph
  const randomIdx = Math.floor(Math.random() * paragraph.length);

  // Clear the typing text element and populate it with the characters of the selected paragraph
  typingText.innerHTML = "";
  for (const char of paragraph[randomIdx]) {
    typingText.innerHTML += `<span>${char}</span>`;
  }

  // Add the 'active' class to the first character
  const firstChar = typingText.querySelector("span");
  firstChar.classList.add("active");

  // Add an event listener to focus on the input field when the user clicks on the typing text
  document.addEventListener("keydown", () => input.focus());
  typingText.addEventListener("click", () => input.focus());
}

// Function to initialize the typing process
function initTyping() {
  // Get the characters and the currently typed character
  const chars = typingText.querySelectorAll("span");
  const char = chars[charIdx];
  const typedChar = input.value.charAt(charIdx);

  // If the input field is empty, return
  if (!typedChar) return;

  // If the user is still typing, start the timer if it hasn't started already
  if (typedChar && charIdx < chars.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTime, 1000);
      isTyping = true;
    }

    // Check if the typed character matches the corresponding character
    if (char.textContent === typedChar) {
      char.classList.add("correct");
      console.log("correct");
    } else {
      char.classList.add("incorrect");
      console.log("incorrect");
      mistake++;
      mistakes.textContent = mistake;
    }

    // Remove the 'active' class from the current character and add it to the next character if available
    char.classList.remove("active");
    charIdx++;
    if (charIdx < chars.length) {
      chars[charIdx].classList.add("active");
    }
  } else {
    // If the maximum length or time is reached, clear the timer and reset the game
    clearInterval(timer);
    input.value = "";
    console.log("Max length reached or time is up");
  }
}

// Function to initialize the timer
function initTime() {
  // If there is still time left, decrease the time and update the UI
  if (timeLeft > 0) {
    timeLeft--;
    time.innerText = timeLeft;
    cpm.textContent = charIdx - mistake;

    // Calculate the words per minute and update the UI
    const wpmValue = Math.round(
      (charIdx - mistake) / 5 / ((maxTime - timeLeft) / 60)
    );
    wpm.textContent = wpmValue > 0 ? wpmValue : 0;
  } else {
    // If the time is up, clear the timer
    clearInterval(timer);
  }
}

// Function to reset the game
function reset() {
  // Load a new paragraph, clear the timer, reset the timer and other variables, and clear the UI
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  time.innerText = timeLeft;
  input.value = "";
  charIdx = 0;
  mistake = 0;
  isTyping = false;
  wpm.innerText = 0;
  cpm.innerText = 0;
  mistakes.innerText = 0;

  // Remove the 'active', 'correct', and 'incorrect' classes from all the characters
  const chars = typingText.querySelectorAll("span");
  chars.forEach((char) => {
    char.classList.remove("active", "correct", "incorrect");
  });
}

// Add event listeners to the input field and the start button
input.addEventListener("input", initTyping);
startButton.addEventListener("click", reset);

// Load the initial paragraph when the page loads
loadParagraph();
