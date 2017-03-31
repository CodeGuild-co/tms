var editor;

$(document).ready(function() {

    function load_example() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            $(".examples").addClass("loading").removeClass("error");
            var xhr = $.get("/examples/" + name + "/");
            xhr.done(function(example) {
                editor.setValue(example);
            });
            xhr.fail(function() {
                messages.error("Couldn't load that code, sorry :(");
                $(".examples").addClass("error");
            });
            xhr.always(function() {
                $(".examples").removeClass("loading");
            });
        }
    }

	function save() {
		machine.save(editor.getValue());
	}
	
    function compile() {
        machine.compile(editor.getValue());
    }

    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: "text/html",
        lineNumbers: true
    });
	
    $('.ui.dropdown.examples').dropdown({
        onChange: load_example
    });

    $('.action.compile').click(compile);

    compile();
});
