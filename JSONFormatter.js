JSONFormatter = (function() {
  var init = function( json, options ) {

    // default settings
    var settings = $.extend( {
      'appendTo' : 'body',
      'list_id' : 'json',
      'id_prefix': 'cn',
      'collapse' : false
    }, options);

    var loopCount = 0;

    loopObjectOfObjects = function(json2, ulId, path) {
      // console.log(path)
      $.each(json2, function(k3, v3) {
        // object of objects
        if(typeof v3 == 'object') {
          $('#' + settings.list_id + ' #' + ulId).append('<li><span>{</span> <ul id="' + ulId + '-' + k3 + '"></ul></li>');
          $.each(v3, function(k4, v4) {
            if(typeof v4 == 'object' && v4 != null) {
              $('#' + settings.list_id + ' #' + ulId + '-' + k3).append('<li>' + k4 + ' <span>{</span> <ul id="'+k4+'-'+loopCount+'"></ul></li>');
              loopAgain(v4, k4, k4 + '-' + loopCount, path + "." +k4);
            }
            else {
              $('#' + settings.list_id + ' #' + ulId + '-' + k3).append('<li>' + k4 + ': <input placeholder="' + v4 + '" cn-data-path="'+path + "." +k4+'"></li>');
            }

          });
        }
        else {
          // normal array
          $('#' + settings.list_id + ' #' + ulId).append('<li>' + v3 + '</li>')
        }
      });
    },

    loopAgain = function(v, k, ulId, path) {
      loopCount++;
      $.each(v, function(nextKey, nextVal) {
        var nextListId = nextKey + '-' + loopCount;
        var newList = '<ul id="' + nextListId + '"></ul>';
        if(nextVal != null && typeof nextVal == 'object') {
          if(nextVal.length == 0) {
            // an empty object, just output that
            $('#' + settings.list_id + ' #' + ulId).append('<li><i>' + nextKey + ':</i> []</li>');
          }
          else if(nextVal.length >= 1) {
            // an object of objects
            $('#' + settings.list_id + ' #' + ulId).append('<li><b>' + nextKey + ':</b> <span>[</span> ' + newList + '</li>');
            loopObjectOfObjects(nextVal, nextListId, path+"."+nextKey);
          }
          else if(nextVal.length == undefined) {
            // next node
            $('#' + settings.list_id + ' #' + ulId).append('<li><b>' + nextKey + ':</b> <span>{</span> ' + newList + '</li>');
            loopAgain(nextVal, nextKey, nextListId, path+"."+nextKey);
          }
        }
        else {
            // $('#' + settings.list_id + ' #' + ulId).append('<li><i>'+ nextKey + ':</i> ' + nextVal + '</li>');
            $('#' + settings.list_id + ' #' + ulId).append('<li><i>'+ nextKey + ':</i> <input placeholder="*' + nextVal + '" cn-data-path="'+path+"."+nextKey+'"></li>');
        }
      });
    };

    // addClosingBraces = function() {
    //   $('#' + settings.list_id + ' span').each(function() {
    //     var closingBrace = '<span>}</span>';
    //     if($(this).text() == "[") {
    //       closingBrace = '<span>]</span>';
    //     }
    //     $(this).parent().find('ul').eq(0).after(closingBrace);
    //   });
    // };

    var jsonList = $('<ul id="' + settings.list_id + '" />');

    $(settings.appendTo).append(jsonList);

    $.each(json, function(key, val) {
      if(val != null && typeof val == 'object') {
        var goObj = false;
        var goArray = false;
        var nk = '';
        $.each(val, function(nextKey, nextVal) {

          if(nextVal != null && typeof nextVal == 'object') {
            if(nextVal.length == undefined) {
              goObj = true;
              nk = nextKey;
            }
            else {
              goObj = false;
            }
          }
          else {
            // console.log('nextVal ' + nextVal);
            goArray = true;
          }
        });

        if(goObj) {
          // $('#' + settings.list_id).append('<li><b>' + key + ':</b> <span>[</span><ul id="' + nk + '-' + loopCount + '"></ul></li>');
          $('#' + settings.list_id).append('<li><b>' + key + ':</b> <div id="' + nk + '-' + loopCount + '"></div></li>');
          loopObjectOfObjects(val, nk + '-' + loopCount, key);
        }
        else if(goArray) {
          $('#' + settings.list_id).append('<li><b>' + key + ':</b> <div id="' + nk + '-' + loopCount + '"></div></li>');
          loopAgain(val, nk, nk + '-' + loopCount, key);
        }
        else {
          $('#' + settings.list_id).append('<li><b>' + key + ':</b> <div id="' + key + '-' + loopCount + '"></div></li>');
          loopAgain(val, key, key + '-' + loopCount, key);
        }
      }
      else {
        $('#' + settings.list_id).append('<li><i>' + key + ':</i> <input placeholder="' + val + '" cn-data-path="'+key+'"></li>');
      }
    });

    addClosingBraces();

    if(settings.collapse) {
      addToggles(settings.list_id);
    }

  },

  addToggles = function( listId ) {
    $('#' + listId + " > li").find('ul').each(function() {
      $(this).parent().find('span').eq(0).after('<span class="toggle fake-link"> - </span>');
    });

    $('.toggle').next().slideUp().end().text(' + ').on('click', function() {
      if($(this).next().is(":visible")) {
        $(this).next().slideUp().end().text(' + ');
      }
      else {
        $(this).next().slideDown().end().text(' - ');
      }
    });
  };

  return {

    format: function(json, options) {
      init(json, options);
    }

  }

})();
