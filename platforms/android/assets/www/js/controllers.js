angular.module('starter.controllers', ['ionic','chart.js','ngStorage','ngCordova'])

.controller('MainMenuCtrl', function($scope,$state){
	$scope.startTest = function(){$state.go('test')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
	$scope.scheduleTest=function(){$state.go('scheduler')};
})

.controller('TestCtrl', function($scope,$state,$localStorage,$ionicPlatform){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.playSound=function(){
		$ionicPlatform.ready(function(){
			var media = new Media('/android_asset/www/js/440Hz-5sec.mp3');
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
    $scope.lineOptions ={ elements : { line : { tension : 0 } } };
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$localStorage.results = [{id:0, date:"9/22/16", score:"42", data:[65, 59, 80, 81, 56, 55, 40]},
	{id:1, date:"9/13/16",score:"37",data:[65, 20, 30, 81, 40, 55, 10]},
	{id:2,date:"8/22/16",score:"39",data:[80, 76, 80, 81, 87, 90, 88]}];
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
	$scope.result=$localStorage.results[$stateParams.resultID];
	$scope.data=[$scope.result.data];
})

.controller('InformationCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller('SchedulerCtrl', function($scope,$state){

	$scope.returnToMain = function(){$state.go('mainmenu')};
})

