angular.module('starter.controllers', ['ionic'])

.controller('MainMenuCtrl', function($scope,$state){
	$scope.startTest = function(){$state.go('test')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
	$scope.scheduleTest=function(){$state.go('scheduler')};
})

.controller('TestCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.finishTest = function(){$state.go('testresult')};
})

.controller('PastResultsCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.results = [{date:"9/22/16", score:"42"},{date:"9/13/16",score:"37"},{date:"8/22/16",score:"39"}];
})

.controller('TestResultCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller('InformationCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller('SchedulerCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})