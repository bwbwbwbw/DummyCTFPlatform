import angular from 'angular';

export default function toastr (toastrConfig) {
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right',
  });
}

toastr.$inject = ['toastrConfig'];
