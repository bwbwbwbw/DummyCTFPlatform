import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';
import escape from 'lodash/escape';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.tableOptions = {
      rowHeight: 35,
      headerHeight: 35,
      footerHeight: false,
      reorderable: false,
      columns: [
        {
          name: 'Nickname',
          prop: 'nickname',
          width: 100,
          minWidth: 100,
          sortable: false,
          resizable: false,
          cellDataGetter: (data) => escape(data),
        },
        {
          name: 'Score',
          prop: 'score',
          width: 70,
          minWidth: 70,
          sortable: false,
          resizable: false,
        },
        ...this.data.challenges.map((cname, idx) => {
          return {
            name: `${idx}`,
            prop: `c_${idx}`,
            width: 35,
            minWidth: 35,
            sortable: false,
            resizable: false,
            className: 'col-scoreboard-challenge',
            headerClassName: 'col-scoreboard-challenge',
            headerRenderer: () => {
              return `<span title="${cname}">${idx}</span>`;
            },
            cellDataGetter: (data) => {
              if (data === true) {
                return '<span class="scoreboard-check"><i class="fa fa-check" aria-hidden="true"></i></span>';
              } else {
                return '';
              }
            },
          };
        }),
      ],
    };
  }
}

Controller.$inject = ['data'];

angular
  .module('dummyctf.dashboard')
  .controller('publicScoreboardController', Controller);
