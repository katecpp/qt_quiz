var questions           = [];
var totalQuestionNr     = 0;
var currentQuestionNr   = 0;
var correctAnswersCount = 0;

function _(x) {
    return document.getElementById(x);
}

function createStartView() {
    loadQuestions();
}

function loadQuestions() {
    $.getJSON('https://katecpp.github.io/qt_quiz/question.json', function (data) {
        console.log('Questions loaded successfully');
        questions = data.quiz;
    }).error(function(){
        var content = _("content");
        content.innerHTML = "<h3>Ooops... something went wrong!</h3>"   +
                            "<p>Questions could not be loaded.<br>"     +
                            "Maybe your browser does not support jQuery 1.7.1.</p>";
    });
}

function printQuestion() {
    var statusBar       = _("status");
    var questionsDiv    = _("question");
    var hintdiv         = _("hint");
    var i = 0;

    statusBar.innerHTML = "<h3>Question " + (currentQuestionNr+1) + " of " + totalQuestionNr;
    questionsDiv.innerHTML = questions[currentQuestionNr].question + "</br>";

    for (i = 0; i < questions[currentQuestionNr].answers.length; i++)
    {   
        questionsDiv.innerHTML += "<input type='radio' name='choices' value='" + 
                                    questions[currentQuestionNr].answers[i].key + "'> " + 
                                    questions[currentQuestionNr].answers[i].txt + "<br>";
    }

    questionsDiv.innerHTML += "<button onclick='printAnswer()' id='submitButton' class='classSmallButton'>Submit</button>";
    hintdiv.innerHTML = "";
}

function printAnswer() {
    var hintdiv     = _("hint");
    var userAnswer  = checkAnswer();

    if ("" !== userAnswer)
    {
        if (true === userAnswer)
        {
            hintdiv.innerHTML = "<p id='idCorrectP'>OK</p>";
        }
        else if (false === userAnswer)
        {
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
    var result       = _("question");
    var status       = _("status");
    var hint         = _("hint");
    var percentage  = Math.round((100 * correctAnswersCount)/totalQuestionNr);

    result.innerHTML = "<h2>You got " +correctAnswersCount+ " of " + totalQuestionNr + " questions correct </h2>";
    result.innerHTML += "<p id='idPercentage'>" + percentage + "%</p> ";
    result.innerHTML += '<div style="text-align:center"><button onclick="startQuiz(totalQuestionNr)" class="btn" value="Start">Start again</button></div>';
    
    status.innerHTML    = "";
    hint.innerHTML      = "";
    
    currentQuestionNr   = 0;
    correctAnswersCount = 0;
}

var getUserAnswer = function() {
    var choices = document.getElementsByName("choices");

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
    var userChoice = getUserAnswer();
    if ("" === userChoice)
    {
        alert("Choose answer!");
        return "";
    }
    else if(userChoice === questions[currentQuestionNr].correct)
    {
        correctAnswersCount++;
        return true;
    }

    return false;
}

function startQuiz(value) {
    var maxQuestions = value > 0 ? value: questions.length;
    totalQuestionNr = Math.min(maxQuestions, questions.length);
    shuffle(questions);
    printQuestion();
    document.getElementById("content").className = "quiz";
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
