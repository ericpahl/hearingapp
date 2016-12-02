angular.module('starter.controllers', ['ionic','chart.js','ngStorage','ngCordova','firebase','ngCordovaOauth'])

.controller('MainMenuCtrl', function($scope,$state,Auth,$localStorage){
	$scope.startTest = function(){$state.go('instructions')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
	$scope.scheduleTest=function(){$state.go('scheduler')};
	$localStorage.numOfTestResults=null;
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
	// 	firebase.database().ref('users/'+$scope.userID+'/testresults/0').set({
	// 	id:0, date:"9/22/16", score:42, data:[65, 59, 80, 81, 56, 55, 40]
	//   });
	// 	firebase.database().ref('users/'+$scope.userID+'/testresults/1').set({
	// 		id:1, date:"9/13/16",score:37,data:[65, 20, 30, 81, 40, 55, 10]
	//   });
	// 	firebase.database().ref('users/'+$scope.userID+'/testresults/2').set({
	// 		id:2,date:"8/22/16",score:39,data:[80, 76, 80, 81, 87, 90, 88]
	//   });
	});
})

.controller('InstructionsCtrl',function($scope,$state,$localStorage){
	$scope.startTest=function(){
		$scope.media.pause();
		$localStorage.noiseType = document.getElementById("noiseType").value;
		$state.go('test');
	};
	document.getElementById("noiseType").value="WhiteNoise";
	$scope.playSound=function(){
		console.log('Audio/'+document.getElementById("noiseType").value.toLowerCase()+".wav");
		firebase.storage().ref('Audio/'+document.getElementById("noiseType").value.toLowerCase()+".wav").getDownloadURL().then(function(url){
			if(ionic.Platform.isAndroid()||ionic.Platform.isIOS())
			{
				$scope.media=new Media(url);
			}
			else{
				$scope.media=new Audio(url);
			}
		});
		$scope.media.play();
	};
	$scope.returnToMain=function(){
		$scope.media.pause();
		$state.go('mainmenu');
	};
})

.controller('TestCtrl', function($scope,$state,$localStorage,$ionicPlatform,$cordovaFileTransfer){
	$scope.count=0;
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		var resultsRef=firebase.database().ref('users/'+$scope.userID+'/testresults');
	resultsRef.on('value', function(snapshot){
					$scope.results=snapshot.val();
					if($scope.results){
						$localStorage.numOfTestResults=Object.keys($scope.results).length;
					}
					else{
						$localStorage.numOfTestResults=0;
					}
				});
	});
	var d = new Date(Date.now());
	$scope.returnToMain = function(){
		$scope.count=0;
		$scope.numbers=null;
		if($scope.media){
			$scope.media.pause(); 
			$scope.media = null;
		}
		$scope.noise.pause();
		$state.go('mainmenu')
	};

