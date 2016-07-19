app.service('requestRegistrantService', function($http){
	
	this.requestRegList = function(url, formId, password){
		//Ensure form has fields
		if (url === '' || formId === '' || password === ''){
			return false;
		}

		if (url[url.length-1] !== '/'){
			url = url + '/';
		}

		//Build query string
		var midUrl = url.replace(/^((http|https):\/\/)?(www\.)?/, '');
		var aspAction = 'js/actions/GetRegistrants.asp?'
		aspAction += 'url=' + midUrl;
		aspAction += '&formId=' + formId;
		aspAction += '&password=' + password;

		//Return promise object
		//return $http.get(aspAction);		
		return $http({
			method: "GET",
			url: aspAction,
			data: ""
		});
	};

});

app.service('registrantFieldService', function(){
	this.totalRegistrants = 0;
	this.registrants = [];

	this.getTotalRegistrants = function(){
		return this.totalRegistrants;
	};

	this.setTotalRegistrants = function(num) {
		this.totalRegistrants = num;
	};

	this.getRegistrants = function(){
		return this.registrants;
	};

	this.setRegistrants = function(regList) {
		this.registrants = [];
		this.registrants = regList;
	};
});

app.service('scopeService', function() {
     return {
         safeApply: function ($scope, fn) {
             var phase = $scope.$root.$$phase;
             if (phase == '$apply' || phase == '$digest') {
                 if (fn && typeof fn === 'function') {
                     fn();
                 }
             } else {
                 $scope.$apply(fn);
             }
         },
     };
});