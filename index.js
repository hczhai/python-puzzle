// Serve an object with this structure in order to generate a quiz page
// The `correct` key is referential and should not be served
const quiz = {
    "name": "Python Puzzles",
    "questions": [
        {
            "type": "short",
            "question": "Do not use \",\", create a list object \"[4, 5, 6]\".",
            "entered": [],
            "answers": ["[4]+[5]+[6]"]
        },
        {
            "type": "short",
            "question": "Do not use \",\" and \"+\", create a list object \"[4, 5, 6]\".",
            "entered": [],
            "answers": ["[4].__add__([5]).__add__([6])"]
        },
        {
            "type": "short",
            "question": "Do not use \",\" inside \"[]\" and \"+\" and \".\", create a list object \"[4, 5, 6]\".",
            "entered": [],
            "answers": ["getattr(getattr([4], '__add__')([5]), '__add__')([6])"]
        },
        {
            "type": "short",
            "question": "Do not use \",\" and \"+\" and \".__\", create a list object \"[4, 5, 6]\".",
            "entered": [],
            "answers": ["getattr(*dict(__add__=getattr(*dict(__add__=[4]).popitem()[::-1])([5])).popitem()[::-1])([6])"]
        },
        {
            "type": "short",
            "question": "Do not use \"[\" and \"]\" and \"{\" and \"}\" and \",\", create a list object \"[123]\".",
            "entered": [],
            "answers": ["list(dict(a=123).values())"]
        },
        {
            "type": "short",
            "question": "Do not use \"[\" and \"]\" and \"{\" and \"}\" and \",\" and \"list\", create a list object \"[123]\".",
            "entered": [],
            "answers": ["sorted(dict(a=123).values())"]
        },
        {
            "type": "short",
            "question": "Do not use \"[\" and \"]\" and \"{\" and \"}\" and \",\" and \"set\" and \"dict\" (but \"__dict__\" is ok), create a dict object \"{'a': 123}\".",
            "entered": [],
            "answers": ["(lambda : 1).__dict__.__class__(a=123)"]
        },
        {
            "type": "short",
            "question": "Do not use \"[\" and \"]\" and \"{\" and \"}\" and \",\" and \"set\" and \"dict\", create a dict object \"{'a': 123}\".",
            "entered": [],
            "answers": ["vars(lambda : 1).__class__(a=123)"]
        },
        {
            "type": "short",
            "question": "Do not use \"[\" and \"]\" and \"{\" and \"}\" and \",\" and \"set\" and \"dict\" and \"lambda\" and \"vars\", create a dict object \"{'a': 123}\".",
            "entered": [],
            "answers": ["globals().__class__(a=123)"]
        },
        {
            "type": "short",
            "question": "Do not use \",\" and \"tuple\", create a tuple object \"(1, 2)\".",
            "entered": [],
            "answers": ["zip([1]).__next__() + zip([2]).__next__()"]
        },
        {
            "type": "short",
            "question": "Do not use \"lambda\" and \"def\", create a callable object behaving like \"lambda x: x + 1\".",
            "entered": [],
            "answers": ["(1).__add__"]
        },
        {
            "type": "short",
            "question": "Do not use \"for\", create a callable object behaving like \"lambda x: [x + 2 for x in x]\". \"x\" is a list of integers.",
            "entered": [],
            "answers": ["lambda x: list(map(lambda y: y + 2, x))"]
        },
        {
            "type": "short",
            "question": "Do not use \"for\" and \"map\", create a callable object behaving like \"lambda x: [x + 2 for x in x]\". \"x\" is a list of integers.",
            "entered": [],
            "answers": ["lambda x: (lambda f, x: (lambda g, f, x: g(g, f, x))(lambda g, f, x: x and [f(x[0])] + g(g, f, x[1:]), f, x))(lambda y: y + 2, x)"]
        },
        {
            "type": "short",
            "question": "Do not use \"if\" and \"for\", create a callable object behaving like \"lambda x: [x for x in x if x > 2]\". \"x\" is a list of integers.",
            "entered": [],
            "answers": ["lambda x: list(filter(lambda y: y > 2, x))"]
        },
        {
            "type": "short",
            "question": "Do not use \"if\" and \"else\", create a callable object behaving like \"lambda f, x, y: x if f else y\".",
            "entered": [],
            "answers": ["lambda f, x, y: [y, x][f]"]
        },
        {
            "type": "short",
            "question": "Do not use \"for\" and \"if\" and \"else\" and \"map\" and \"filter\", create a callable object behaving like \"lambda x: [x for x in x if x > 2]\". \"x\" is a list of integers.",
            "entered": [],
            "answers": ["lambda x: (lambda f, x: (lambda g, f, x: g(g, f, x))(lambda g, f, x: x and [[], [x[0]]][f(x[0])] + g(g, f, x[1:]), f, x))(lambda y: y > 2, x)"]
        }
    ]
}
// Tracks index of question on quiz
let currentQuestionIndex = 0

