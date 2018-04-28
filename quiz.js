// TODO encapsulate library
// var Quiz = (function() {  
// })();

function Response(text, tag, classes) {
    // TODO make this abstract

    this.text = text;
    this.tag = tag;
    this.classes = classes;
}

function TextResponse(text, tag, type, classes) {
    Response.call(this, text, tag, classes);
    this.placeholder = text;
    this.type = type;
}

function ButtonResponse(text, tag, classes) {
    Response.call(this, text, tag, classes);
}

function Question(text, responses) {
    this.text = text;
    this.responses = responses;
    this.answer = {};
}

Question.prototype = {
    init: function(quiz) {
	throw new Error("You have to implement init()!");
    }, 
    getAnswer: function() {
	throw new Error("You have to implement getResponse()");
    },
};

function TextQuestion(text, responses) {
    Question.call(this, text, responses);
}

TextQuestion.prototype = {
    init: function(quiz) {
	// clear form
	$("#buttons").html("");

	$("#question").html(this.text);

	var html = "";
	for(var i = 0; i < this.responses.length; i++) {
	    html += "<input type='" + this.responses[i].type + "' id='textbox" + i + "' placeholder='" + this.responses[i].placeholder + "' class='" + this.responses[i].classes + "'></input><br>";
	}
	$("#textboxes").html(html);

	// validation
	$("input").on("input", function() {
	    var empty = false;
	    $("input").each(function() {
		if($(this).val() === "") empty = true;
	    });

	    $("#next").prop("disabled", empty);
	});
    },
    getAnswer: function() {
	// TODO implement
    }
};

function ButtonQuestion(text, responses, min_answers, need_to_confirm) {
    Question.call(this, text, responses);

    if(min_answers < 1) min_answers = 1;
    this.min_answers = min_answers;
    
    if(min_answers > 1) this.need_to_confirm = true;
    else this.need_to_confirm = need_to_confirm;
}

ButtonQuestion.prototype = {
    init: function(quiz) {
	// clear form
	$("#textboxes").html("");

	$("#question").html(this.text);

	var html = ""
	for(var i = 0; i < this.responses.length; i++) {
	    html += "<button class='input_button " + this.responses[i].classes + "'><span id=choice" + i + ">" + this.responses[i].text + "</span></button>";	    
	}
	$("#buttons").html(html);

	var question = this;
	
	if(this.need_to_confirm) {
	    $("#next").removeClass("hidden");
	    $("button").on("click", function() {
		console.log($(this).attr('id'));
		$(this).toggleClass("active");
		$("#next").prop("disabled", $(".active").length < question.min_answers);
	    });
	} else {
	    $("#next").addClass("hidden");

	    $("button").on("click", function() {
		// TODO next question
		// need to handle answers
		quiz.nextQuestion();
	    });
	}
	
    },
    getAnswer: function() {
	// TODO implement
    }
};

function Quiz() {
    this.index = 0;
    this.questions = [];
    this.submit_text = "Get in touch!";
    this.final_message = "<h2>Thanks for doing the quiz!</h2>";

     var html = "<h1>Lead Quiz</h1> \
<hr style='margin-top: 20px'> \
<p id='question'></p> \
<div id='buttons'></div> \
<form id='textboxes'></form> \
<hr style='margin-top: 50px'> \
<footer> \
<p id='progress'>Question x of y.</p> \
<button id='next'>Next</button> \
</footer>";

    $("#quiz").html(html);
}

Quiz.prototype = {
    add: function(...args) {
	for(var i = 0; i < args.length; i++) {
	    if(args[i] === null) console.log("fken null why");
	    this.questions.push(args[i]);
	}
    },
    handleResponses: function() {
	throw new Error("You have to implement a response handler for the quiz!");
    },
    start: function() {
	var instance = this;
	$("#next").on("click", function() {
	    instance.nextQuestion();   
	});
	// enter = next

	var instance = this;
	
	$(document).ready(function() {
	    $(this).keyup(function(e) {
		e.preventDefault();
		if(e.keyCode == 13) {
		    instance.nextQuestion();
		}
	    });
	});

	this.loadQuestion();
    },
    finished: function() {
	return this.index === this.questions.length;
    },
    set: function(submit_text = "Get in touch!", final_message = "<h2>Thanks for doing the quiz!</h2>") {
	this.submit_text = submit_text;
	this.final_message = final_message;
    },
    getQuestion: function() {
	return this.questions[this.index];
    },
    loadQuestion: function() {
	$("#next").prop("disabled", true);
	if(this.finished()) {
	    this.clearQuiz();
	} else {
	    if(this.index === this.questions.length - 1) {
		$("#next").html(this.submit_text);
	    }
	    var question = this.getQuestion();
	    question.init(this);
	    // TODO updateProgress();
	}
    },
    nextQuestion: function() {
	// handle responses
	this.index++;
	this.loadQuestion();
    },
    clearQuiz: function() {
	$("#quiz").html(this.final_message);
    },
}
