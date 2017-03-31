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

    function get_id() {
        var s = window.location.search;
        if (s.indexOf("=")) {
            return s.split("=")[1];
        }
    }

	function save() {
		var code = editor.getValue(),
            id = get_id(),
            url = "/save/";
        if (id) {
            url += id + "/";
        }
        $(".save").addClass("loading").removeClass("error");
        var xhr = $.ajax(url, {
            type: 'POST',
            data: JSON.stringify({code: code}),
            contentType: 'application/json',
        });
        xhr.done(function(data) {
            alert("Bookmark this page to come back to your code later!");
            window.location.search = "id=" + data.id;
        });
        xhr.fail(function() {
            messages.error("Couldn't save your code, sorry :(");
            $(".save").addClass("error");
        });
        xhr.always(function() {
            $(".save").removeClass("loading");
        });
	}

    function load() {
        var id = get_id();
        if (id) {
            $(".save").addClass("loading").removeClass("error");
            var xhr = $.get("/load/" + id + "/");
            xhr.done(function(data) {
                editor.setValue(data.code);
            });
            xhr.fail(function() {
                messages.error("Couldn't load that code, sorry :(");
                $(".save").addClass("error");
            });
            xhr.always(function() {
                $(".save").removeClass("loading");
            });
        }
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
    $('.action.save').click(save);

    load();
});