// Shortcut for removing duplicates from arrays
const uniq = (a) => {
    return Array.from(new Set(a));
}

// Accepts a parent id to remove all children
const removeAllChildren = (parent) => {
    let node = document.getElementById(parent)
    node.innerHTML = ``
}

// Initialization functions go here
const init = () => {
    cr_CheckButton()
    cr_PrevButton()
    cr_ContinueButton()
    cr_AnswerButton()
    ad_QuestionIteration()
    loadQuestion(quiz.questions[0], true)
}

// Loads a multiple choice quiz question
const loadQuestion = async (question, init) => {
    updateProgessBarStatus()
    let title = document.getElementById(`quiz-name-x`)
    title.innerHTML = " Python Puzzle " + (currentQuestionIndex + 1).toString()
    let chktxt = document.getElementById(`quiz-x-check-text`)
    chktxt.innerHTML = ""
    cr_QuizQuestionText(question.question)
    if (question.type == `multiple` || question.type == `single`) {
        loadMultipleChoiceQuestion(question)
        loadPreviousEnteredChoice(question.entered)
    } else if (question.type == `short` || question.type == `long`) {
        loadTextFormQuestion()
        loadPreviousEnteredText(question.entered)
    }
    // Skips loading animation on initialization
    if (!init) {
        await MoveQuestionContainerMiddle()
    }
}

// Creates elements for multiple choice questions (checkboxes & radios)
const loadMultipleChoiceQuestion = (question) => {
    // Generating answer elements
    let quizAnswersUL = document.getElementById(`quiz-answer-list`)
    // questionHTML.id
    for (let i = 0; i < question.answers.length; i++) {
        let quizQuestionDIV = document.createElement(`div`)
        quizQuestionDIV.className = `quiz-answer-text-container-single unselected-answer`
        // Assigns ID as ASCII values (A = 65, B = 66, etc.)
        quizQuestionDIV.id = (i + 65).toString()
        ad_QuizSelectAnswer(quizQuestionDIV)
        // Generate elements
        let quizQuestionPress = document.createElement(`li`)
        let quizQuestionNumerator = document.createElement(`li`)
        let quizQuestionText = document.createElement(`li`)
        // Adding elements to quiz answers
        ed_QuizQuestionElements(question.type, quizQuestionPress, quizQuestionNumerator, quizQuestionDIV, quizQuestionText)
        // Convert ASCII code to text for multiple choice selection
        quizQuestionNumerator.innerText = String.fromCharCode(i + 65)
        quizQuestionText.innerText = question.answers[i]
        // Psuedoparent append
        quizQuestionDIV.append(quizQuestionPress, quizQuestionNumerator, quizQuestionText)
        // Main parent append
        quizAnswersUL.appendChild(quizQuestionDIV)
    }
}

const loadTextFormQuestion = () => {
    // Generating answer elements
    let quizAnswersUL = document.getElementById(`quiz-answer-list`)
    let questionTextarea = document.createElement(`div`);
    questionTextarea.contentEditable = true
    questionTextarea.className = `form-control question-text-form answer-typed-input-form`;
    questionTextarea.setAttribute(`id`, `questionTextarea`);
    questionTextarea.setAttribute(`data-text`, `Enter answer here...`)
    questionTextarea.setAttribute(`onkeydown`, `SaveWrittenAnswers()`)
    questionTextarea.innerHTML = ``
    quizAnswersUL.append(questionTextarea)
}

