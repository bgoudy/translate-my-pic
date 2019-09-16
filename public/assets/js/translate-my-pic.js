$(document).ready(function()
{
  // Global variables
  var relativeURL = window.location.origin;
  var keywords = [];
  var translatedKeywords = [];
  var sourceLanguage = "";
  var targetLanguage = "";

  var languages = [
    {
      language: "English",
      languageCode: "en"
    },
    {
      language: "Spanish",
      languageCode: "es"
    },
    {
      language: "French",
      languageCode: "fr"
    },
    {
      language: "Italian",
      languageCode: "it"
    },
    {
      language: "German",
      languageCode: "de"
    },
    {
      language: "Portuguese",
      languageCode: "pt"
    }
  ];

  // This function is used to retrieve the value in the user_id cookie set during log in
  function getCookie(cookieName)
  {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie); // Retrieves cookie string from browser cookies by decoding it
    var ca = decodedCookie.split(';'); // Creates an array of all name/value pairs in the cookie string
    
    // For loop which iterates through the cookies array to find the desired cookie value
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // This function retrieves all of the previous translations for a logged in user
  function getTranslationHistory(user)
  { 
    $.ajax(
      {
        method: "GET",
        url: relativeURL + "/translations",
        data:
        {
          "user_id": user
        }
      }).done(function(data)
      {
        console.log(data);

        for(i = 0; i < data.length; i++)
        {
          console.log("Translation ID: " + data[i].id);
          console.log("Translated Language: " + data[i].translated_language);
          console.log("Analyzed Keywords: " + data[i].analyzed_keywords);
          console.log("Translated Keywords: " + data[i].translated_keywords + "\n");

          var transLangDiv = $("<div>");
          var analyzedKeywordsDiv = $("<div>");
          var transKeywordsDiv = $("<div>");
          var deleteButtonDiv = $("<div>");
          var deleteButton = $("<button>");

          deleteButton.attr(
          {
            "type": "submit",
            "class": "btn btn-primary",
            "value": "Delete"
          });
          
          deleteButton.text("Delete");
          deleteButtonDiv.append(deleteButton);

          transLangDiv.text(data[i].translated_language);
          analyzedKeywordsDiv.text(data[i].analyzed_keywords);
          transKeywordsDiv.text(data[i].translated_keywords);

          $("#t-language").append(transLangDiv);
          $("#a-keywords").append(analyzedKeywordsDiv);
          $("#t-keywords").append(transKeywordsDiv);
          $("#delete-button").append(deleteButtonDiv);

        }

      });
  }

    // Function to detect labels or keywords in uploaded image (AWS Rekognition API)
    function DetectLabels(imageData) {

        // Sets the AWS for authentication
        AWS.region = "us-east-2";

        // Creates the AWS Rekognition object which will be used to analyze the image
        var rekognition = new AWS.Rekognition();

        // Creates the parameters for invoking the Rekognition API and sets them to a variable in the form of an object
        var rekognitionParams = 
        {
          Image: {
            // This is the image after it has been transformed into bytes which can be analyzed by AWS Rekognition
            Bytes: imageData
          },
          MaxLabels: 5,
        };

        // Thie invokes the AWS Rekognition detectLabels Action using the rekognition object we created above
        rekognition.detectLabels(rekognitionParams, function (err, data) {
            // Conditional which checks to see if an error is returned; if an error is returned, the error is logged in the console
            if (err) console.log(err, err.stack); // an error occurred
          
            else
            {
            
                keywords = [];

                 // For loop that iterates for each label/keyword that is returned in the AWS Rekognition API response
                for (var i = 0; i < data.Labels.length; i++)
                {
                    
                    var text = data.Labels[i].Name;

                    keywords.push(text);

                }

                translateWords(keywords.toString());
            }
        });
    }

    //TESTING OUT ADDING IN OTHER LANGUAGES
    function translateWords(text) {
        AnonLog();

        var translate = new AWS.Translate({region: AWS.config.region});
        var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
        var targetDropDownText = targetDropdown.options[targetDropdown.selectedIndex].text;
        
        console.log("Dropdown Picker: " + targetDropdown);
        var targetLanguageCode = "";

        for (i = 0; i < languages.length; i++)
        { 
          if (languages[i].language == targetDropDownText)
          {
            targetLanguageCode = languages[i].languageCode;
            console.log("Target Language Code: " + targetLanguageCode);
          }      
        }

        var translateParams = {
            Text: text,
            SourceLanguageCode: "en",
            TargetLanguageCode: targetLanguageCode
        };

        translate.translateText(translateParams, function(err, data) {
            if (err) {
                console.log(err, err.stack);

            }
            if (data) {
                translatedKeywords = data.TranslatedText.split(", ");
                
                console.log("Source Language Code: " + data.SourceLanguageCode);
                console.log("Target Language Code: " + data.TargetLanguageCode);
                console.log("Keywords Array: " + keywords);
                console.log(keywords);
                console.log("Translated Keywords Array: " + translatedKeywords);
                console.log(translatedKeywords);

                // Creates jQuery DOM elements for Keywords and Translations
                var keywordsDiv = $("<div>");
                var translationDiv = $("<div>");
                var keywordsP = $("<p>");
                var translationP = $("<p>");

                // Resets the Keywords container in DOM and then retrieves the keywords returned from AWS Rekognition
                $("#keywords").empty();
                for (i = 0; i < keywords.length; i++)
                {
                  $(keywordsP).append(keywords[i]);
                  $(keywordsDiv).append(keywordsP);
                  keywordsP = $("<p>");
                }

                // Resets the Translations container in DOM and then retrieves the translated keywords returned from AWS Translate
                $("#translation").empty();
                for (i = 0; i < translatedKeywords.length; i++)
                {
                  $(translationP).append(translatedKeywords[i]);
                  $(translationDiv).append(translationP);
                  translationP = $("<p>");
                }

                // Updates the DOM with new containers for Keywords and Translations
                $("#keywords").html(keywordsDiv);
                $("#translation").html(translationDiv);

            }
            });
    }

      // Function to convert image to a file/bytes that can be processed by AWS Rekognition API
      function ProcessImage() {
        // Invokes function to authenticate securely to AWS so that the AWS APIs can be invoked
        AnonLog();
    
        // Creating an object to store the HTML element which the image resides
        var control = document.getElementById("fileToUpload");
        console.log(control);
        
        // Creating an object to store the actual image
        var file = control.files[0];
        console.log(file);
    
        // Load base64 encoded image 
        // FileRead is a vanilla JavaScript method to read/manage files include images
        var reader = new FileReader();

        // Reads the file when it is loaded/selected by the user in the DOM
        reader.onload = (function (theFile) {
          return function (e) {
            var img = document.createElement('img');
            var image = null;
            // Points the FileReader function to the image where is stored
            img.src = e.target.result;
            var jpg = true;
            
            //Loads the image if image base64 encoded
            try {
              image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
            
            // Catching an error if the image is a not a JPG file and setting a jpg variavle to be read later
            } catch (e) {
              jpg = false;
            }

            // Tries to read image again and then returns an error indicating that the image is not in the correct format
            if (jpg == false) {
              try {
                image = atob(e.target.result.split("data:image/png;base64,")[1]);
              } catch (e) {
                console.log("Not an image file Rekognition can process");
                return;
              }
            }

            // Unencode image bytes for AWS Rekognition DetectLabels API 
            var length = image.length;

            // Vanilla JavaScript method for storing files and other type arrays
            imageBytes = new ArrayBuffer(length);

            // Turns it into an array of integer values
            var ua = new Uint8Array(imageBytes);
            for (var i = 0; i < length; i++) {
              ua[i] = image.charCodeAt(i);
            }
    
            //Call Rekognition  
            DetectLabels(imageBytes);
          };
        })(file);
        reader.readAsDataURL(file);
      }

      function AnonLog() {
        // Configure the credentials provider to use your identity pool
        AWS.config.region = 'us-east-2'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-2:7359eb59-58a3-4653-98f7-8e4d06680409',
        });
        // Make the call to obtain credentials
        AWS.config.credentials.get(function () {
          // Credentials will be available when this function is called.
          var accessKeyId = AWS.config.credentials.accessKeyId;
          var secretAccessKey = AWS.config.credentials.secretAccessKey;
          var sessionToken = AWS.config.credentials.sessionToken;
        });
    }

    $(document).on('change','#fileToUpload' , function()
    { 
        ProcessImage();
    });

//js for dropdown function.... building from scratch, not using bootstrap
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
   }
   
   window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
   }

   //testing image upload
   function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageUploaded').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }

    else {
      $('#imageUploaded').on('error', function () {
        $(this).remove();
    })
    }
    };

      $("#fileToUpload").change(function(){
    readURL(this);
      });


      var lang = document.getElementById("lang");
      var langPopUp = document.getElementById("pop-up");
      //langPopUp.hide();

      $(lang).mouseover(function(){
      $(langPopUp).show();
        var popper = new Popper(lang, langPopUp, {
          placement: "bottom"
        })
      });
      var imgCard = document.getElementById("img-selector");
      var imgPopUp = document.getElementById("img-popup");
  

      $(imgCard).mouseover(function(){
      $(imgPopUp).show();
        var popper = new Popper(imgCard, imgPopUp, {
          placement: "bottom"            
          
        });
      });
 
    getTranslationHistory(getCookie("user_id"));
  });
   
