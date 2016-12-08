// Grab the todo template from Handlebars.
var todoTemplate = Handlebars.templates.todo;

/*
 * This function should create an HTML string representing a new todo note
 * given the information that could be in the note.
 *
 * Note that where, when, who, and details can be an empty string.  If this
 * is the case, the corresponding portion of the todo note should not be
 * included in the HTML string.
 */
/*var fs = require('fs');
var personPageTemplate = fs.readFileSync(todoTemplate, 'utf8');
console.log(personPageTemplate);
console.log(Handlebars.compile(todoTemplate));*/



function generateTodoHTML(what, where, when, who, details) {
	var htmlstr = $('#todo-template').html();
	var temp = Handlebars.compile(htmlstr);
	var todos ={};
	todos['what']    = what;
	todos['where']   = where;
	todos['when']    = when;
	todos['details'] = details;
	todos['who']     = who;
    return temp(todos);
}
