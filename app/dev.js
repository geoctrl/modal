export default function(app) {
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
					},
					stuff: {data: 'hello'},
					directPromise: $q.resolve('this is the direct promise'),
					direct: 'this is the direct variable'
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
				camelCase: '=',
				stuff: '=',
				directPromise: '=',
				direct: '=',
				tsModalReady: '='
			},
			controller: function($scope, tsModalService) {

				$scope.$watch('tsModalReady', function(newVal) {
					if (newVal) {
						console.log('ready');
					} else {
						console.log('not ready');
					}
				});

				$scope.submit = () => {
					tsModalService.open({
						directive: 'areYouSure',
						size: 'small'
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
					<p>hey</p>
					<p>hey</p>
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
}