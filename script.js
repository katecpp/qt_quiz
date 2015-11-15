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
    content.innerHTML = '<form> Questions count: <input type="number" name="quantity" min="1" max="100" value="10" id="idQuestionsNumberForm"><br> \
    <input type="submit" id="idStart" class="classButton" value="Start" onclick="startQuiz()"></form>';
}

function loadQuestions() {
    $.getJSON('http://kagura9.bitbucket.org/question.json', function (data) {
        console.log('Questions loaded successfully');
        questions = data.quiz;
    });
}

function printQuestion() {
    var question, chA, chB, chC;

    console.log("Print question nr. " + currentQuestionNr);

    content = _("content");
    content.className= 'classQuestionsDiv';
    content.innerHTML = "<div id='idQuestionsDiv'></div>";

    questionsDiv = _("idQuestionsDiv");
    question = questions[currentQuestionNr].question;
    chA = questions[currentQuestionNr].a;
    chB = questions[currentQuestionNr].b;
    chC = questions[currentQuestionNr].c;
    
    questionsDiv.innerHTML += "<div id='idStatusBar'></div>";
    questionsDiv.innerHTML += question + "</br>";
    questionsDiv.innerHTML += "<input type='radio' name='choices' value='A'> " + chA + "<br>";
    questionsDiv.innerHTML += "<input type='radio' name='choices' value='B'> " + chB + "<br>";
    questionsDiv.innerHTML += "<input type='radio' name='choices' value='C'> " + chC + "<br><br>";
    questionsDiv.innerHTML += "<button onclick='printAnswer()' id='submitButton'>Submit</button>";

    statusBar = _("idStatusBar");
    statusBar.innerHTML = "<h3>Question " + (currentQuestionNr+1) + " of " + totalQuestionNr;
    
    questionsDiv.innerHTML += "<div id='hint-div'></div>";
    
}
    
function printAnswer() {
    console.log("Print answer no. " + currentQuestionNr);
    
    hintdiv = _("hint-div");
    
    var userAnswer = checkAnswer();

    if ("NONE" === userAnswer)
    {
        return;   
    }
    
    if (true === userAnswer)
    {
        console.log("PrintAnswer: correct");
        hintdiv.innerHTML = "<p style='background-color:green'>OK</p>";
    }
    else if (false === userAnswer)
    {
        console.log("PrintAnswer: wrong");
        hintdiv.innerHTML = "<p style='background-color:red'>WRONG</p>";
    }
    
    $('input[name="choices"]').attr('disabled', 'disabled');
    _("submitButton").disabled = true;
    hintdiv.innerHTML += "<p>"+ questions[currentQuestionNr].hint +"</p>";
    hintdiv.innerHTML += "<button onclick='proceed()'>Next</button>";
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
    console.log("Test completed");

    quest.innerHTML = "<h2>You got " +correctAnswersCount+ " of " + totalQuestionNr + " questions correct </h2>";
    quest.innerHTML += "<p style='text-align:center; font-size:60px'>" + percentage + "%</font> ";
    currentQuestionNr = 0;
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
        return "NONE";
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

function startQuiz() {
    var maxQuestionsNumber = _("idQuestionsNumberForm").value;
    totalQuestionNr = Math.min(maxQuestionsNumber, questions.length);
    console.log("User choice: " + maxQuestionsNumber + " of " + questions.length + " questions");
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
