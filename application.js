$(function(){
  var handler = {
    autocomplete: function(value){
      if(value == ""){
        handler.clearAutocomplete();
      }else{
        handler.searchLocation(value).done(function(data){ handler.outputResults(data) });
      }
    },
    searchLocation: function(value){
      return $.getJSON("http://autocomplete.wunderground.com/aq?h=0&query=" + value + "&cb=?", function(data){
        return data;
      });
    },
    outputResults: function(data){
      handler.clearAutocomplete();
      var results = $('#autocomplete');
      $.each(data.RESULTS, function(key, value) {
        results.append('<div class="city col s6 offset-s3" data-href="' + handler.getWeatherURL(value.name) + '">' + value.name + '</div>');
      });
      handler.setupLinkListeners();  
    },
    clearAutocomplete: function(){
      $('.city').off("click");
      $('#autocomplete').children().remove();
    },
    getWeatherURL: function(name){
        var location = name.split(',');
        var country = location[location.length-1].trim();
        var city = location[0];
        return 'http://api.wunderground.com/api/de055c43fdf8f1ff/conditions/q/' + country + '/' + city +'.json';
    },
    setupLinkListeners: function(){
      $('.city').on("click", function(){
        $("#new").css("display", "block");
        $("#searchInput").prop('disabled', true);
        $.getJSON($(this).data("href"), handler.loadWeatherInfo);
      });
    },
    loadWeatherInfo: function(data){
      handler.clearAutocomplete();

      var image;
      switch(data.current_observation.weather) {
        case 'Mostly Cloudy':
        case 'Partly Cloudy':
        case 'Overcast':
          image = "background: url('cloudy.png') repeat center center; color: #FFF; text-shadow: 0px 0px 3px rgba(0, 0, 0, 1); height: 400px;";
          break;
        case 'Light Rain':
        case 'Rain':
          image = "background: url('rain.jpg') repeat center center; color: #FFF; text-shadow: 0px 0px 3px rgba(0, 0, 0, 1); height: 400px;";
          break;
        case 'Clear':
          image = "background: url('clear.png') repeat center center; color: #FFF; text-shadow: 0px 0px 3px rgba(0, 0, 0, 1); height: 400px;";
          break;
        default:
          break;
      }
      var results = $('#autocomplete');
      var container = $('<div style="' + image + '"></div>');
      var wrapper = $('<div class="valign-wrapper" style="height: 400px"></div>');
      var wrapper2 = $('<div style="width: 100%"></div>');
      results.append(container);
      container.append(wrapper);
      wrapper.append(wrapper2);
      wrapper2.append('<p class="center-align valign">City: ' + data.current_observation.observation_location.city + '</p>');
      wrapper2.append('<p class="center-align valign">Country: ' + data.current_observation.observation_location.country + '</p>');
      wrapper2.append('<p class="center-align valign">Elevation: ' + data.current_observation.observation_location.elevation + '</p>');
      wrapper2.append('<p class="center-align valign">Current temperature: ' + data.current_observation.temperature_string + '</p>');
      wrapper2.append('<p class="center-align valign">Current weather: ' + data.current_observation.weather + '</p>');
    }
  }

  $("#searchInput").on("keyup", function(){
    handler.autocomplete($(this).val());
  });

  $("#new").on("click", function(){
    handler.clearAutocomplete();
    $("#searchInput").val('');
    $("#searchInput").prop('disabled', false);
  });
})