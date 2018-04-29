# quiz.js
A Javascript quiz library.

## Setup
To use this library you need to copy quiz.js, quiz.css and email.php to your site. 
Also, you need jQuery, which can be accessed [here](https://jquery.com/download/).

## Use
To create a new quiz, you need to create a .js file and a .css file (e.g., lead_quiz.js and lead_quiz.css). Do NOT edit quiz.js or quiz.css.

The first thing to do is add the following to your .js file.
```javascript
$(function() {

});
```
Among other things, this will avoid polluting the global namespace which is important if you plan on having multiple quizzes.

Next, we want to create a new Quiz object.
```javascript
var quiz = new Quiz();
```
The Quiz constructor takes in three optional arguments:
```javascript
Quiz(title = "", submit = "Get in touch!", final_message = "<h2>Thanks for doing the quiz!</h2>")
```
1. title: the title of the quiz (rendered above the progress bar).
2. submit: the text displayed on the "next" button on the last question.
3. final_message: the message displayed after the end of the quiz. 

Note: all the arguments are HTML, so you can pass in tags, styles, etc.
* For example, `title = "<h1>Title</h1>"`

Now, we need to create some questions. There are two types of questions so far: TextQuestion and ButtonQuestion.
* TextQuestion: basically an input field (only one line)
  * text: the actual question
  * responses: [optional] you can add responses in the constructor (more on this below)
```javascript
TextQuestion(text, responses = [])
```
* ButtonQuestion: for questions with button responses
  * text: the actual question
  * need_to_confirm: [optional] whether or not you need to click next to go to the next question (i.e., for a yes/no question you would set this to false)
  * min_answers: [optional] the minimum number of answers required
  * responses: [optional] you can add responses in the constructor
```javascript
ButtonQuestion(text, need_to_confirm = true, min_answers = 1, responses = [])
```
It is really important to assign questions because the response to the question is stored in the question object.


That is, you need to do
```javascript
var question = new TextQuestion("...");
```
So you can use `question.answer` later on.


Right now, the declared questions are useless because the user won't be able to answer them. To fix this we need to add responses to the question. As mentioned before, it is possible to add them in the question constructor, but it is generally cleaner to call the add function.
* TextResponse is for use with text questions
  * text: the text to display on the button (this is used in the answer object, see below)
  * classes: [optional] any classes to add to the button
  * type: [optional] specifies the type of input the TextResponse is looking for. You only need to change this if you're asking for an email (use "email") or a phone number (use "tel")
  ```javascript
  TextResponse(text, classes = "", type="text")
  ```

* ButtonResponse is for use with button questions
  * text: the text to display on the button
  * classes: [optional] any classes to add to the button (e.g., add a specific class to a response so you can add icons)
```javascript
ButtonResponse(text, classes = "")
```

Example:
```javascript
var question2 = new ButtonQuestion("What sort of features do you require on your website?", true, 0);
    question2.add(
        new ButtonResponse("Product pages", "button productpages"),
        new ButtonResponse("e-Commerce", "button ecommerce"),
        new ButtonResponse("Contact form", "button contact"),
        new ButtonResponse("Google maps", "button maps"),
        new ButtonResponse("Portfolio", "button portfolio"),
        new ButtonResponse("Testimonials", "button testimonials")
    );
```


After you've done this for all your questions, it's time to add them to the quiz object.
```javascript
quiz.add(question_1, question_2, ..., question_n);
```

Lastly, we need to implement the handleResponses function. This means creating a new function:
```javascript
quiz.handleResponses = function() { ... }
```


To iterate through the answer of a question, use the following snippet
```javascript
for(var key in question.answer) {
  question.answer[key] // do something;
}
```
Quiz.js comes with an email helper function in case you want to email the results. You can call this in your handleResponses function; you must give it a name, email, subject and message, and can optionally give a callback function to handle the response from email.php.
```javascript
emailResponses = function(name, email, subject, message, done = function(response) { console.log(response) })
```
For this to work, you have to set your details in email.php!


Note: 
* For text questions: the answer object has a field for every response. 
  * For example: if you had a response for "name" and a response for "email", the values typed into the textboxes would be stored in question.answer["name"] and question.answer["email"].
* For button questions: the answer object only has one field, the actual question (all the values of selected buttons can be accessed in this field)


After everything is set up, remember to call `quiz.start()` to start the quiz.


An example implementation can be found at [example.js](example.js).

## Todo
Add ideas [here](https://docs.google.com/document/d/1aT0PTdVNbQvkfs5MaDSqR0SJDsnfVZJMr_zGrk_nnj4/edit?usp=sharing).
* Back button
* Animations
* Scrolling
* Modals(?)
