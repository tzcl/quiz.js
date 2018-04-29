$(function() {
    var quiz = new Quiz();
    
    var question1 = new ButtonQuestion("Do you have existing content for a website? (e.g., logos, images)", false, 1, [new ButtonResponse("Yes", "button yes"), new ButtonResponse("No", "button no")]);
    
    var question2 = new ButtonQuestion("What sort of features do you require on your website?", true, 0);
    question2.add(
        new ButtonResponse("Product pages", "button productpages"),
        new ButtonResponse("e-Commerce", "button ecommerce"),
        new ButtonResponse("Contact form", "button contact"),
        new ButtonResponse("Google maps", "button maps"),
        new ButtonResponse("Portfolio", "button portfolio"),
        new ButtonResponse("Testimonials", "button testimonials")
    );
    
    var question3 = new TextQuestion("How can we get in touch?");
    question3.add(new TextResponse("Name", "form-control-custom"), new TextResponse("Email", "form-control-custom", "email"));
    
    quiz.add(question1, question2, question3);
    
    quiz.handleResponses = function() {
        var name = question3.answer["Name"];
        var email = question3.answer["Email"];
        var subject = "Lead Quiz";
        
        var message = "";
        
        // question 1
        message += question1.text + "\n";
        for(var key in question1.answer) {
            message += question1.answer[key] + ", ";
        }
        
        // new line
        message += "\n";
        
        // question 2
        message += question2.text + "\n";
        for(var key in question2.answer) {
            message += question2.answer[key] + ", ";
        }
        
        emailResponses(name, email, subject, message);
        
        // Print responses to the console
        
        // question 1
        console.log("Question 1!!");
        for(var key in question1.answer) {
    	console.log(key, question1.answer[key]);
        }
        
        // question 2
        console.log("Question 2!!");
        for(var key in question2.answer) {
    	console.log(key, question2.answer[key]);
        }
        
        // question 3
        console.log("Question 3!!");
        for(var key in question3.answer) {
    	console.log(key, question3.answer[key]);
        }
    }
    
    quiz.start();
});
