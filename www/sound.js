angular.module('starter').controller('SoundController', ['$ionicPlatform', '$timeout',  '$cordovaNativeAudio', SoundController]);

function SoundController($ionicPlatform, $timeout, $cordovaNativeAudio) {  
    var vm = this;

    $ionicPlatform.ready(function() {

        // all calls to $cordovaNativeAudio return promises

        $cordovaNativeAudio.preloadSimple('snare', 'audio/snare.mp3');
        $cordovaNativeAudio.preloadSimple('hi-hat', 'audio/highhat.mp3');
        $cordovaNativeAudio.preloadSimple('bass', 'audio/bass.mp3');
        $cordovaNativeAudio.preloadSimple('bongo', 'audio/bongo.mp3');
    });

    vm.play = function(sound) {
        $cordovaNativeAudio.play(sound);
    };

    return vm;
}