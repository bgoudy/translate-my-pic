// Executes the Javascript once the document has fully loaded
$(document).ready(function()
{
    // Log in/authentication variables capture from user input
    var userEmail = "";
    var userPassword = "";

    // Sets the relative URL of the current window for API calls
    var relativeURL = window.location.origin;

    // Used to set the User ID cookie after log in
    function setCookie(cname, cvalue, exdays)
    {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // Submit button listener
    $("#submit-button").on("click", function(event)
    {
        // Set the userEmail variable after clicking submit
        userEmail = $("#username").val();
        console.log("Email entered by user:" + userEmail);

        // Set the userPassword variable after clicking submit
        userPassword = $("#password").val();
        console.log("Password entered by user:" + userPassword);
        
        var authString = "email=" + userEmail + "&password=" + userPassword;

        $.ajax(
        {
            method: "GET",
            url: relativeURL + "/auth",
            data: authString
        }).done(function(data)
        {
            console.log(data);

            if (data.Code == 200)
            {   
                // Sets the user_id cookie which will then be retrieved when the home.html page loads
                setCookie("user_id", data.Token, 1);

                // Redirects the user to the home.html page
                window.location.assign("/home.html");
            }
            else
            {
                // Do something here that indicates to the user he entered the wrong email/password combination
                alert("Wrong username or password!");
            }
        });
    });
});