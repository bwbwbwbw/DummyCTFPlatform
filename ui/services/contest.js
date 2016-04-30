import assign from 'lodash/assign';
import angular from 'angular';

let $resource, $http;

const contestMixin = {

};

export default class Dummy {
  constructor(_$resource, _$http) {
    $resource = _$resource;
    $http = _$http;
    const rContest = $resource(
      '/api/contests/:id',
      { id: '@_id' },
      { update: { method: 'PUT'} }
    );
    return assign(rContest, contestMixin);
  }
};

Dummy.$inject = ['$resource', '$http'];
