// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//var fb = new Firebase("https://test1-80619.firebaseio.com/");
//var provider = new firebase.auth.GoogleAuthProvider();
var config = {
    apiKey: "AIzaSyAeJnL3QweehvUFTTH00oZ8m__RyJkpG3A",
    authDomain: "test1-80619.firebaseapp.com",
    databaseURL: "https://test1-80619.firebaseio.com"
    //storageBucket: "<BUCKET>.appspot.com",
  };
  

var fb = new Firebase("https://test1-80619.firebaseio.com/");


var imageApp = angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'ionicLazyLoad']);


var loggedinUser = undefined;


imageApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

/***** Commenting out this one and writing a new functionalities below to remove authentication
imageApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("firebase", {
            url: "/firebase",
            //templateUrl: "templates/firebase.html",
            templateUrl: "templates/googlelogin.html",
            controller: "FirebaseController",
            controller: "GoogleCtrl",
            cache: false
        })
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html",
            controller: "SecureController"
        });
    $urlRouterProvider.otherwise('/firebase');
});
*/

imageApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html",
            controller: "SecureController"
        })
        .state("fullscreen", {
            url: "/fullscreen",
            //templateUrl: "templates/firebase.html",
            templateUrl: "templates/fullscreen.html",
            controller: "FullImageCtrl"
            
        });
    $urlRouterProvider.otherwise('/secure');
});




imageApp.controller("GoogleCtrl", function($scope, $state) {
  $scope.login = function() {
    
      /*var ref = new Firebase("https://test1-80619.firebaseio.com/");
      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });*/

    firebase.auth().signInWithRedirect(provider);
    

    firebase.auth().getRedirectResult().then(function(result) {
    // The firebase.User instance:
    var user = result.user;
    // The Facebook firebase.auth.AuthCredential containing the Facebook
    // access token:
    var credential = result.credential;
    $state.go("secure");
}, function(error) {
  // The provider's account email, can be used in case of
  // auth/account-exists-with-different-credential to fetch the providers
  // linked to the email:
  var email = error.email;
  // The provider's credential:
  var credential = error.credential;
  // In case of auth/account-exists-with-different-credential error,
  // you can fetch the providers using this:
  if (error.code === 'auth/account-exists-with-different-credential') {
    auth.fetchProvidersForEmail(email).then(function(providers) {
      // The returned 'providers' is a list of the available providers
      // linked to the email address. Please refer to the guide for a more
      // complete explanation on how to recover from this error.
    });
  }
});

    /*
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    loggedinUser = user.uid;
    
    $state.go("secure");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    */
    }
});

imageApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {

    var fbAuth = $firebaseAuth(fb);


    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

     

    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

});

imageApp.controller("SecureController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera, $ionicLoading, $state, $rootScope) {

    $ionicHistory.clearHistory();

    $scope.images = [];

    
    /*
    if(fbAuth) {
        //var userReference = fb.child("users/" + fbAuth.uid);
        var rootRef = firebase.database().ref();
        //alert('rootRef:' + rootRef);
        //var userReference = firebase.child("users/" + fbAuth.uid);

        var userId = loggedinUser;
        
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
           username = snapshot.val().username;
        // ...
      });
        alert('loggedinUser*****' + loggedinUser);

        //var userReference = rootRef.push("users/").set(loggedinUser); 
        //var syncArray = $firebaseArray(userReference.child("images"));
        var syncArray = $firebaseArray(loggedinUser.$ref("images"));
        $scope.images = syncArray;

    } else {
        $state.go("firebase");
    }
    */


    var imageReference = fb.child("images/");
    // create a scrollable reference
    //var scrollRef = new Firebase.util.Scroll(fb, 'images');

     // create a synchronized array on scope
     //$scope.images = $firebaseArray(scrollRef);

     

     var query = imageReference.orderByChild("timestamp").limitToLast(1);
     $scope.images = $firebaseArray(query);

     var syncArray = $firebaseArray(imageReference);
     $scope.images = syncArray;

     $ionicLoading.show({
        template: 'Loading....'
     });

     syncArray.$loaded().then(function(){
        $ionicLoading.hide();
      })
    

    $scope.upload = function() {
     // alert("Going to capture image.");

        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData, timestamp: Firebase.ServerValue.TIMESTAMP}).then(function() {
               // alert("Image has been uploaded");
                $scope.images = syncArray;
            });
        }, function(error) {
            alert("Error: " + error);
            console.error(error);
        });
    }

    $scope.onImgClicked = function(data) {

      //$rootScope.$broadcast('IMAGE', data);
      //$state.go("fullscreen");
    }
    

});

imageApp.controller("FullImageCtrl", function($scope, $ionicHistory, $state) {

    $ionicHistory.clearHistory();


    $scope.$on('IMAGE', function(data) {
      //$scope.imageData = "data:image/jpeg;base64," + data;

    });

    /*$scope.fullscreen = function(data) {
      
      
      state.go("fullscreen");
      
    }*/
  });
