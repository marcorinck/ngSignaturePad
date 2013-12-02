/**
 * ngSignaturePad - v0.1.0 - 2013-12-02
 * https://github.com/marcorinck/ngSignaturePad
 * Copyright (c) 2013 ; Licensed MIT
 */
angular.module('ngSignaturePad', []);
angular.module('ngSignaturePad').directive('signaturePad', [
  '$window',
  function ($window) {
    'use strict';
    var signaturePad, canvas, scope, element, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
    function calculateHeight($element) {
      return parseInt($element.css('height'), 10) - 70;
    }
    function calculateWidth($element) {
      return parseInt($element.css('width'), 10) - 25;
    }
    function setCanvasHeightAndWidth() {
      var height = calculateHeight(element), width = calculateWidth(element);
      scope.signatureWidth = width;
      scope.signatureHeight = height;
      canvas.attr('height', height);
      canvas.attr('width', width);
    }
    $window.addEventListener('resize', function () {
      scope.$apply(function () {
        var img = signaturePad.toDataURL();
        setCanvasHeightAndWidth();
        signaturePad.fromDataURL(img);
      });
    }, false);
    $window.addEventListener('orientationchange', function () {
      scope.$apply(function () {
        var img = signaturePad.toDataURL();
        setCanvasHeightAndWidth();
        signaturePad.fromDataURL(img);
      });
    }, false);
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="signature-background">' + '<div class="action">' + '<button ng-click="accept()">OK</button>' + '<button " ng-click="clear()">Empty</button>' + '</div>' + '<div class="signature" ng-style="{height: signatureHeight, width: signatureWidth}" >' + '<canvas></canvas>' + '</div>' + '</div>',
      scope: {
        signature: '=signature',
        close: '&'
      },
      controller: [
        '$scope',
        function ($scope) {
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
        }
      ],
      link: function ($scope, $element) {
        canvas = $element.find('canvas');
        scope = $scope;
        element = $element;
        signaturePad = new SignaturePad(canvas.get(0));
        setCanvasHeightAndWidth();
        if ($scope.signature && !$scope.signature.$isEmpty && $scope.signature.dataUrl) {
          signaturePad.fromDataURL($scope.signature.dataUrl);
        }
      }
    };
  }
]);