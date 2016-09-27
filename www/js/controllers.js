angular.module('starter.controllers', ['ionic'])

.controller('MainMenuCtrl', function($scope,$state){
	$scope.startTest = function(){$state.go('test')};
	$scope.pastResults = function(){$state.go('pastresults')};
	$scope.updateInformation = function(){$state.go('information')};
})

.controller('TestCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
	$scope.finishTest = function(){$state.go('testresult')};
})

.controller('PastResultsCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller('TestResultCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})

.controller('InformationCtrl', function($scope,$state){
	$scope.returnToMain = function(){$state.go('mainmenu')};
})