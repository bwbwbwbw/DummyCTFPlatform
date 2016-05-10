export default function textAngular ($provide) {
  $provide.decorator('taOptions', ['$delegate', function(taOptions){
    taOptions.forceTextAngularSanitize = false;
    taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'ul', 'ol'],
        ['html', 'insertLink'],
    ];
    return taOptions;
  }]);
}

textAngular.$inject = ['$provide'];
