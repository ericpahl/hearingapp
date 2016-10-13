angular.module('starter.controllers', ['ionic','chart.js','ngStorage','ngCordova','firebase','ngCordovaOauth'])

.controller('MainMenuCtrl', function($scope,$state,Auth){
	$scope.startTest = function(){$state.go('test')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
	$scope.scheduleTest=function(){$state.go('scheduler')};
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		firebase.database().ref('users/'+$scope.userID+'/testresults/0').set({
		id:0, date:"9/22/16", score:42, data:[65, 59, 80, 81, 56, 55, 40]
	  });
		firebase.database().ref('users/'+$scope.userID+'/testresults/1').set({
			id:1, date:"9/13/16",score:37,data:[65, 20, 30, 81, 40, 55, 10]
	  });
		firebase.database().ref('users/'+$scope.userID+'/testresults/2').set({
			id:2,date:"8/22/16",score:39,data:[80, 76, 80, 81, 87, 90, 88]
	  });
	});
})

.controller('TestCtrl', function($scope,$state,$localStorage,$ionicPlatform){
	$scope.returnToMain = function(){
		if($scope.media){
			$scope.media.pause(); 
		}
		$state.go('mainmenu')
	};
	$scope.playSound=function(){
		$ionicPlatform.ready(function(){
			var ref = firebase.storage().ref('Audio');
			ref.child('/FAC_1A.wav').getDownloadURL().then(function(url){
				if(ionic.Platform.isAndroid()||ionic.Platform.isIOS())
				{
					$scope.media=new Media(url);
				}
				else{
					$scope.media = new Audio(url);
				}
				$scope.media.play();
			});
	    });
	};
	
	 $scope.finishTest=function(){ 
	 	if($scope.media){
			$scope.media.pause(); 
		} 
	 	delete $localStorage.pastResult; 
	 	window.location="#/testresult/0";
	 };
})

.controller('PastResultsCtrl', function($scope,$state,$localStorage){
    $scope.lineOptions ={ elements : { line : { tension : 0 } } };
	$scope.returnToMain = function(){$state.go('mainmenu')};
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		var resultsRef = firebase.database().ref('users/'+$scope.userID+'/testresults');
		resultsRef.on('value', function(snapshot){
			$scope.results = snapshot.val();
			if($scope.results){
			$scope.series=['Series A'];
			$scope.data = [];
			$scope.data[0]=[];
			$scope.labels = [];
			var sum = 0;
			for(i=0;i<$scope.results.length;i++){
				$scope.data[0].push($scope.results[i].score);
				$scope.labels.push("");
				sum += $scope.results[i].score;
			}
			$scope.avgThreshold = Math.round(sum/$scope.results.length*100)/100;
		}
		});
	});
	$scope.$storage=$localStorage;
	$scope.goToResult=function(){$localStorage.pastResult="notnull";};
})

.controller('TestResultCtrl', function($scope,$stateParams,$localStorage,$state){
	$scope.labels=["","","","","","",""];
	$scope.series=['Series A'];
    $scope.lineOptions ={ elements : { line : { tension : 0 } }};
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.returnToPastResults=function(){$state.go('pastresults')};
	$scope.$storage=$localStorage;
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		var resultRef=firebase.database().ref('users/'+$scope.userID+'/testresults/'+$stateParams.resultID);
		resultRef.on('value',function(snapshot){
		$scope.result=snapshot.val();
		$scope.data=[$scope.result.data];
	});
	});
})

.controller('InformationCtrl', function($scope,$state,$cordovaOauth){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.logOut=function(){
		firebase.auth().signOut();
		window.location="#/login";
	};
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		var infoRef=firebase.database().ref('users/'+$scope.userID+'/information');
		infoRef.on('value',function(snapshot){
			$scope.info=snapshot.val();
			if($scope.info){
				document.getElementById("firstname").value=$scope.info.firstname;
				document.getElementById("lastname").value=$scope.info.lastname;
				document.getElementById("sex").value=$scope.info.sex;
				document.getElementById("dob").value=$scope.info.dob;
			}
		});
	});
	$scope.saveInfo = function(){
		firebase.database().ref('users/'+$scope.userID+'/information').set(
			{
				firstname: document.getElementById("firstname").value, 
				lastname: document.getElementById("lastname").value,
				sex: document.getElementById("sex").value,
				dob: document.getElementById("dob").value
			});
		$state.go('mainmenu');
	};
})

.controller('LoginCtrl',function($scope,$state,$cordovaOauth){
	$scope.login=function(){
		if(!firebase.auth().currentUser)
		{
			if(!ionic.Platform.isAndroid()&&!ionic.Platform.isIOS()){
	                	var provider = new firebase.auth.GoogleAuthProvider();
						firebase.auth().signInWithPopup(provider).then(function(){
							if(firebase.auth().currentUser){
								$state.go('mainmenu');
							}
						});
	                }
	                else{
	                    $cordovaOauth.google("180218637488-t2or73169ubmhbk0or5r027ct86c1ghr.apps.googleusercontent.com",
	                    	["email", "profile"]).then(function(result){
	                    		var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token,result.access_token);
	                    		firebase.auth().signInWithCredential(credential);
	                    		if(firebase.auth().currentUser){
	                    			$state.go('mainmenu');
	                    		}
	                    	});
	                }
		}
	};
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			$state.go('mainmenu');
		}
		});
})
.controller('SchedulerCtrl', function($scope,$state,$ionicPlatform){
	$scope.scheduleTest=function(){
		$ionicPlatform.ready(function(){
			$scope.startDate = new Date(document.getElementById("myDate").value);
			$scope.successMessage=null;
			var offset=$scope.startDate.getTimezoneOffset();
			$scope.startDate=new Date(Date.parse($scope.startDate)+offset*60000);
			var endDate = new Date(Date.parse($scope.startDate)+86400000);
			if(ionic.Platform.isIOS()||ionic.Platform.isAndroid()){
				window.plugins.calendar.createEvent("HearMe Test","HearMe App","Test your hearing in the HearMe app.",$scope.startDate,endDate,function(){
					$scope.successMessage=$scope.startDate.toLocaleDateString()+".";
					document.getElementById("myDate").value=document.getElementById("myDate").defaultValue;
					$scope.$apply();
				});
			}
		});
	};
	$scope.goToCalendar=function(){
		if(ionic.Platform.isAndroid()||ionic.Platform.isIOS()){
			$ionicPlatform.ready(function(){
				window.plugins.calendar.openCalendar();
			});
		}
	};
	$scope.returnToMain = function(){
		$scope.successMessage=null;
		$state.go('mainmenu');
	};
})


.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

