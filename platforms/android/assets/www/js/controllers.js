angular.module('starter.controllers', ['ionic','chart.js','ngStorage','ngCordova','firebase'])

.controller('MainMenuCtrl', function($scope,$state){
	firebase.auth().onAuthStateChanged(function(user){
		if(!user)
		{
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithRedirect(provider);
		}
	})
	$scope.startTest = function(){$state.go('test')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
	$scope.scheduleTest=function(){$state.go('scheduler')};
})

.controller('TestCtrl', function($scope,$state,$localStorage,$ionicPlatform){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.playSound=function(){
		$ionicPlatform.ready(function(){
			if(ionic.Platform.isAndroid()){
				var media = new Media('/android_asset/www/js/440Hz-5sec.mp3');
			}
			else if(ionic.Platform.isIOS()){
				var media = new Media('js/440Hz-5sec.mp3');
			}
			else{
				var media = new Audio('js/440Hz-5sec.mp3')
			}
		    media.play();
	    });
	};
	
	 $scope.finishTest=function(){ delete $localStorage.pastResult; window.location="#/testresult/0";};
})

.controller('PastResultsCtrl', function($scope,$state,$localStorage){
	$scope.labels = ["", "", "", "", "", "", ""];
    $scope.series = ['Series A'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    $scope.user=firebase.auth().currentUser;
    $scope.lineOptions ={ elements : { line : { tension : 0 } } };
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.userID=$scope.user.uid;
	var resultsRef = firebase.database().ref('users/'+$scope.userID+'/testresults');
	resultsRef.on('value', function(snapshot){
		$scope.results = snapshot.val();
	});
	firebase.database().ref('users/'+$scope.userID+'/testresults/0').set({
		id:0, date:"9/22/16", score:42, data:[65, 59, 80, 81, 56, 55, 40]
  });
	firebase.database().ref('users/'+$scope.userID+'/testresults/1').set({
		id:1, date:"9/13/16",score:37,data:[65, 20, 30, 81, 40, 55, 10]
  });
	firebase.database().ref('users/'+$scope.userID+'/testresults/2').set({
		id:2,date:"8/22/16",score:39,data:[80, 76, 80, 81, 87, 90, 88]
  });
	$scope.$storage=$localStorage;
	$scope.goToResult=function(){$localStorage.pastResult="notnull";};
})

.controller('TestResultCtrl', function($scope,$stateParams,$localStorage,$state){
	$scope.labels = ["", "", "", "", "", "", ""];
    $scope.series = ['Series A'];
    $scope.lineOptions ={ elements : { line : { tension : 0 } }};
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.returnToPastResults=function(){$state.go('pastresults')};
	$scope.$storage=$localStorage;
	$scope.user=firebase.auth().currentUser;
	var resultRef=firebase.database().ref('users/'+$scope.user.uid+'/testresults/'+$stateParams.resultID);
	resultRef.on('value',function(snapshot){
		$scope.result=snapshot.val();
	});
	$scope.data=[$scope.result.data];
})

.controller('InformationCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.logOut=function(){
		firebase.auth().signOut();
		window.location="#/mainmenu";
	};
})

.controller('SchedulerCtrl', function($scope,$state){

	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller("LoginCtrl", function($scope, $firebaseAuth, $timeout, $state,$localStorage){

  // $scope.user = {};

  // $scope.signIn = function(){
  //   console.log("$scope.user:" + JSON.stringify($scope.user));

  //   $scope.firebaseUser = null;
  //   $scope.error = null;

  //   var auth = $firebaseAuth();

  //   auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
  //     $scope.firebaseUser = firebaseUser;
  //     $localStorage.user=firebaseUser;

  //     $timeout(function(){
  //       $state.go('mainmenu');
  //     }, 2000);
  //   }).catch(function(error) {
  //     $scope.error = error;
  //   });
  // };
})

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