// Saves short and long form objects to local object
const SaveWrittenAnswers = () => {
    quiz.questions[currentQuestionIndex].entered[0] = document.getElementById(`questionTextarea`).innerHTML
}


// Assigns answered question attributes to elements that have been entered by user previously
const loadPreviousEnteredChoice = (entered) => {
    for (let i = 0; i < entered.length; i++) {
        selectAnswer(entered[i], true)
    }
}

// re-assigns text to short/long form questions
const loadPreviousEnteredText = () => {
    let entered = quiz.questions[currentQuestionIndex].entered
    if (entered.length > 0) {
        let answer = document.getElementById(`questionTextarea`)
        answer.innerHTML = entered[0]
    }
}

// Moves question off screen in a given direction
const MoveQuestionContainer = (first = `up`, second = `down`) => {
    return new Promise((resolve, reject) => {
        // Assigning correct class
        first = `move-container-` + first
        second = `move-container-` + second
        let parent = document.getElementById(`quiz-question-container`);
        parent.classList.add(first, `fadeout`, `fast-transition`);
        setTimeout(() => {
            parent.classList.remove(first, `fast-transition`)
            parent.classList.add(`no-transition`, second)
            resolve()
        }, 200)
    })

}

// Re-centers question on page
const MoveQuestionContainerMiddle = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let parent = document.getElementById(`quiz-question-container`);
            parent.classList.remove(`no-transition`, `fadeout`);
            parent.classList.add(`fast-transition`, `fadein`)
            parent.style.top = `0`
            parent.classList.remove(`move-container-down`, `move-container-up`)
            setTimeout(() => {
                parent.classList.remove(`fadein`)
                resolve()
            }, 200)
        }, 50)
    })
}

// Adds class names to quiz question based on which type of which it is
const ed_QuizQuestionElements = (type, press, numerator, container, text) => {
    // Append classes for different types of questions
    if (type == `single`) {
        // Radio button classes
        press.className = `press-key-label press-label-radio answer-key-numerator unselected-answer-button`
        numerator.className = `answer-key-numerator numerator-radio unselected-answer-button`
        container.classList.add(`question-type-single`)
    } else if (type == `multiple`) {
        // Checkbox classes
        press.className = `press-key-label press-label-checkbox answer-key-numerator unselected-answer-button`
        numerator.className = `answer-key-numerator numerator-checkbox unselected-answer-button`
        container.classList.add(`question-type-multiple`)
    }
    text.className = `quiz-answer-text-item`
    press.innerText = `Press`
}

// Assigns the question's text 
const cr_QuizQuestionText = (question) => {
    // Generating question text
    let quizQuestionTextDIV = document.getElementById(`quiz-question-text-container`)
    let quizQuestionTextSPAN = document.createElement(`span`)
    quizQuestionTextSPAN.className = `quiz-question-text-item`
    quizQuestionTextSPAN.innerText = question
    quizQuestionTextDIV.appendChild(quizQuestionTextSPAN)
}

// Creates continue button
const cr_CheckButton = () => {
    let continueDIV = document.createElement(`div`)
    let continueBUTTON = document.createElement(`button`)
    let continueSPAN = document.createElement(`span`)
    continueDIV.id = `quiz-x-button-container`
    continueDIV.className = `quiz-continue-button-container`
    continueBUTTON.id = `quiz-x-check-button`
    continueBUTTON.className = `quiz-continue-button`
    continueBUTTON.innerHTML = `Check`
    continueSPAN.className = `quiz-continue-text`
    continueSPAN.id = `quiz-x-check-text`
    continueSPAN.innerHTML = `?`
    // Moves to next question on click
    continueBUTTON.onclick = function() {
        ;
    }
    continueDIV.append(continueBUTTON, continueSPAN)
    let parent = document.getElementById(`quiz-question-container`)
    parent.append(continueDIV)
}

