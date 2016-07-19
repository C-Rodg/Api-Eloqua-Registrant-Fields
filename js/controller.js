app.controller('RegistrantFieldsCtrl', function($base64, $scope, $state, $stateParams, requestRegistrantService, registrantFieldService){
	
	//Helper function to re-render inputs
	$scope.renderInputs = function() {
		setTimeout(function(){componentHandler.upgradeDom()});
	};	

	$scope.getRegistrants = function() {
		//Error check
		if($scope.settings.url === '' || $scope.settings.formId === '' || $scope.settings.username === '' || $scope.settings.sitename === '' || $scope.settings.password === ''){
			$scope.settings.error = true;
			console.log('ERROR: MISSING FORMS');
			return false;
		}
		$scope.settings.basePassword = $base64.encode($scope.settings.sitename + "\\" +  $scope.settings.username + ":" + $scope.settings.password);
		var registrantPromise = requestRegistrantService.requestRegList($scope.settings.url, $scope.settings.formId, $scope.settings.basePassword);
		$scope.settings.error = false;
		registrantPromise.then(function(obj){
			if(obj.statusText === 'OK'){
				console.log(obj);

				//Zero registrants
				if(obj.data === ''){
					$scope.registrants.totalRegistrants = 0;
					$scope.settings.success = true;
					return false;
				}

				registrantFieldService.setTotalRegistrants(obj.data.total);
				registrantFieldService.setRegistrants(obj.data.elements);
				$state.go('registrant');

			} else {
				console.log("ERROR:");
				console.log(obj);
				$scope.settings.error = true;
			}
		},
			function(err) {
				console.log('ERROR:');
				console.log(err);
				$scope.settings.error = true;
			}
		);
	};

	
	$scope.registrants = {};
	$scope.registrants.totalRegistrants = 0;

	$scope.settings = {};
	$scope.settings.success = false;
	$scope.settings.error = false;
	
	$scope.settings.url = 'https://secure.eloqua.com/API/REST/1.0/data/form/';
	$scope.settings.formId = '';
	$scope.settings.sitename = '';
	$scope.settings.username = '';
	$scope.settings.password = '';
	$scope.settings.basePassword = '';

	//Import url paramaters if they exist
	if($stateParams.f){
		$scope.settings.formId = $stateParams.f;
	}		
	if($stateParams.s){
		$scope.settings.sitename = $stateParams.s;
	}
	if($stateParams.u){
		$scope.settings.username = $stateParams.u;
	}
	if($stateParams.p){
		$scope.settings.password = $stateParams.p;
	}

	$scope.renderInputs();

});

app.controller('RegistrantCtrl', function($scope, $state, registrantFieldService, scopeService){
	
	$scope.nextRegistrant = function() {			
		//Cycle back to the beginning
		if($scope.registrants.currentIndex === ($scope.registrants.totalRegistrants - 1)){
			$scope.registrants.currentIndex = 0;				
		} else {
			$scope.registrants.currentIndex = $scope.registrants.currentIndex + 1;
		}
		$scope.registrants.currentReg = $scope.registrants.regList[$scope.registrants.currentIndex];
		$scope.renderInputs();
	};

	//Helper function to re-render inputs
	$scope.renderInputs = function() {
		setTimeout(function(){componentHandler.upgradeDom()});
	};

	function searchValueFieldList(id, arr) {
		for(var i = 0; i < arr.length; i++){
			if (arr[i].id === id) {
				if (arr[i].hasOwnProperty('value') && arr[i].value !== ''){
					return true;
				}
			}
		}
		return false;
	}

	//Initialize
	$scope.registrants = {};
	$scope.registrants.totalRegistrants = 0;
	$scope.registrants.regList = [];
	$scope.registrants.currentReg = {};
	$scope.registrants.currentIndex = 0;	
	$scope.settings = {};
	$scope.settings.error = false;
	$scope.settings.success = false;
	$scope.registrants.fields = [];

	$scope.registrants.totalRegistrants = registrantFieldService.getTotalRegistrants() || 0;
	
	if($scope.registrants.totalRegistrants > 0){
		$scope.registrants.regList = registrantFieldService.getRegistrants();
		
		//Build fields array
		$scope.registrants.regList[0].fieldValues.forEach(function(regItem){
			$scope.registrants.fields.push({
				fieldId: regItem.id,
				hasValue: false
			});
		});	

		//add hasValue for fields that contain a value
		for(var i = 0, j = $scope.registrants.fields.length; i < j; i++){
			var fieldId = $scope.registrants.fields[i].fieldId;
			var hasValue = $scope.registrants.fields[i].hasValue;
			if(!hasValue){
				var found = false;
				for(var x = 0; x < $scope.registrants.regList.length; x++){
					found = searchValueFieldList(fieldId, $scope.registrants.regList[x].fieldValues);
					if(found){
						break;
					}
				}
				if(found){
					$scope.registrants.fields[i].hasValue = true;
				}
			}			
		}
		
		//Set the sample data
		$scope.registrants.currentReg = $scope.registrants.regList[$scope.registrants.currentIndex];
	}

	$scope.renderInputs();
});

//Api Inner Settings Element
app.directive('settings', function() {
	return {
		restrict: 'E',
		templateUrl: './js/templates/settings.html',
		link: function($scope){
			$scope.renderInputs();
		}
	}
});

//Current Registrant information
app.directive('person', function(){
	return {
		restrict: 'E',
		templateUrl: './js/templates/person.html',
		link: function($scope){
			$scope.renderInputs();
		}
	}
});;