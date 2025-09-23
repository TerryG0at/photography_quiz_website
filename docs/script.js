// Enhanced Quiz Data with more questions and categories
const quizData = [
  {
    id: 1,
    category: "ISO",
    question: "What does ISO control in photography?",
    answers: ["Color", "Shutter speed", "Sensitivity to light", "Focus"],
    correct: 2,
    hint: "Higher ISO produce noise",
    explanation: "ISO (International Organization for Standardization) measures the sensitivity of your camera's sensor to light. Higher ISO values (like 800, 1600) make the sensor more sensitive, allowing you to shoot in darker conditions, but can introduce digital noise or grain."
  },
  {
    id: 2,
    category: "Shutter Speed",
    question: "Is this photo taken with a fast or slow shutter speed?",
    image: "images/q2.jpg",
    answers: ["Fast", "Slow"],
    correct: 0,
    hint: "Sport",
    explanation: "This photo shows a frozen moment with sharp details, indicating a fast shutter speed was used. Fast shutter speeds (like 1/500s or faster) freeze motion and are great for sports, wildlife, or any fast-moving subjects."
  },
  {
    id: 3,
    category: "General",
    question: "Which setting affects depth of field?",
    answers: ["ISO", "Shutter speed", "Aperture", "White balance"],
    correct: 2,
    hint: "Ring like structure in lens",
    explanation: "Aperture (f-stop) controls the depth of field - how much of your image is in focus from front to back. Wide apertures (low f-numbers like f/1.4) create shallow depth of field with blurred backgrounds, while narrow apertures (high f-numbers like f/16) create deep depth of field with more of the scene in focus."
  },
  {
    id: 4,
    category: "Shutter Speed",
    question: "Is this photo taken with a fast or slow shutter speed?",
    image: "images/q4.JPG",
    answers: ["Fast", "Slow"],
    correct: 1,
    hint: "Night time",
    explanation: "It was an outdoor shoot at night, with poor light conditions so a slow shutter speed was used to allow more light to hit the sensor. Since the subject is still, the slow shutter speed captures more light without motion blur."
  },
  {
    id: 5,
    category: "General",
    question: "What is the relationship between ISO, aperture, and shutter speed?",
    answers: ["They are independent settings", "They work together to control exposure", "Only two affect exposure", "They only matter in manual mode"],
    correct: 1,
    hint: "3 basic principles of photography",
    explanation: "ISO, aperture, and shutter speed form the 'exposure triangle' - they work together to control how much light reaches your camera's sensor. Changing one affects the others, and understanding their relationship is key to manual photography."
  },
  {
    id: 6,
    category: "Aperture",
    question: "Which f-stop would give you the bokeh effect?",
    answers: ["f/22", "f/8", "f/2.8", "f/16"],
    correct: 2,
    hint: "Bokeh means blurred background",
    explanation: "f/2.8 is the widest aperture listed, which creates the shallowest depth of field. The lower the f-number, the wider the aperture and the more background blur you'll get."
  },

  {
    id: 7,
    category: "General",
    question: "Which setting control the exposure of image?",
    answers: ["All 3", "ISO", "Shutter speed", "Aperture"],
    correct: 0,
    hint: "Exposure triangle",
    explanation: "ISO controls the sensitivity of the camera sensor to light. Shutter speed controls how long the sensor is exposed to light. Aperture controls how much light enters through the lens. All three settings work together to determine the overall exposure of an image."
  }
];

// Quiz State Management
class QuizManager {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.hintShown = false;
    this.timeLeft = 30;
    this.timer = null;
    this.startTime = null;
    this.totalTime = 0;
    this.answers = [];
    this.highScore = this.loadHighScore();
    