$ionicPlatform.ready(function(){
		firebase.storage().ref('Audio/noise.wav').getDownloadURL().then(function(url){
					if(ionic.Platform.isAndroid()||ionic.Platform.isIOS()){
						$scope.noise=new Media(url);
					}
					else{
						$scope.noise=new Audio(url);
					}
			});

});
	$scope.playSound=function(){
		if(!$scope.numbers){
			$scope.number=$scope.numbers=[7,7,7];
			while($scope.numbers[0]==7||$scope.numbers[1]==7||$scope.numbers[2]==7){
				$scope.numbers[0] = Math.floor(Math.random()*9)+1;
				$scope.numbers[1] = Math.floor(Math.random()*9)+1;
				$scope.numbers[2] = Math.floor(Math.random()*9)+1;
			}
			if(!$scope.testResult){
				$scope.loudness=0;				
					$scope.testResult={id: $localStorage.numOfTestResults, date: d.toLocaleDateString(), score: 0, data:[]};
					$scope.testResult.data.length=24;
				
			}
		}
		$ionicPlatform.ready(function(){
				var ref = firebase.storage().ref('Audio/'+$localStorage.noiseType+"-Digits");
			ref.child($scope.loudness+'SNR/'+$scope.numbers[0]+$scope.numbers[1]+$scope.numbers[2]+'.wav').getDownloadURL().then(function(url){
					console.log(url);
					if(ionic.Platform.isAndroid()||ionic.Platform.isIOS())
					{
						$scope.media=new Media(url,function onSuccess(){
							$scope.media.release();
						});
						$scope.media.play();
					}
					else{
						$scope.media=new Audio(url);
						$scope.media.play();
					}
				});
		});

	};
	
	 $scope.submit=function(){ 
	 	if($scope.numbers&&document.getElementById("guess1").value&&document.getElementById("guess2").value&&document.getElementById("guess3").value){
	 		$scope.testResult.data[$scope.count]=$scope.loudness;
	 		console.log($scope.testResult.data);
	 		$scope.count++;
	 		if(document.getElementById("guess1").value==$scope.numbers[0]&&document.getElementById("guess2").value==$scope.numbers[1]&&document.getElementById("guess3").value==$scope.numbers[2]){
	 			if($scope.loudness!=-20){
	 				$scope.loudness=$scope.loudness-2;
	 			}
	 		}
	 		else{
	 			if($scope.loudness!=30){
	 				$scope.loudness=$scope.loudness+2;
	 			}
	 		}
	 		document.getElementById("guess1").value="";
	 		document.getElementById("guess2").value="";
	 		document.getElementById("guess3").value="";
	 		$scope.numbers=null;
	 	}
	 	if($scope.count==24){
	 		$scope.testResult.data.push($scope.loudness);
	 		$scope.numbers=null;
		 	if($scope.media){
				$scope.media.pause(); 
				$scope.media=null;
			} 
			$scope.noise.pause();
		 	delete $localStorage.pastResult; 
		 	$scope.count = 0;
		 	var sum = 0;
			for(i=4;i<$scope.testResult.data.length;i++){
				sum += $scope.testResult.data[i];
			}
			$scope.testResult.score = Math.round(sum/($scope.testResult.data.length-4)*100)/100;
			$scope.testResult.noiseType=$localStorage.noiseType;
			firebase.database().ref('users/'+$scope.userID+'/testresults/'+$scope.testResult.id).set($scope.testResult);
		 	$scope.id=$scope.testResult.id;
		 	$localStorage.numOfTestResults=$scope.testResult.id;
		 	$scope.testResult=null;
		 	window.location="#/testresult/"+$scope.id;
	 	}
	 };
})

.controller('PastResultsCtrl', function($scope,$state,$localStorage){
    $scope.lineOptions ={ elements : { line : { tension : 0 } } };
	$scope.returnToMain = function(){$state.go('mainmenu')};
	firebase.auth().onAuthStateChanged(function(){
		$scope.userID=firebase.auth().currentUser.uid;
		var resultsRef = firebase.database().ref('users/'+$scope.userID+'/testresults');
		resultsRef.on('value', function(snapshot){
			$scope.rawResults = snapshot.val();
			if($scope.rawResults){
				$scope.rawResults=$scope.rawResults.reverse();
				$scope.results=[];
			for(i=0;i<$scope.rawResults.length;i++)
			{
				if($scope.rawResults[i]){
					$scope.results.push($scope.rawResults[i]);
				}
			}
			$scope.series=['Series A'];
			$scope.data = [];
			$scope.data[0]=[];
			$scope.labels = [];
			var sum = 0;
			for(i=$scope.results.length-1;i>=0;i--){
				if($scope.results[i]){
					$scope.data[0].push($scope.results[i].score);
					$scope.labels.push("");
					sum += $scope.results[i].score;
					$scope.$apply();
				}
			}
			$scope.avgThreshold = Math.round(sum/($scope.results.length)*100)/100;
			$localStorage.numOfTestResults = $scope.rawResults.length;
		}
		});
	});
	$scope.$storage=$localStorage;
	$scope.goToResult=function(){$localStorage.pastResult="notnull";};
})

