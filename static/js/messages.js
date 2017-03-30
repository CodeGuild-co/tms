var messages = {
    message: function(state, header, body) {
        var m = $("<div></div>", {"class": "ui errorbox"}),
            i = $("<i></i>", {"class": "close icon"}),
            h = $("<div></div>", {"class": "header"}),
            b = $("<p></p>");

        b.text(body);
        h.text(header);

        m.addClass(state);
        m.append(i);
        m.append(h);
        m.append(b);

        i.click(function() {
            m.transition('fade');
        });

        $("#errorbox").append(m);
    },

    info: function(msg) {
        messages.message("", "", msg);
        machine.pause = true;
    },

    error: function(msg) {
        messages.message("negative", "Something went wrong!", msg);
        machine.pause = true;
        popUpBox();
    },

    success: function(msg) {
        messages.message("positive", "Yay!", msg);
    }
};

function popUpBox(){
    var popup = document.getElementById("errorbox");
    popup.style.display = "block";
    popup.scrollTop = popup.scrollHeight;
}