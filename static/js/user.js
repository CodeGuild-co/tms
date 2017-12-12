var user;

$(document).ready(function() {

    function login() {
        // Collect username input
        // Collect password input
        // POST {userid: username, password: password} to /login/
        // If error, show error
        // If no error, load machines

        var userid = $("[name=Username]").val()
        var password = $("[name=Password]").val()
        console.log("var works")

        $('.action.login').addClass("loading").removeClass("error");
        var xhr = $.ajax("/login/", {
            type: 'POST',
            data: JSON.stringify({userid: userid, password: password}),
            contentType: 'application/json',
        });
        xhr.done(function() {
            $('.action.login').removeClass("loading");
            console.log(arguments);
            messages.success("nice", true)
            // Load machines
        });
        xhr.fail(function() {
            $('.action.login').addClass("error").removeClass("loading");
            console.log(arguments);
            messages.error("not nice", true)
        });
    }
        

    $('.action.login').click(login);
});