.controller('TestResultCtrl', function($scope,$stateParams,$localStorage,$state){
	$scope.labels=["","","","","","","","","","","","","","","","","","","","","","","",""];
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

.controller('InformationCtrl', function($scope,$state,$cordovaOauth,$localStorage){
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
				document.getElementById("occupation").value=$scope.info.occupation;
				document.getElementById("residence").value=$scope.info.residence;
				document.getElementById("ethnicity").value=$scope.info.ethnicity;
				document.getElementById("ses").value=$scope.info.ses;
				document.getElementById("hearinghistory").value=$scope.info.hearinghistory;
				document.getElementById("authistory").value=$scope.info.authistory;
				document.getElementById("hunting").value=$scope.info.hunting;
				document.getElementById("area").value=$scope.info.area;
				document.getElementById("Q1").value=$scope.info.Q1;
				document.getElementById("Q2").value=$scope.info.Q2;
				document.getElementById("Q3").value=$scope.info.Q3;
				document.getElementById("Q4").value=$scope.info.Q4;
				document.getElementById("Q5").value=$scope.info.Q5;
				document.getElementById("Q6").value=$scope.info.Q6;
				document.getElementById("Q7").value=$scope.info.Q7;
				document.getElementById("Q8").value=$scope.info.Q8;
				document.getElementById("Q9").value=$scope.info.Q9;
				document.getElementById("Q10").value=$scope.info.Q10;
				document.getElementById("Q11").value=$scope.info.Q11;
				document.getElementById("Q12").value=$scope.info.Q12;
			}
			else{
				document.getElementById("firstname").value="";
				document.getElementById("lastname").value="";
				document.getElementById("sex").value="";
				document.getElementById("dob").value="";
				document.getElementById("occupation").value="";
				document.getElementById("residence").value="";
				document.getElementById("ethnicity").value="";
				document.getElementById("ses").value="";
				document.getElementById("hearinghistory").value="";
				document.getElementById("authistory").value="";
				document.getElementById("hunting").value="";
				document.getElementById("area").value="";
				document.getElementById("Q1").value="";
				document.getElementById("Q2").value="";
				document.getElementById("Q3").value="";
				document.getElementById("Q4").value="";
				document.getElementById("Q5").value="";
				document.getElementById("Q6").value="";
				document.getElementById("Q7").value="";
				document.getElementById("Q8").value="";
				document.getElementById("Q9").value="";
				document.getElementById("Q10").value="";
				document.getElementById("Q11").value="";
				document.getElementById("Q12").value="";
				
				if($localStorage.names){
					document.getElementById("firstname").value=$localStorage.names[0];
					document.getElementById("lastname").value=$localStorage.names[$localStorage.names.length-1];
				}
			}
		});
	});
	$scope.saveInfo = function(){
		firebase.database().ref('users/'+$scope.userID+'/information').set(
			{
				firstname: document.getElementById("firstname").value, 
				lastname: document.getElementById("lastname").value,
				sex: document.getElementById("sex").value,
				dob: document.getElementById("dob").value,
				occupation: document.getElementById("occupation").value,
				residence: document.getElementById("residence").value,
				ethnicity: document.getElementById("ethnicity").value,
				ses: document.getElementById("ses").value,
				hearinghistory: document.getElementById("hearinghistory").value,
				authistory: document.getElementById("authistory").value,
				hunting: document.getElementById("hunting").value,
				area: document.getElementById("area").value,
				Q1: document.getElementById("Q1").value,
				Q2: document.getElementById("Q2").value,
				Q3: document.getElementById("Q3").value,
				Q4: document.getElementById("Q4").value,
				Q5: document.getElementById("Q5").value,
				Q6: document.getElementById("Q6").value,
				Q7: document.getElementById("Q7").value,
				Q8: document.getElementById("Q8").value,
				Q9: document.getElementById("Q9").value,
				Q10: document.getElementById("Q10").value,
				Q11: document.getElementById("Q11").value,
				Q12: document.getElementById("Q12").value
			});
		$state.go('mainmenu');
	};
})

