/*global SignaturePad: true*/
angular.module("ngSignaturePad").directive('signaturePad', function ($window) {
	var signaturePad, canvas, scope, element, EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

	function calculateHeight($element) {
		return parseInt($element.css("height"), 10) - 70;
	}

	function calculateWidth($element) {
		return parseInt($element.css("width"), 10) - 25;
	}

	function setCanvasHeightAndWidth() {
		var height = calculateHeight(element), width = calculateWidth(element);

		scope.signatureWidth = width;
		scope.signatureHeight = height;
		canvas.attr("height", height);
		canvas.attr("width", width);
	}

	$($window).bind("resize", function () {
		$scope.$apply(function () {
			var img = signaturePad.toDataURL();
			setCanvasHeightAndWidth();
			signaturePad.fromDataURL(img);
		});
	});

	$($window).bind("orientationchange", function () {
		$scope.$apply(function () {
			var img = signaturePad.toDataURL();
			setCanvasHeightAndWidth();
			signaturePad.fromDataURL(img);
		});
	});


	return {
		restrict: 'A',
		replace: true,
		template: '<div class="signature-background">' +
					'<div class="action">' +
						'<button ng-click="accept()">OK</button>' +
						'<button " ng-click="clear()">Empty</button>' +
					'</div>' +
					'<div class="signature" ng-style="{height: signatureHeight, width: signatureWidth}" >' +
						'<canvas></canvas>' +
					'</div>' +
				'</div>',
		scope: {
			signature: "=signature",
			close: "&"
		},
		controller: function ($scope) {
			$scope.accept = function () {
				if (!signaturePad.isEmpty()) {
					$scope.signature.dataUrl = signaturePad.toDataURL();
					$scope.signature.$isEmpty = false;
				} else {
					$scope.signature.dataUrl = EMPTY_IMAGE;
					$scope.signature.$isEmpty = true;
				}
				$scope.close();
			};

			$scope.clear = function () {
				signaturePad.clear();
				setCanvasHeightAndWidth();
			};
		},
		link: function ($scope, $element) {
			canvas = $element.find("canvas");
			scope = $scope;
			element = $element;
			signaturePad = new SignaturePad(canvas.get(0));

			setCanvasHeightAndWidth();

			if ($scope.signature && !$scope.signature.$isEmpty && $scope.signature.dataUrl) {
				signaturePad.fromDataURL($scope.signature.dataUrl);
			}
		}
	};
});