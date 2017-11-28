var app = angular.module('App', []);

app.controller('mainCtrl', function($scope, $http){
	$scope.result = {};
    $scope.load = false;
    $scope.search = {
        docketNumber: '',
        citationNumber: '',
        lastName: '',
        firstName: ''
    };

	$scope.searchFn = function(){
		$scope.data = [];
        $scope.load = true;

        var searchObj = {};
        if($scope.search.docketNumber !== ''){
            $scope.resultsTitle = 'Docket Number: ' + $scope.search.docketNumber;
            searchObj = {"data" : $scope.search.docketNumber, "search" : 'Docket_Number'}
        } else if($scope.search.citationNumber !== ''){
            $scope.resultsTitle = 'Citation Number: ' + $scope.search.citationNumber;
            searchObj = {"data" : $scope.search.citationNumber, "search" : 'Citation_Number'}
        } else if($scope.search.lastName !== ''){
            $scope.resultsTitle = 'Last Name: ' + $scope.search.lastName;
            searchObj = {"data" : $scope.search.lastName, "search" : 'Defendant_Last_Name'}
        } else if($scope.search.firstName !== ''){
            $scope.resultsTitle = 'First Name: ' + $scope.search.firstName;
            searchObj = {"data" : $scope.search.firstName, "search" : 'Defendant_First_Name'}
        }

		$http.post('search.php', searchObj).then(function(data){
            $scope.load = false;
            if(data.data === 'expunged') {
                $scope.data = [];
                $scope.resultsTitle = $scope.resultsTitle.split(':')[0] + ': ' + searchObj.data + ' Expunged'
            } else if (data.data === 'notfound') {
                $scope.data = [];
                $scope.resultsTitle = $scope.resultsTitle.split(':')[0] + ': ' + searchObj.data + ' Not Found in Database'
            } else {
                $scope.data = data.data[0];
            }
		}).then(function(){
			clearInputs();
		})
	};

    $scope.expunge = function(){
        $scope.load = true;
        $expInput = $('.expInput');
        var expungeObj = {"id" : $scope.search.docketNumber, 'name' : $expInput.val()};
        $expInput.val('').closest('.items').find('.label').animate({'top': 27, 'color': '#808080', 'font-size': 16}, 200);
        $('#screenCover, #expungeConfirm, #expungeConfirmButton').fadeOut();

        $http.post('expunge.php', expungeObj).then(function(data){
            $scope.load = false;
            if(data.data === 'expunged') {
                $scope.data = [];
                $scope.resultsTitle = 'Docket Number: ' + expungeObj.id + ' Already Expunged'
            } else if (data.data === 'notfound') {
                $scope.data = [];
                $scope.resultsTitle = 'Docket Number: ' + expungeObj.id + ' Not Found in Database'
            } else {
                $scope.resultsTitle = 'Docket Number: ' + expungeObj.id + ' ' + data.data.replace(/"/g, '')
            }
            $scope.data = [];
        }).then(function(){
            clearInputs();
        })
    };
	
	function clearInputs(){
		for(var i in $scope.search){
			if($scope.search.hasOwnProperty(i)){
                $scope.search[i] = '';
            }
		}
        $('.inputs').prop('disabled', false);
        $('#searchButton, #expungeSection').fadeOut();
        $('.items:nth-child(1) input:first').focus();
	}
	
});