    this.initializeElements();
    this.bindEvents();
    this.showWelcomeScreen();
  }

  initializeElements() {
    this.elements = {
      welcomeScreen: document.getElementById('welcome-screen'),
      quizContainer: document.getElementById('quiz-container'),
      resultsScreen: document.getElementById('results-screen'),
      questionContainer: document.getElementById('question-container'),
      nextButton: document.getElementById('next-button'),
      hintButton: document.getElementById('hint-button'),
      hintLogo: document.getElementById('hint-logo'),
      progressFill: document.getElementById('progress-fill'),
      currentQuestion: document.getElementById('current-question'),
      totalQuestions: document.getElementById('total-questions'),
      timer: document.getElementById('timer'),
      timeLeft: document.getElementById('time-left'),
      currentScore: document.getElementById('current-score'),
      highScore: document.getElementById('high-score'),
      startQuiz: document.getElementById('start-quiz'),
      restartQuiz: document.getElementById('restart-quiz'),
      reviewAnswers: document.getElementById('review-answers'),
      finalScore: document.getElementById('final-score'),
      scorePercentage: document.getElementById('score-percentage'),
      correctAnswers: document.getElementById('correct-answers'),
      incorrectAnswers: document.getElementById('incorrect-answers'),
      totalTime: document.getElementById('total-time'),
      feedbackMessage: document.getElementById('feedback-message')
    };

    // Update high score display
    this.elements.highScore.textContent = this.highScore;
  }

  bindEvents() {
    this.elements.startQuiz.addEventListener('click', () => this.startQuiz());
    this.elements.restartQuiz.addEventListener('click', () => this.restartQuiz());
    this.elements.reviewAnswers.addEventListener('click', () => this.reviewAnswers());
    this.elements.nextButton.addEventListener('click', () => this.nextQuestion());
    this.elements.hintButton.addEventListener('click', () => this.toggleHint());
    this.elements.hintLogo.addEventListener('click', () => this.toggleHint());
  }

  showWelcomeScreen() {
    this.elements.welcomeScreen.style.display = 'flex';
    this.elements.quizContainer.style.display = 'none';
    this.elements.resultsScreen.style.display = 'none';
  }

  startQuiz() {
    this.elements.welcomeScreen.style.display = 'none';
    this.elements.quizContainer.style.display = 'block';
    this.elements.resultsScreen.style.display = 'none';
    
    this.resetQuiz();
    this.showQuestion();
    this.startTimer();
  }

  resetQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.hintShown = false;
    this.timeLeft = 30;
    this.answers = [];
    this.startTime = Date.now();
    this.updateScore();
    this.updateProgress();
  }

  showQuestion() {
    const q = quizData[this.currentQuestion];
    this.elements.questionContainer.innerHTML = '';

    // Question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.innerHTML = `
      <div class="question-category">${q.category}</div>
      <div class="question-main">${q.question}</div>
    `;
    this.elements.questionContainer.appendChild(questionText);

    // Question image
    if (q.image) {
      const img = document.createElement('img');
      img.src = q.image;
      img.alt = "Question image";
      img.className = 'question-image';
      this.elements.questionContainer.appendChild(img);
    }

    // Answer buttons
    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';

    q.answers.forEach((answer, index) => {
      const btn = document.createElement('button');
      btn.className = 'answer-button';
      btn.innerHTML = `
        <span class="answer-text">${answer}</span>
        <i class="fas fa-check answer-icon correct-icon" style="display: none;"></i>
        <i class="fas fa-times answer-icon incorrect-icon" style="display: none;"></i>
      `;
      btn.onclick = () => this.handleAnswer(index);
      answersDiv.appendChild(btn);
    });

    this.elements.questionContainer.appendChild(answersDiv);

    // Create hint div (now after answers)
    if (q.hint) {
      const hintDiv = document.createElement('div');
      hintDiv.id = 'hint';
      hintDiv.style.display = 'none';
      hintDiv.innerHTML = `
        <i class="fas fa-lightbulb"></i>
        <span>${q.hint}</span>
      `;
      this.elements.questionContainer.appendChild(hintDiv);
      this.elements.hintButton.style.display = 'flex';
    } else {
      this.elements.hintButton.style.display = 'none';
    }

    // Reset hint state
    this.hintShown = false;
    this.elements.hintLogo.style.display = 'none';
    this.elements.nextButton.style.display = 'none';
  }

  handleAnswer(selectedIndex) {
    const q = quizData[this.currentQuestion];
    const buttons = document.querySelectorAll('.answer-button');
    
    // Stop timer
    this.stopTimer();
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show correct/incorrect indicators
    buttons.forEach((btn, index) => {
      const correctIcon = btn.querySelector('.correct-icon');
      const incorrectIcon = btn.querySelector('.incorrect-icon');
      
      if (index === q.correct) {
        btn.classList.add('correct');
        correctIcon.style.display = 'inline-block';
      } else if (index === selectedIndex) {
        btn.classList.add('incorrect');
        incorrectIcon.style.display = 'inline-block';
      }
    });

    // Update score
    if (selectedIndex === q.correct) {
      this.score++;
      this.updateScore();
    }

    // Store answer for review
    this.answers.push({
      question: q,
      selected: selectedIndex,
      correct: selectedIndex === q.correct,
      timeSpent: 30 - this.timeLeft
    });

    // Show next button
    this.elements.nextButton.style.display = 'flex';
  }

  nextQuestion() {
    this.currentQuestion++;
    this.elements.nextButton.style.display = 'none';
    
    if (this.currentQuestion < quizData.length) {
      this.timeLeft = 30;
      this.hintShown = false;
      this.updateProgress();
      this.showQuestion();
      this.startTimer();
    } else {
      this.finishQuiz();
    }
  }

  startTimer() {
    this.timeLeft = 30;
    this.updateTimer();
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();
      
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimer() {
    this.elements.timeLeft.textContent = this.timeLeft;
    
    // Update timer styling based on time left
    this.elements.timer.className = 'timer';
    if (this.timeLeft <= 10) {
      this.elements.timer.classList.add('danger');
    } else if (this.timeLeft <= 20) {
      this.elements.timer.classList.add('warning');
    }
  }

  handleTimeUp() {
    const buttons = document.querySelectorAll('.answer-button');
    const q = quizData[this.currentQuestion];
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show correct answer
    buttons.forEach((btn, index) => {
      const correctIcon = btn.querySelector('.correct-icon');
      if (index === q.correct) {
        btn.classList.add('correct');
        correctIcon.style.display = 'inline-block';
      }
    });

    // Store answer as incorrect
    this.answers.push({
      question: q,
      selected: -1,
      correct: false,
      timeSpent: 30
    });

    // Show next button
    this.elements.nextButton.style.display = 'flex';
  }

  finishQuiz() {
    this.totalTime = Math.round((Date.now() - this.startTime) / 1000);
    this.stopTimer();
    
    // Calculate final score
    const percentage = Math.round((this.score / quizData.length) * 100);
    const incorrect = quizData.length - this.score;
    
    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
    
    // Update results screen
    this.elements.finalScore.textContent = this.score;
    this.elements.scorePercentage.textContent = `${percentage}%`;
    this.elements.correctAnswers.textContent = this.score;
    this.elements.incorrectAnswers.textContent = incorrect;
    this.elements.totalTime.textContent = `${this.totalTime}s`;
    
    // Set feedback message
    this.setFeedbackMessage(percentage);
    
    // Show results screen
    this.elements.quizContainer.style.display = 'none';
    this.elements.resultsScreen.style.display = 'flex';
  }

  setFeedbackMessage(percentage) {
    let message = '';
    let icon = '';
    
    if (percentage === 100) {
      message = "Perfect! You're a photography master! 🏆";
      icon = "fas fa-crown";
    } else if (percentage >= 80) {
      message = "Excellent work! You have a great understanding of the exposure triangle! 🌟";
      icon = "fas fa-star";
    } else if (percentage >= 60) {
      message = "Good job! You're on the right track with your photography knowledge! 👍";
      icon = "fas fa-thumbs-up";
    } else if (percentage >= 40) {
      message = "Not bad! Keep practicing and you'll improve your photography skills! 📚";
      icon = "fas fa-book";
    } else {
      message = "Keep learning! The exposure triangle takes time to master. Don't give up! 💪";
      icon = "fas fa-heart";
    }
    
    this.elements.feedbackMessage.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;
  }

  restartQuiz() {
    this.showWelcomeScreen();
  }

  reviewAnswers() {
    // Create review modal or navigate to review page
    this.showReviewModal();
  }

  showReviewModal() {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
      <div class="review-content">
        <div class="review-header">
          <h3>Answer Review</h3>
          <button class="close-review">&times;</button>
        </div>
        <div class="review-answers">
          ${this.answers.map((answer, index) => `
            <div class="review-item ${answer.correct ? 'correct' : 'incorrect'}">
              <div class="review-question">
                <strong>Question ${index + 1}:</strong> ${answer.question.question}
              </div>
              <div class="review-details">
                <span>Your answer: ${answer.selected >= 0 ? answer.question.answers[answer.selected] : 'Time ran out'}</span>
                <span>Correct answer: ${answer.question.answers[answer.question.correct]}</span>
                <span>Time spent: ${answer.timeSpent}s</span>
              </div>
              <div class="review-explanation">
                <strong>Explanation:</strong> ${answer.question.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-review').onclick = () => {
      document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }

  toggleHint() {
    const hintDiv = document.getElementById('hint');
    if (hintDiv) {
      this.hintShown = !this.hintShown;
      hintDiv.style.display = this.hintShown ? 'block' : 'none';
    }
  }

  updateScore() {
    this.elements.currentScore.textContent = this.score;
  }

  updateProgress() {
    const progress = ((this.currentQuestion + 1) / quizData.length) * 100;
    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.currentQuestion.textContent = this.currentQuestion + 1;
    this.elements.totalQuestions.textContent = quizData.length;
  }

  loadHighScore() {
    return parseInt(localStorage.getItem('photography-quiz-high-score')) || 0;
  }

  saveHighScore() {
    localStorage.setItem('photography-quiz-high-score', this.highScore.toString());
    this.elements.highScore.textContent = this.highScore;
  }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QuizManager();
});

