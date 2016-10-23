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
  

var fb = new Firebase("https://test1-80619.firebaseio.com");
//var fb = new Firebase("https://test1-80619.firebaseio.com/images");


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

    //alert('first');
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
        /*.state("fullscreen", {
            url: "/fullscreen",
            //templateUrl: "templates/firebase.html",
            templateUrl: "templates/fullscreen.html",
            controller: "FullImageCtrl"
            
        })*/;
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

imageApp.directive('onLongPress', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elm, $attrs) {
      $elm.bind('touchstart', function(evt) {
        // Locally scoped variable that will keep track of the long press
        $scope.longPress = true;

        // We'll set a timeout for 600 ms for a long press
        $timeout(function() {
          if ($scope.longPress) {
            // If the touchend event hasn't fired,
            // apply the function given in on the element's on-long-press attribute
            $scope.$apply(function() {
              $scope.$eval($attrs.onLongPress)
            });
          }
        }, 600);
      });

      $elm.bind('touchend', function(evt) {
        // Prevent the onLongPress event from firing
        $scope.longPress = false;
        // If there is an on-touch-end function attached to this element, apply it
        if ($attrs.onTouchEnd) {
          $scope.$apply(function() {
            $scope.$eval($attrs.onTouchEnd)
          });
        }
      });
    }
  };
});


imageApp.controller("SecureController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera, $ionicLoading, $state, $rootScope,
  $ionicModal,  $window, $cordovaGeolocation, $ionicPopup, $document, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicBackdrop) {

    $ionicHistory.clearHistory();

    $scope.images = [];

    //$ionicLoading.show({ template: "Enable your location settings, if desabled.", noBackdrop: true, duration: 10000 });

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

    // A confirm dialog
var confirmPopup;
 function showConfirm() {
    confirmPopup = $ionicPopup.confirm({
     title: 'Enabled Location?',
     template: 'Are you confirming your location is enabled?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       //alert('Location is enabled.');
     } else {
       //console.log('Location is not enabled.');
     }
   });
 };

 //showConfirm();

    $scope.theEnd = false;

    var imageReference = fb.child("images");
    // create a scrollable reference
    var scrollRef = new Firebase.util.Scroll(imageReference, 'images');

    

    var syncArray = $firebaseArray(scrollRef);
    var syncArray2 = $firebaseArray(imageReference);

    scrollRef.scroll.next(32);

    
    syncArray.$loaded().then(function(){
         //$ionicLoading.hide();
         $scope.theEnd = true;
       });

    $scope.images = syncArray;
    

    $scope.loadMore = function() {
      // load the next contact

      $scope.theEnd = false;

     
      scrollRef.scroll.next(4);

       $scope.$broadcast('scroll.infiniteScrollComplete');
      
       $scope.theEnd = true;
       

      
    };

     // create a synchronized array on scope
     //$scope.images = $firebaseArray(scrollRef);

    var location;

     //First ask user to set location
    
     /*
     $ionicLoading.show({
          template: 'Fetching location...'
       });

     $window.navigator.geolocation.getCurrentPosition(resolve, reject);

     function resolve(position) {

      alert('position: ' + position);

      var coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
     }

     $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;

      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
      var request = {
        latLng: latlng
      };
      geocoder.geocode(request, function(data, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (data[0] != null) {
           
            location = $scope.address = data[0].formatted_address;
            //alert("address is: " + $scope.address);
            promise.fulfill(location);
            $ionicLoading.hide();
          } else {
            $scope.address = "nodata";
            $ionicLoading.show({
              template: 'Waiting for location info...'
            });
            //alert("No address available");
          }
        }
      })
     
   }

     function reject(error) {

     }
     */
     
     var totalLength = 0;
     var query;
     //var syncArray = [];
    
      

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
            syncArray2.$add({/*address: $scope.address,*/ image: imageData, timestamp: Firebase.ServerValue.TIMESTAMP}).then(function() {
               //alert("Image has been uploaded");
                $scope.images = syncArray2;
                syncArray = syncArray2;
            }, function(error){/*alert(error);*/});
        }, function(error) {
            alert("Error: " + error);
            console.error(error);
        });
    }

    $scope.onImgClicked = function(data) {

      //$rootScope.$broadcast('IMAGE', data);
      //$state.go("fullscreen");
    }

    $scope.zoomMin = 1;
    $scope.showImages = function(index) {
      $scope.activeSlide = index;

      var data = "data:image/jpeg;base64,";
      var image = $scope.images[index];
      //$scope.modal.show();
      $scope.imgUrl = data + image.image;

      $scope.showModal('templates/gallery-zoomview.html');
    };
 
    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }
 
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove()
    };
 
    $scope.updateSlideStatus = function(slide) {

      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {

        var data = "data:image/jpeg;base64,";
        var image = $scope.images[slide];
        $scope.imgUrl = data + image.image;
      
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }


    };

    /*
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
    });
  
  $scope.openModal = function(index) {
    var data = "data:image/jpeg;base64,";
    var image = $scope.images[index];
    $scope.modal.show();
    $scope.imgUrl = data + image.image;
    //$ionicLoading.show({ template: location, noBackdrop: true, duration: 2000 });
  }
  */

  $scope.onHold = function() {
    //alert($scope.address);
  }

   $scope.itemOnLongPress = function(id) {
      var image = $scope.images[id];
      var location = image.address;
      //$ionicLoading.show({ template: location, noBackdrop: true, duration: 2000 });
      //alert($scope.address);
    }

    $scope.itemOnTouchEnd = function() {
      //alert('Touch end');
    }

    

});

