var editor = {
    load_file: function() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            var item = $('.ui.dropdown.examples').dropdown('get item', name);
            window.location.href = "/example/" + name + "/";
        }
    },

    compile: function() {
        machine.compile(editor.cm.getValue());
        graph.render();
    },
};

$(document).ready(function() {
    editor.cm = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: "text/html",
        lineNumbers: true
    });

    $('.ui.dropdown.examples').dropdown({
        onChange: function() {
            editor.load_file();
        }
    });

    $('.action.compile').click(editor.compile);

    editor.compile();
});
