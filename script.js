var questions           = [];
var totalQuestionNr     = 0;
var currentQuestionNr   = 0;
var correctAnswersCount = 0;

function _(x) {
    return document.getElementById(x);
}

function loadQuestionsAndStartQuiz(value) {
    $.getJSON('https://katecpp.github.io/qt_quiz/question.json', function (data) {
        questions = data.quiz;
    })
        .error(function(){
        _("content").innerHTML = "<h3>Ooops... something went wrong!</h3>"   +
                            "<p>Questions could not be loaded.<br>"     +
                            "Maybe your browser does not support jQuery 1.7.1.</p>";})
        .done(function() {
            startQuizInternal(value);
    });
}

function printQuestion() {
    var questionsDiv    = _("question");
    var i = 0;

    _("status").innerHTML = "<h3>Question " + (currentQuestionNr+1) + " of " + totalQuestionNr + "</h3>";
    questionsDiv.innerHTML = questions[currentQuestionNr].question + "</br>";

    for (i = 0; i < questions[currentQuestionNr].answers.length; i++)
    {   
        questionsDiv.innerHTML += "<input type='radio' name='choices' value='" + 
                                    questions[currentQuestionNr].answers[i].key + "'> " + 
                                    questions[currentQuestionNr].answers[i].txt + "<br>";
    }

    questionsDiv.innerHTML += "<button onclick='printAnswer()' id='submitButton' class='smallBtn'>Submit</button>";
    _("hint").innerHTML = "";
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

    return undefined;
}

var checkAnswer = function() {
    var userChoice = getUserAnswer();
    if (undefined === userChoice)
    {
        alert("Choose answer!");
        return undefined;
    }
    else if(userChoice === questions[currentQuestionNr].correct)
    {
        correctAnswersCount++;
        return true;
    }

    return false;
}

function printAnswer() {
    var userAnswer  = checkAnswer();

    if (undefined !== userAnswer)
    {
        var hintDiv = _("hint");

        if (true === userAnswer)
        {
            hintDiv.innerHTML = "<p id='correct'>OK</p>";
        }
        else if (false === userAnswer)
        {
            hintDiv.innerHTML = "<p id='wrong'>WRONG</p>";
        }

        $('input[name="choices"]').attr('disabled', 'disabled');
        _("submitButton").disabled = true;
        hintDiv.innerHTML += questions[currentQuestionNr].hint;
        hintDiv.innerHTML += "<br><button onclick='proceed()' class='smallBtn'>Next</button>";
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
    var percentage   = Math.round((100 * correctAnswersCount)/totalQuestionNr);

    result.innerHTML = "<h2>You got " + correctAnswersCount + " of " + totalQuestionNr + " questions correct </h2>";
    result.innerHTML += "<p id='percentage'>" + percentage + "%</p> ";
    result.innerHTML += '<div style="text-align:center"><button onclick="startQuiz(totalQuestionNr)" class="btn" value="Start">Start again</button></div>';
    
    _("status").innerHTML    = "";
    _("hint").innerHTML      = "";
    
    currentQuestionNr   = 0;
    correctAnswersCount = 0;
}

function startQuizInternal(value) {
    console.log("Questions.length: " + questions.length);
    var maxQuestions = value > 0 ? value : questions.length;
    totalQuestionNr = Math.min(maxQuestions, questions.length);
    shuffle(questions);
    printQuestion();
    _("content").className = "quiz";
}

function startQuiz(value) {
    if (questions.length === 0)
    {
        loadQuestionsAndStartQuiz(value);
    }
    else
    {
        startQuizInternal(value);
    }
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