.controller('LoginCtrl',function($scope,$state,$cordovaOauth,$localStorage){
	$scope.googleLogin=function(){

		if(!firebase.auth().currentUser)
		{
			if(!ionic.Platform.isAndroid()&&!ionic.Platform.isIOS()){
	                	var provider = new firebase.auth.GoogleAuthProvider();
						firebase.auth().signInWithPopup(provider).then(function(user){
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
	$scope.facebookLogin=function(){
		if(!firebase.auth().currentUser)
		{
			if(!ionic.Platform.isAndroid()&&!ionic.Platform.isIOS()){
	                	var provider = new firebase.auth.FacebookAuthProvider();
						firebase.auth().signInWithPopup(provider).then(function(user){
							if(firebase.auth().currentUser){
								$state.go('mainmenu');
							}
						 });
	                }
	                else{
	                    $cordovaOauth.facebook("1808012456144830",
	                    	["email"]).then(function(result){
	                    		var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
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
			$localStorage.names=user.providerData[0].displayName.split(" ");
			$state.go('mainmenu');
		}
		});
	$scope.goBack=function(){
		$scope.provider=null;
	}
})
.controller('SchedulerCtrl', function($scope,$state,$ionicPlatform,$window){
	$scope.getTestDate=function(){
		$ionicPlatform.ready(function(){
				if(ionic.Platform.isIOS()){
					var off = -1;
				}
				else{
					var off = 0;
				}
				window.plugins.calendar.findEvent('HearMe Test',null,null,new Date(Date.now()+86400000*$scope.i),new Date(Date.now()+86400000*($scope.i+off)),function(result){
					if(result[0]){
						var testDate = new Date(Date.parse(result[0].startDate)+86400000).toLocaleDateString();
						console.log(testDate);
						if(testDate != "Invalid Date"){
							$scope.testDates.tds.push(testDate);
						}
						$scope.$apply();
						console.log($scope.testDates.tds);
					}
					$scope.i++;
					if($scope.i<365){
						$scope.getTestDate();
					}
				});
		});
	};
	$scope.testDates={};
	$scope.getTestDates=function(){
		$scope.i=-1;
		$scope.testDates.tds=[];
		$scope.getTestDate();
	}
	if(ionic.Platform.isIOS()||ionic.Platform.isAndroid()){
		$scope.getTestDates();
	}
	$scope.scheduleTest=function(){
		$ionicPlatform.ready(function(){
			if(document.getElementById("myDate").value){
				$scope.startDate = new Date(document.getElementById("myDate").value);
				$scope.successMessage=null;
				var offset=$scope.startDate.getTimezoneOffset();
				if(ionic.Platform.isAndroid()){
					$scope.startDate=new Date(Date.parse($scope.startDate)+offset*60000+86400000);
					$scope.date=new Date(Date.parse($scope.startDate)-86400000);
					var endDate = new Date(Date.parse($scope.startDate));
				}
				if(ionic.Platform.isIOS()){
					$scope.startDate=new Date(Date.parse($scope.startDate)+offset*60000);
					$scope.date=new Date(Date.parse($scope.startDate));
					var endDate = new Date(Date.parse($scope.startDate)+86400000);
				}
				
				if(ionic.Platform.isIOS()||ionic.Platform.isAndroid()){
					window.plugins.calendar.createEventInteractively("HearMe Test","HearMe App","Test your hearing in the HearMe app.",$scope.startDate,endDate,function(){
						$scope.getTestDates();
						document.getElementById("myDate").value=document.getElementById("myDate").defaultValue;
						$scope.successMessage=$scope.date.toLocaleDateString()+".";
						$scope.$apply();
					});
				}
			}
		});
	};
	$scope.goToTestEvent=function(date){
		$scope.date=new Date(Date.parse(date));
		console.log($scope.date);
		$scope.goToCalendar();
		$scope.date=null;
	}
	$scope.goToCalendar=function(){
		if(ionic.Platform.isAndroid()||ionic.Platform.isIOS()){
			$ionicPlatform.ready(function(){
				if($scope.date){
					window.plugins.calendar.openCalendar($scope.date);
				}
				else{
					window.plugins.calendar.openCalendar();
				}
			});
		}
	};
	$scope.delete=function(date){
		window.plugins.calendar.deleteEvent("HearMe Test",null,null,new Date(Date.parse(date)),new Date(Date.parse(date)));
		$scope.getTestDates();
	};
	$scope.returnToMain = function(){
		$scope.successMessage=null;
		$state.go('mainmenu');
		$scope.startDate=null;
	};
})


.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

