ngtvApp.service('templateService', function($templateCache, $http){
  this.get = function(tplName){
    var tplPath = 'assets/components/' + $env.platform + tplName;
    var tpl = $templateCache.get(tplName);
    if(tpl)
      return tpl;
    return $http.get(tplPath).then(function(response){
      tpl = response.data;
      $templateCache.put(tplName, tpl);
      return tpl;
    });
  }
});