/* === Red Trail Cursor (no main ring) === */
(() => {
  const ENABLE_CUSTOM_CURSOR = true;
  if (!ENABLE_CUSTOM_CURSOR || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DOT_COUNT = 16;        // number of trail "ghosts"
  const EASE_TAIL = 0.125;      // how fast each dot follows the previous one (0..1)
  const FADE_STEP = 0.025;     // per-dot extra fade
  const SCALE_STEP = 0.024;    // per-dot extra scale reduction

  // Create trail dots
  const dots = Array.from({ length: DOT_COUNT }, () => {
    const d = document.createElement('div');
    d.className = 'cursor-dot';
    document.body.appendChild(d);
    return d;
  });

  // Positions store
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Each element keeps its own position for nice lag
  const state = [];
  for (let i = 0; i < DOT_COUNT; i++) state.push({ x: mouseX, y: mouseY });

  // Events
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    dots.forEach(d => d.style.opacity = '0');
  });
  window.addEventListener('pointerenter', () => {
    dots.forEach((d, i) => d.style.opacity = String(0.55 - i * FADE_STEP));
  });

  // Animation loop
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    // first dot follows the mouse directly
    state[0].x = lerp(state[0].x, mouseX, EASE_TAIL);
    state[0].y = lerp(state[0].y, mouseY, EASE_TAIL);

    dots[0].style.transform = `translate(${state[0].x}px, ${state[0].y}px) translate(-50%, -50%) scale(0.92)`;
    dots[0].style.opacity = (0.55).toFixed(3);

    // remaining dots follow the previous dot
    for (let i = 1; i < state.length; i++) {
      const prev = state[i - 1];
      const self = state[i];
      self.x = lerp(self.x, prev.x, EASE_TAIL);
      self.y = lerp(self.y, prev.y, EASE_TAIL);

      const s = Math.max(0.55, 0.92 - i * SCALE_STEP);
      const o = Math.max(0, 0.55 - i * FADE_STEP);

      const dot = dots[i];
      dot.style.transform = `translate(${self.x}px, ${self.y}px) translate(-50%, -50%) scale(${s})`;
      dot.style.opacity = o.toFixed(3);
    }

    requestAnimationFrame(tick);
  }

  // Start
  requestAnimationFrame(tick);
})();
