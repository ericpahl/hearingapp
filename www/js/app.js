// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'chart.js', 'ngStorage'])

.run(function($ionicPlatform) {
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
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    })

  .state('mainmenu', {
    url: '/mainmenu',
    templateUrl: 'templates/mainmenu.html',
    controller: 'MainMenuCtrl',
    })

  .state('instructions',{
    url: '/instructions',
    templateUrl: 'templates/instructions.html',
    controller: 'InstructionsCtrl'
  })

  .state('test', {
    url: '/test',
    templateUrl: 'templates/test.html',
    controller: 'TestCtrl'
  })

  .state('testresult', {
    url: '/testresult/:resultID',
    templateUrl: 'templates/testresult.html',
    controller: 'TestResultCtrl'
  })

  .state('information', {
    url: '/information',
    templateUrl: 'templates/information.html',
    controller:'InformationCtrl'
  })

  .state('pastresults', {
    url: '/pastresults',
    templateUrl: 'templates/pastresults.html',
    controller: 'PastResultsCtrl'
  })

  .state('scheduler',{
    url: '/scheduler',
    templateUrl: 'templates/scheduler.html',
    controller: 'SchedulerCtrl'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});