// Creates continue button
const cr_PrevButton = () => {
    let continueDIV = document.createElement(`div`)
    let continueBUTTON = document.createElement(`button`)
    continueDIV.id = `quiz-y-button-container`
    continueDIV.className = `quiz-continue-button-container`
    continueBUTTON.className = `quiz-continue-button`
    continueBUTTON.innerHTML = `Prev`
    // Moves to next question on click
    continueBUTTON.onclick = function() {
        loadNewQuestion(`previous-question-load`)
    }
    continueDIV.append(continueBUTTON)
    let parent = document.getElementById(`quiz-question-container`)
    parent.append(continueDIV)
}

// Creates continue button
const cr_ContinueButton = () => {
    let continueDIV = document.getElementById(`quiz-y-button-container`)
    let continueBUTTON = document.createElement(`button`)
    continueBUTTON.className = `quiz-continue-button`
    continueBUTTON.innerHTML = `Next`
    // Moves to next question on click
    continueBUTTON.onclick = function() {
        loadNewQuestion(`next-question-load`)
    }
    continueDIV.append(continueBUTTON)
}

// Creates continue button
const cr_AnswerButton = () => {
    let continueDIV = document.getElementById(`quiz-y-button-container`)
    let continueBUTTON = document.createElement(`button`)
    continueBUTTON.className = `quiz-continue-button`
    continueBUTTON.innerHTML = `Get Answer`
    // Moves to next question on click
    continueBUTTON.onclick = function() {
        let answer = document.getElementById(`questionTextarea`)
        answer.innerHTML = quiz.questions[currentQuestionIndex].answers[0]
    }
    continueDIV.append(continueBUTTON)
}

// Function to load next question & possible answers in object
const loadNewQuestion = async (adjustment) => {
    // Saves written answers before moving on to next question
    let type = quiz.questions[currentQuestionIndex].type
    if (type == 'long' || type == 'short') {
        SaveWrittenAnswers()
    }
    // Removes previous question & answers
    if (canLoadNewQuestion(adjustment)) {
        await QuestionContainerLoad(adjustment)
        removeAllChildren(`quiz-answer-list`)
        removeAllChildren(`quiz-question-text-container`)
        // Displays previous questions. Does nothing if no questions to load.
        if (adjustment == `previous-question-load`) {
            loadQuestion(quiz.questions[currentQuestionIndex])
            // Displays next question. Does nothing if no questions to load.
        } else if (adjustment == `next-question-load` && currentQuestionIndex <= quiz.questions.length) {
            loadQuestion(quiz.questions[currentQuestionIndex])
        }
    }
}

// Checks if we have reached the first or last question
const canLoadNewQuestion = (adjustment) => {
    // In/de-crement based on if user is loading next or previous question
    if (adjustment == `next-question-load`) {
        currentQuestionIndex++
    } else {
        currentQuestionIndex--
    }
    // Fail safe if we have reached last quesiton
    if (currentQuestionIndex > quiz.questions.length - 1) {
        currentQuestionIndex--
        return false
        // Fail safe if trying to move before first question
    } else if (currentQuestionIndex < 0) {
        currentQuestionIndex++
        return false
    }
    return true

}

// Discerns which direction the question will fly on/off the page
const QuestionContainerLoad = (adjustment) => {
    return new Promise(async (resolve, reject) => {
        if (adjustment == 'next-question-load') {
            // Moves container up off the screen
            await MoveQuestionContainer(`up`, `down`)
        } else {
            // Moves container down off the screen
            await MoveQuestionContainer(`down`, `up`)
        }
        resolve()
    })
}

// Highlights and unhighlights given answers when a keytap is pressed 
// key indicates the id of the given answer, invoking previous will prevent the function from editing the local answered questions object
const selectAnswer = (key, previous) => {
    let answer = document.getElementById(key)
    if (answer) {
        // If only one answer can be given, unselect all answers before reselecting new answer
        if (answer.classList.contains(`question-type-single`)) {
            unselectAllAnswers(document.getElementById('quiz-answer-list'))
        }
        // If answer is not yet selected, select it
        if (answer.classList.contains(`unselected-answer`)) {
            answer.classList.add(`selected-answer`)
            answer.classList.remove(`unselected-answer`)
            indicateSelectedAnswer(answer)
            if (!previous) {
                storeAnswers(true, key)
            }
            // If answer is already selected, unselect it
        } else if (answer.classList.contains(`selected-answer`)) {
            answer.classList.add(`unselected-answer`)
            answer.classList.remove(`selected-answer`)
            // Unhighlight selected answer buttons
            unselectAnswerButton(answer.children)
            if (!previous) {
                storeAnswers(false, key)
            }
        }
    }
}

