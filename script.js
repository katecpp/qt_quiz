var questions = [];
var totalQuestionNr = 0;
var currentQuestionNr = 0;
var correctAnswersCount = 0;

function _(x) {
    return document.getElementById(x);
}

function createStartView() {
    loadQuestions();
    content = _("content");
    content.innerHTML = "<button onclick='startQuiz10()' id='idStart' class='btn'>Start: 10 questions</button><br>";
    content.innerHTML += "<button onclick='startQuizAll()' id='idStart' class='btn'>Start: all questions</button>";
}

function loadQuestions() {
    $.getJSON('http://katecpp.github.io/qt_quiz/question.json', function (data) {
        console.log('Questions loaded successfully');
        questions = data.quiz;
    });
}

function printQuestion() {
    var crtQuestionTxt = questions[currentQuestionNr].question;
    var tempAnswerTxt = "";
    var tempChoiceValue = "";
    var i = 0;

    console.log("Question: " + currentQuestionNr + " . " + crtQuestionTxt);

    content = _("content");
    content.innerHTML = "<div id='idQuestionsDiv'></div>";

    questionsDiv = _("idQuestionsDiv");
    questionsDiv.innerHTML += "<div id='idStatusBar'></div>";
    questionsDiv.innerHTML += crtQuestionTxt + "</br>";

    for (i = 0; i < questions[currentQuestionNr].answers.length; i++)
    {   
        tempAnswerTxt = questions[currentQuestionNr].answers[i].txt;
        tempChoiceValue = questions[currentQuestionNr].answers[i].key;
        questionsDiv.innerHTML += "<input type='radio' name='choices' value='" + tempChoiceValue +"'> " + tempAnswerTxt + "<br>";
    }

    questionsDiv.innerHTML += "<button onclick='printAnswer()' id='submitButton' class='classSmallButton'>Submit</button>";

    statusBar = _("idStatusBar");
    statusBar.innerHTML = "<h3>Question " + (currentQuestionNr+1) + " of " + totalQuestionNr;
    questionsDiv.innerHTML += "<div id='hint-div'></div>";
}

function printAnswer() {
    console.log("Print answer no. " + currentQuestionNr);
    hintdiv = _("hint-div");

    var userAnswer = checkAnswer();

    if ("" !== userAnswer)
    {
        if (true === userAnswer)
        {
            console.log("PrintAnswer: correct");
            hintdiv.innerHTML = "<p id='idCorrectP'>OK</p>";
        }
        else if (false === userAnswer)
        {
            console.log("PrintAnswer: wrong");
            hintdiv.innerHTML = "<p id='idWrongP'>WRONG</p>";
        }

        $('input[name="choices"]').attr('disabled', 'disabled');
        _("submitButton").disabled = true;
        hintdiv.innerHTML += questions[currentQuestionNr].hint;
        hintdiv.innerHTML += "<br><button onclick='proceed()' class='classSmallButton'>Next</button>";
    }
}

function proceed() {
    currentQuestionNr++;

    if (currentQuestionNr >= totalQuestionNr)
    {
        printResult();
    }
    else
    {
        printQuestion();
    }
}

function printResult() {
    var percentage = Math.round((100 * correctAnswersCount)/totalQuestionNr);

    quest = _("idQuestionsDiv");
    quest.innerHTML = "<h2>You got " +correctAnswersCount+ " of " + totalQuestionNr + " questions correct </h2>";
    quest.innerHTML += "<p id='idPercentage'>" + percentage + "%</p> ";
    quest.innerHTML += '<div style="text-align:center"><button onclick="startQuizInternal()" id="idStart" class="btn" value="Start">Start again</button></div>';
    
    currentQuestionNr   = 0;
    correctAnswersCount = 0;
}

var getUserAnswer = function() {
    choices = document.getElementsByName("choices");

    for(var i=0; i<choices.length; i++)
    {
        if(choices[i].checked)
        {
            return choices[i].value;
        }
    }

    return "";
}

var checkAnswer = function() {
    choices = document.getElementsByName("choices");

    var userChoice = getUserAnswer();
    if ("" === userChoice)
    {
        alert("Choose answer!");
        return "";
    }
    else if(userChoice == questions[currentQuestionNr].correct)
    {
        console.log("Correct answer.");
        correctAnswersCount++;
        return true;
    }
    else
    {
        console.log("Wrong answer " + userChoice + " instead of " + questions[currentQuestionNr].correct);
    }

    return false;
}

function startQuiz10() {
    var maxQuestions = 10;
    totalQuestionNr = Math.min(maxQuestions, questions.length);
    startQuizInternal();
}

function startQuizAll() {
    totalQuestionNr = questions.length;
    startQuizInternal();
}

function startQuizInternal() {
    shuffle(questions);
    printQuestion();
}

function shuffle(array) {
    var counter = array.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

window.addEventListener("load", createStartView, false);
