var app = angular.module('apiRegistrantsApp', ['ui.router', 'base64', 'ngSanitize', 'growlNotifications', 'angularMoment']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$stateProvider
		.state('settings', {
			url: '/settings?f&s&u&p', 
			templateUrl: './js/templates/card.html',
			controller: 'RegistrantFieldsCtrl'
		})

		.state('registrant', {
			url: '/registrant',
			templateUrl: './js/templates/registrant-card.html',
			controller: 'RegistrantCtrl'
		});
		$urlRouterProvider.otherwise('/settings');
});