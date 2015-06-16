JSONFormatter = (function() {
  var init = function( json, options, schemar ) {

    // default settings
    var settings = $.extend( {
      'appendTo' : 'body',
      'list_id' : 'json',
      'id_prefix': 'cn',
      'input_class': 'test',
      'text_class': 'test2'
    }, options);

    var loopCount = 0;

    loopObjectOfObjects = function(json2, ulId, path, schema) {
      // console.log(path)
      $.each(json2, function(k3, v3) {
        // object of objects
        var schema3 = schema[k3];
        if(typeof v3 == 'object') {
          $('#' + settings.list_id + ' #' + ulId).append('<li><ul id="' + ulId + '-' + k3 + '"></ul></li>');
          var new_path = path + "." + k3;
          $.each(v3, function(k4, v4) {
            if(typeof v4 == 'object' && v4 != null) {
              $('#' + settings.list_id + ' #' + ulId + '-' + k3).append('<li><div class="'+settings.text_class+'">' + k4 + '</div><ul id="'+k4+'-'+loopCount+'"></ul></li>');
              loopAgain(v4, k4, k4 + '-' + loopCount, new_path + "." +k4, schema3[k4]);
            }
            else {
              $('#' + settings.list_id + ' #' + ulId + '-' + k3).append('<li><div class="'+settings.text_class+'">' + k4 + '</div>'+_input_html(v4, new_path + "." +k4, schema3[k4])+'</li>');
            }

          });
        }
        else {
          // normal array
          $('#' + settings.list_id + ' #' + ulId).append('<li>' + v3 + '</li>')
        }
      });
    },

    loopAgain = function(v, k, ulId, path, schema) {
      loopCount++;
      $.each(v, function(nextKey, nextVal) {
        var nextListId = nextKey + '-' + loopCount;
        var newList = '<ul id="' + nextListId + '"></ul>';
        var schema;
        if (schema) schema = schema[nextKey];
        if(nextVal != null && typeof nextVal == 'object') {
          if(nextVal.length == 0) {
            // an empty object, just output that
            $('#' + settings.list_id + ' #' + ulId).append('<li><div class='+settings.text_class+'>' + nextKey + '</div> []</li>');
          }
          else if(nextVal.length >= 1) {
            // an object of objects
            $('#' + settings.list_id + ' #' + ulId).append('<li><div class="'+settings.text_class+'">' + nextKey + '</div> ' + newList + '</li>');
            loopObjectOfObjects(nextVal, nextListId, path+"."+nextKey, schema);
          }
          else if(nextVal.length == undefined) {
            // next node
            $('#' + settings.list_id + ' #' + ulId).append('<li><div class="'+settings.text_class+'">' + nextKey + '</div> ' + newList + '</li>');
            loopAgain(nextVal, nextKey, nextListId, path+"."+nextKey, schema);
          }
        }
        else {

            if ($.isArray(v)) {
              // if it is array, not show the key(counting number)
              $('#' + settings.list_id + ' #' + ulId).append('<li>'+_input_html(nextVal, path+"."+nextKey, schema)+'</li>');        
            } else {
              $('#' + settings.list_id + ' #' + ulId).append('<li><div class='+settings.text_class+'>'+ nextKey + '</div>'+_input_html(nextVal, path+"."+nextKey)+'</li>');
            }
        }
      });
    },

    _input_html = function(val, path, type) {
      if (type === "text") {
        return '<textarea rows="4" cols="50" class="'+ settings.input_class +'" cn-data-path="'+path+'">'+val+'</textarea>'
      } else {
        return '<input class="' + settings.input_class + '"value="' + val + '" cn-data-path="'+path+'">'        
      }
    };

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

        var schema = schemar[key];

        if(goObj) {
          // $('#' + settings.list_id).append('<li><div class="'+settings.text_class+'">' + key + '</div> <span>[</span><ul id="' + nk + '-' + loopCount + '"></ul></li>');
          $('#' + settings.list_id).append('<li><div class="'+settings.text_class+'">*' + key + '</div> <div id="' + settings.id_prefix+'-'+nk + '-' + loopCount + '"></div></li>');
          loopObjectOfObjects(val, settings.id_prefix+'-'+nk + '-' + loopCount, key, schema);
        }
        else if(goArray) {
          $('#' + settings.list_id).append('<li><div class="'+settings.text_class+'">' + key + '</div> <div id="' + settings.id_prefix+'-'+nk + '-' + loopCount + '"></div></li>');
          loopAgain(val, nk, settings.id_prefix+'-'+nk + '-' + loopCount, key, schema);
        }
        else {
          $('#' + settings.list_id).append('<li><div class="'+settings.text_class+'">' + key + '</div> <div id="' + settings.id_prefix+'-'+key + '-' + loopCount + '"></div></li>');
          loopAgain(val, key, settings.id_prefix+'-'+key + '-' + loopCount, key, schema);
        }
      }
      else {
        var type = schemar[key];
        $('#' + settings.list_id).append('<li><div class='+settings.text_class+'>' + key + '</div>'+_input_html(val, key, type)+'</li>');
      }
    });
  };

  return {
    format: function(json, options, schemar) {
      init(json, options, schemar);
    }
  }

})();
