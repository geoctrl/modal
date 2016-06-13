// require app styles
import './ts-modal/ts-modal.scss';

// require vendor dependencies
import angular from 'angular';

// modal
import './ts-modal';

var app = angular.module('app', [

	// vendor dependencies
	'ts.modal'

]);


app.controller('appCtrl', function($scope, tsModalService, $q) {

	$scope.open = () => {
		tsModalService.open({
			directive: 'testDir',
			resolve: {
				func: function() {
					return {data: 'this is data'}
				},
				promise: function() {
					return $q(resolve => {
						setTimeout(function() {
							resolve({data: 'this is promise data'})
						}, 1000)
					})
				}
			}
		});
	};

	$scope.open();
});

app.directive('testDir', function() {
	return {
		controller: function(tsModalService) {
			
			

		},
		template:
		`
			<div>
				<div class="modal__header">
					This is the header
				</div>
				<div class="modal__body">
					this is the body
				</div>
				<div class="modal__footer">
					<button>Submit</button>
				</div>
			</div>
		`
	}
});