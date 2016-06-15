// require app styles
import './ts-modal/ts-modal.scss';

// require vendor dependencies
import angular from 'angular';

import 'velocity-animate';

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
				file: function() {
					return 'super-duper.css'
				},
				camelCase: function() {
					return {data: 'sup'}
				}
			}
		}).then(
				submit => {
					console.log('submitted', submit)
				},
				cancel => {
					console.log('cancelled', cancel)
				}
		);
	};

});

app.directive('testDir', function() {
	return {
		scope: {
			file: '=',
			camelCase: '='
		},
		controller: function($scope, tsModalService) {
			$scope.submit = () => {
				tsModalService.open({
					directive: 'areYouSure'
				}).then(
						yes => {
							tsModalService.submit({data: 'submitted'});
						}
				)
			};

			$scope.cancel = () => {
				tsModalService.cancel({data: 'cancelled'});
			};

		},
		template:
		`
			<div>
				<div class="modal__header">
					Delete File
				</div>
				<div class="modal__body">
					Are you sure you want to delete {{file}}?
				</div>
				<div class="modal__footer">
					<button ng-click="submit()">Yes</button>
					<button ng-click="cancel()">No</button>
				</div>
			</div>
		`
	}
});

app.directive('areYouSure', function() {
	return {
		scope: {
			data: '='
		},
		controller: function($scope, tsModalService) {

			$scope.submit = () => {
				tsModalService.submit({data: 'submitted'});
			};

			$scope.cancel = () => {
				tsModalService.cancel({data: 'cancelled'});
			};
		},
		template:
				`
			<div>
				<div class="modal__header">
					Are you sure?
				</div>
				<div class="modal__body">
					This confirms the thing you were just confirming. Just in case...
				</div>
				<div class="modal__footer">
					<button ng-click="submit()">For Reals</button>
					<button ng-click="cancel()">I changed my mind!!!</button>
				</div>
			</div>
		`
	}
});