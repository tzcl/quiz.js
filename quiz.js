// TODO encapsulate library
// var Quiz = (function() {  
// })();

function Response(text, classes) {
    // TODO make this abstract

    this.text = text;
    this.classes = classes;
}

function TextResponse(text, classes = "", type = "text") {
    Response.call(this, text, classes);
    this.placeholder = text;
    this.type = type;
}

function ButtonResponse(text, classes = "") {
    Response.call(this, text, classes);
}

function Question(text, responses) {
    this.text = text;
    this.responses = responses;

    this.answer = {};
    this.keys = 0;
}

Question.prototype = {
    init: function(quiz) {
	throw new Error("You have to implement init()!");
    },
    writeAnswer: function() {
	throw new Error("You have to implement getResponse()");
    },
};

function TextQuestion(text, responses = []) {
    Question.call(this, text, responses);
}

TextQuestion.prototype = {
    init: function(quiz) {
	// clear form
	$("#quiz #buttons").html("");

	$("#quiz #question").html(this.text);

	var html = "";
	for(var i = 0; i < this.responses.length; i++) {
	    html += "<input type='" + this.responses[i].type + "' id='textbox" + i + "' placeholder='" + this.responses[i].placeholder + "' class='" + this.responses[i].classes + "'></input><br>";
	}
	$("#quiz #textboxes").html(html);

	// validation
	$("#quiz input").on("input", function() {
	    var empty = false;
	    $("#quiz input").each(function() {
		if($(this).val() === "") empty = true;
	    });

	    $("#quiz #next").prop("disabled", empty);
	});
    },
    add: function(...args) {
	for(var i = 0; i < args.length; i++) {
	    this.responses.push(args[i]);
	}
    },
    writeAnswer: function() {
	for(var i = 0; i < this.responses.length; i++) {
	    this.answer[this.responses[i].text] = $("#quiz #textbox" + i).val();
	    this.keys++;
	}
    }
};

function ButtonQuestion(text, need_to_confirm = true, min_answers = 1, responses = []) {
    Question.call(this, text, responses);

    if(min_answers !== 1) need_to_confirm = true;
    
    this.min_answers = min_answers;
    this.need_to_confirm = need_to_confirm;
}

ButtonQuestion.prototype = {
    init: function(quiz) {
	// clear form
	$("#quiz #textboxes").html("");

	$("#quiz #question").html(this.text);

	var html = ""
	for(var i = 0; i < this.responses.length; i++) {
	    html += "<button class='" + this.responses[i].classes + "'><span id=choice" + i + ">" + this.responses[i].text + "</span></button>";	    
	}
	$("#quiz #buttons").html(html);

	var question = this;
	
	if(this.need_to_confirm) {
	    $("#quiz #next").removeClass("hidden");
	    $("#quiz #next").prop("disabled", $("#quiz .active").length < question.min_answers);
	    
	    $("#quiz button").not("#next").on("click touch", function() {
		$(this).toggleClass("active");
		$("#quiz #next").prop("disabled", $("#quiz .active").length < question.min_answers);
	    });
	} else {
	    $("#quiz #next").addClass("hidden");

	    var instance = this;
	    
	    $("#quiz button").not("#next").on("click touch", function() {
		var id = $(this).children(0).attr("id")["choice".length];
		instance.answer[instance.text] = instance.responses[id].text;
		instance.keys = 1;
		
		quiz.nextQuestion();
	    });
	}
	
    },
    add: function(...args) {
	for(var i = 0; i < args.length; i++) {
	    this.responses.push(args[i]);
	}
    },
    writeAnswer: function() {
	var first = true;
	var instance = this;
	$("#quiz .active").each(function() {
	    var id = $(this).children(0).attr("id")["choice".length];
	    if(first) {
		instance.answer[instance.text] = instance.responses[id].text;
		first = false;
	    } else {
		instance.answer[instance.text] += ", " + instance.responses[id].text;
	    }
	});
	this.keys = 1;
    }
};

function Quiz(title = "", submit_text = "Get in touch!", final_message = "<h2>Thanks for doing the quiz!</h2>") {
    this.index = 0;
    this.questions = [];
    this.title = title;
    this.submit_text = submit_text;
    this.final_message = final_message;

     var html = "<div id='title'>" + title + "</div> \
<hr style='margin-top: 20px'> \
<div id='progress'></div> \
<center><div id='to_clear'><p id='question'></p> \
<div id='buttons'></div> \
<form id='textboxes'></form></div></center> \
<hr style='margin-top: 50px'> \
<footer id='quiz_footer'> \
<button id='next' class='button'>Next</button> \
</footer>";

    $("#quiz").html(html);
}

Quiz.prototype = {
    add: function(...args) {
	for(var i = 0; i < args.length; i++) {
	    this.questions.push(args[i]);
	}
    },
    handleResponses: function() {
	throw new Error("You have to implement a response handler for the quiz!");
    },
    start: function() {
	var html = "<span class='step'></span>";
	for(var i = 0; i < this.questions.length; i++) {
	    $("#quiz #progress").html($("#quiz #progress").html() + html);
	}
	
	var instance = this;
	$("#quiz #next").on("click touch", function() {
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
    getQuestion: function() {
	return this.questions[this.index];
    },
    loadQuestion: function() {
	$("#quiz #next").prop("disabled", true);
	if(this.finished()) {
	    this.handleResponses();
	    this.clearQuiz();
	} else {
	    if(this.index === this.questions.length - 1) {
		$("#quiz #next").html(this.submit_text);
	    }
	    var question = this.getQuestion();
	    question.init(this);
	    this.updateProgress();
	}
    },
    nextQuestion: function() {
	var question = this.getQuestion();
	question.writeAnswer();
	$("#quiz .step:eq(" + this.index + ")").addClass("finished");
	
	this.index++;
	this.loadQuestion();
    },
    updateProgress: function() {
	$("#quiz .step").removeClass("current");
	$("#quiz .step:eq(" + this.index  + ")").addClass("current");
    },
    clearQuiz: function() {
	$("#quiz .step").removeClass("current");
	var html = "<p>" + this.final_message + "</p>";
	$("#quiz #to_clear").html(html);
	$("#quiz #quiz_footer").html("");
    },
}

var emailResponses = function(_name, _email, _subject, _message, done = function(response) { console.log(response) }, fail = function(data) {}) {
    $(function() {
	var _data = {
	    name: _name,
	    email: _email,
	    subject: _subject,
	    message: _message,
	};

	$.ajax({
	    type: 'POST',
	    url: 'email.php',
	    data: _data,
	})
	    .done(function(response) {
		// success
		done(response);
	    })
	    .fail(function(data) {
		// error!
		if(data.responseText !== '') {
		    console.log(data.responseText);
		} else {
		    console.log("Oops! An error occurred and your message could not be sent.");
		}
		fail(data);
	    });
    });
}
