import assign from 'lodash/assign';
import angular from 'angular';

let $resource, $http;

const challengeMixin = {
  setFlag: (id, flag) => {
    return $http.post(`/api/challenges/${id}/flag`, { flag });
  }
};

export default class Dummy {
  constructor(_$resource, _$http) {
    $resource = _$resource;
    $http = _$http;
    const rChallenge = $resource(
      '/api/challenges/:id',
      { id: '@_id' },
      { update: { method: 'PUT'} }
    );
    return assign(rChallenge, challengeMixin);
  }
};

Dummy.$inject = ['$resource', '$http'];
