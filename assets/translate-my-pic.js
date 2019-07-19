$(document).ready(function()
{

    var keywords = [];
    var translatedKeywords = [];
    var sourceLanguage = "";
    var targetLanguage = "";

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

    function translateWords(text) {
        AnonLog();

        var translate = new AWS.Translate({region: AWS.config.region});

        var translateParams = {
            Text: text,
            SourceLanguageCode: "en",
            TargetLanguageCode: "es",
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

                // Put jQuery to update DOM here!
                //
                //
                //
                //
                //
                //
                // Put jQuery to update DOM here!
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
    document.getElementById('myDropdown').classList.toggle('show');
   }
   
   window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
   }
  });
   