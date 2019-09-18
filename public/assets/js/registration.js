// Executes the Javascript once the document has fully loaded
$(document).ready(function()
{
    // Log in/authentication variables capture from user input
    var firstName = "";
    var lastName = "";
    var userEmail = "";
    var userPassword = "";
    var hashedPassword = "";
    
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
        // Set the firstName variable after clicking submit
        firstName = $("#first-name").val();
        console.log("First name entered bu user: " + firstName);

        // Set the lastName variable after clicking submit
        lastName = $("#last-name").val();
        console.log("Last name entered bu user: " + lastName);
        
        // Set the userEmail variable after clicking submit
        userEmail = $("#email-address").val();
        console.log("Email entered by user:" + userEmail);

        // Set the userPassword variable after clicking submit
        userPassword = $("#password").val();
        console.log("Password entered by user:" + userPassword);

        $.ajax(
        {
            method: "POST",
            url: relativeURL + "/users",
            data:
            {
                "first_name": firstName,
                "last_name": lastName,
                "email": userEmail,
                "password": userPassword
            }
        }).done(function(data)
        {
            console.log(data);

            if (data.Code == 200)
            {   
                // Sets the user_id cookie which will then be retrieved when the home.html page loads
                setCookie("user_id", data.id, 1);

                // Redirects the user to the home.html page
                window.location.assign("/home.html");
            }
            else
            {
                // Do something here that indicates to the user he entered the wrong email/password combination
                alert("You are missing required fields. Please try registering again.");
            }
        });
    });
});