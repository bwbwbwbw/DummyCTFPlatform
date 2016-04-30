export default function textAngular ($provide) {
  $provide.decorator('taOptions', ['$delegate', function(taOptions){
    taOptions.forceTextAngularSanitize = false;
    taOptions.toolbar = [
        ['p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'ul', 'ol'],
        ['html', 'insertLink']
    ];
    return taOptions;
  }]);
};

textAngular.$inject = ['$provide'];