// Indicate previous is true in order to skip storing answers in the local object
const storeAnswers = (add, key) => {
    // For adding user's answers to the local object
    if (add) {
        if (quiz.questions[currentQuestionIndex].type == `single`) {
            quiz.questions[currentQuestionIndex].entered.length = 0
        }
        quiz.questions[currentQuestionIndex].entered.push(key)
        // For removing user's answers from the local object
    } else {
        quiz.questions[currentQuestionIndex].entered = quiz.questions[currentQuestionIndex].entered.filter(item => item !== key)
    }
    // Ensures there are no duplicate answers in array
    quiz.questions[currentQuestionIndex].entered = uniq(quiz.questions[currentQuestionIndex].entered)
}

// Changes answer button appearance to show as selected
const indicateSelectedAnswer = (answer) => {
    let button = answer.querySelectorAll('.answer-key-numerator')
    for (let i = 0; i < button.length; i++) {
        button[i].classList.add(`selected-answer-button`)
        button[i].classList.remove(`unselected-answer-button`)
    }
}

// Unselects all answers in a question
const unselectAllAnswers = (answerList) => {
    for (let i = 0; i < answerList.childElementCount; i++) {
        let child = answerList.children[i]
        if (child.classList.contains(`selected-answer`)) {
            child.classList.add(`unselected-answer`)
            child.classList.remove(`selected-answer`)
        }
        // re/un-assigns children attribute elements, such as button coloring classes
        unselectAnswerButton(child.children)
    }
}

// Unselects individual quiz answer buttons (e.g. Press A)
const unselectAnswerButton = (child) => {
    for (let j = 0; j < child.length; j++) {
        let childButton = child[j]
        if (childButton && childButton.classList.contains(`selected-answer-button`)) {
            childButton.classList.add(`unselected-answer-button`)
            childButton.classList.remove(`selected-answer-button`)
        }
    }
}

// Change progress bar styling as quiz is completed
const updateProgessBarStatus = () => {
    // Assigning attributes
    let progress = document.getElementById('quiz-progress-bar')
    let text = document.getElementById('progress-bar-text')
    // Value of progress is set in terms of 0 to 100
    let value = Math.floor((calculateQuizProgress(quiz.questions) / quiz.questions.length) * 100)
    // Changing width and aria value 
    progress.setAttribute('aria-valuenow', value)
    progress.style.width = value + `%`
    // Updates progress bar text
    text.innerText = value + '% complete'
}

// Finds quiz progress by comparing num of questions answers to total number of questions
const calculateQuizProgress = (questions) => {
    let answers = 0
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].entered.length > 0) {
            answers++
        }
    }
    return answers
}

// Assigns function to change answer attributes with given id
const ad_QuizSelectAnswer = (answer) => {
    answer.onclick = () => {
        selectAnswer(answer.id)
    }
}

// Adds iteration capabilities to previous & next buttons 
const ad_QuestionIteration = () => {
    let prev = document.getElementById(`previous-question-load`)
    let next = document.getElementById(`next-question-load`)
    prev.onclick = () => {
        loadNewQuestion(prev.id)
    }
    next.onclick = () => {
        loadNewQuestion(next.id)
    }
}

// Listener for key presses for quiz interaction.
document.onkeydown = function(evt) {
    evt = evt || window.event;
    // console.log(evt.keyCode)
    // Registers key selectors for A to J on multiple choice questions.
    if (evt.keyCode >= 65 && evt.keyCode < 90 || evt.keyCode == 8 || evt.keyCode == 46) {
        selectAnswer(evt.keyCode.toString())
    }
    if (evt.keyCode == 38) {
        loadNewQuestion('previous-question-load')
    }
    // Moves to next question on down arrow tap or enter. Disables iteration using enter key for open ended questions
    let type = quiz.questions[currentQuestionIndex].type
    if (evt.keyCode == 40 || ((type == `single` || type == `multiple`) && evt.keyCode == 13)) {
        loadNewQuestion('next-question-load')
    }
};

init()