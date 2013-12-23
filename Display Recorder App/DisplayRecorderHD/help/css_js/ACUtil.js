var ACUtil = {

	'inputCleanup' : function(cleanMe) {
		cleanMe = cleanMe.replace(/\&/g, "&amp;");
		//cleanMe = cleanMe.replace(/\"/g, "&quot;");
		
		cleanMe = cleanMe.replace(/\</g, "&lt;");
		cleanMe = cleanMe.replace(/\>/g, "&gt;");
		cleanMe = cleanMe.replace(/\+/g, " ");
		return cleanMe;
	},
	
	'clone': function(object) {
		// will clone a javascript object (as long as it conforms to JSON)
		var json = Object.toJSON(object);
		return eval(json.evalJSON(true));
	},
	
	'reverseInputCleanup' : function(cleanMe) {
		cleanMe = cleanMe.replace(/\&amp;/g, "&");
		//cleanMe = cleanMe.replace("&quot;", "\"");
		
		cleanMe = cleanMe.replace(/\&lt\;/g, "<");
		cleanMe = cleanMe.replace(/\&gt\;/g, ">");
		cleanMe = cleanMe.replace(/ /g, "+");
		return cleanMe;
	},
	
	'validateSerialNumber' : function(value) {
        if( (value.length != 11 && value.length != 12 && value.length != 18) || value.indexOf(".")>-1 ) {
            return false;
        }
        if (value.length != 18) {
            if(value.length == 11){
                yrWkStr = value.substr(2, 3)
                if(isNaN(yrWkStr) == true) {
                   return false;
                }
                else {
                   wkStr = yrWkStr.substr(1, 2)
                   wk = parseInt(wkStr, 10)
                   if(wk < 1 || wk > 53) {
                      return false;
                   }
                   else {
                      return true;
  	               }
                }
              }else
                 if(value.length == 12){
                    //PPPYWSSSCCCC
                    var yrWk = value.substr(3,2)
                    var upperCaseYearWeek=yrWk.toUpperCase();
                    var patternValue = new RegExp("[A-Z][0-9A-Z]");
                    return patternValue.test(upperCaseYearWeek);
                  }
           }
           else {
              if(isNaN(value) == true){
                  return false;
              }
              else {
                  return true;
              }
           }
        },
	
	'trim' : function(stringToTrim) {
		if(stringToTrim!=undefined) {
			return stringToTrim.replace(/^\s+|\s+$/g,"");
		}
		else {
			return stringToTrim;
		}
	},
	
	'removeBreaks' : function(stringToRemove) {
		if(stringToRemove!=undefined) {
			return stringToRemove.replace(/[\r\n\t]+/g, "");
		}
		else {
			return stringToRemove;
		}
	},
	
	'getCurrentUri' : function() {
		var uri = ACUtil.parseUri();
		var port = (uri.port!="80" && uri.port!="") ? ":" + uri.port: "";
		var currentUri = 'http://' + uri.domain + port + uri.directoryPath.substring(0, uri.directoryPath.length-1);
		return currentUri;
	},
	
	'parseUri' : function(sourceUri) {
		sourceUri = sourceUri==undefined ? window.location.href : sourceUri;
		var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
		var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
		var uri = {};
		
		for(var i = 0; i < 10; i++) {
			uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
		}
		
		if(uri.directoryPath.length > 0) {
			uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
		}
		return uri;
	},
	
	
	'open' : function(element) {
		$(element).style.display = "block";
    },
	
    'close' : function(element) {
		$(element).style.display = "none";
    },

	'callInProgress' : function(xmlhttp) {
		switch (xmlhttp.readyState) {
			case 1: case 2: case 3:
				return true;
			break;
			// Case 4 and 0
			default:
				return false;
			break;
		}
	},
	
	'submitSearch' : function() {
		var searchTerm = $('searchsupport').value;
		
		if(ACUtil.trim(searchTerm)=="") {
			return false;
		}
		else {
			return true;
		}
	},
	
	'randomString' : function () {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = 8;
		var randomstring = '';
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		return randomstring;
	},
	
	'gup' : function (name) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		if( results == null ) return "";
		else return results[1];
	},
	
	'toggleCollapse': function (divBox, quickie) {
		var collapsedDiv = divBox.nextSibling;
  		
        //hoant change
//  		while(collapsedDiv.nodeName=="#text"){
//			collapsedDiv=collapsedDiv.nextSibling;
//		}
        var nodeName = collapsedDiv.nodeName.toUpperCase();
  		while(nodeName!="DIV"){
			collapsedDiv=collapsedDiv.nextSibling;
            nodeName = collapsedDiv.nodeName.toUpperCase();
		}

  		
  		Element.removeClassName(divBox, "collapse");
  		Element.removeClassName(divBox, "collapse-down");
  		
		if(collapsedDiv.style.display=="" || collapsedDiv.style.display=="block") {
			if(quickie!==undefined) Effect.BlindDown(collapsedDiv, { delay:0.2 } );
			else collapsedDiv.style.display = "none";
			divBox.addClassName("collapse");
		}
		else {
			if(quickie!==undefined) Effect.BlindUp(collapsedDiv, { delay:0.2 } );
			else collapsedDiv.style.display = "block";
			divBox.addClassName("collapse collapse-down");
		}
	},
    
    //hoant add
    'expandID': function (elementID) 
    {
        var divBox = document.getElementById(elementID);
		var collapsedDiv = divBox.nextSibling;
  		
        //hoant change        
//  		while(collapsedDiv.nodeName=="#text")
//        {
//			collapsedDiv=collapsedDiv.nextSibling;
//		}
        var nodeName = collapsedDiv.nodeName.toUpperCase();
  		while(nodeName!="DIV"){
			collapsedDiv=collapsedDiv.nextSibling;
            nodeName = collapsedDiv.nodeName.toUpperCase();
		}

  		
  		Element.removeClassName(divBox, "collapse");
  		Element.removeClassName(divBox, "collapse-down");

  		Element.addClassName(divBox, "collapse");
  		Element.addClassName(divBox, "collapse-down");
        collapsedDiv.style.display = "block";
	},
   
	
	'expandAll': function () {
		var collapsable = $('articlecontent').getElementsByClassName("collapse");

		for(var i=0; i<collapsable.length; i++) {
			var collapsedDiv = collapsable[i].nextSibling;
			
        //hoant change        
//			while(collapsedDiv.nodeName=="#text"){
//				collapsedDiv=collapsedDiv.nextSibling;
//			}
            var nodeName = collapsedDiv.nodeName.toUpperCase();
            while(nodeName!="DIV"){
                collapsedDiv=collapsedDiv.nextSibling;
                nodeName = collapsedDiv.nodeName.toUpperCase();
            }
            
	  		if(collapsedDiv!=null) {
	  			collapsable[i].addClassName("collapse-down");
	  			collapsedDiv.style.display = "block";
	  		}
	  	}
	},
	
	'collapseAll': function () {
		var collapsable = $('articlecontent').getElementsByClassName("collapse");
		for(var i=0; i<collapsable.length; i++) {
	  		var collapsedDiv = collapsable[i].nextSibling;
	  		
        //hoant change        
//			while(collapsedDiv.nodeName=="#text"){
//				collapsedDiv=collapsedDiv.nextSibling;
//			}
            var nodeName = collapsedDiv.nodeName.toUpperCase();
            while(nodeName!="DIV"){
                collapsedDiv=collapsedDiv.nextSibling;
                nodeName = collapsedDiv.nodeName.toUpperCase();
            }


	  		if(collapsedDiv!=null) {
	  			collapsable[i].removeClassName("collapse-down");
	  			collapsedDiv.style.display = "none";
	  		}
	  	}
	},
	
	
	'handleKeystroke': function(e, keyCodeToObserve, functionToExecute) {
	    var keyPressed = (document.all) ? e.keyCode : e.which;
	    // check for keyCodeToObserve which should be number of same type (13 is enter)
	    if (keyPressed == keyCodeToObserve) { 
	    	functionToExecute();
	    }
	},
	
	'getGSAUrl': function(locale, searchTerm, type){
		var multiCodedGSALangs = ['zh_CN','zh_TW','pt_PT','pt_BR'];
		var lang = (multiCodedGSALangs.indexOf(locale)>-1) ? locale.replace("_","-") : locale.substring(0,2);
		var baseSearchRedir = (typeof searchRedirUrl != 'undefined') ? searchRedirUrl : 'http://search.info.apple.com/index.html?lr=lang_';
		return baseSearchRedir + lang + '&q=' + searchTerm + '&search=Go&type=' + type + '&locale=' + locale;
	}
	
};


Event.observe(window, 'load', function() {


	// check for collapseable headings if this is an article
	if($('articlecontent') && $('articlecontent').getElementsByClassName("collapse").length!=0) {
		var collapsable = $('articlecontent').getElementsByClassName("collapse");
		for(var i=0; i<collapsable.length; i++) {
			collapsable[i].innerHTML = "<a href=\"javascript:void(0);\" onclick=\"ACUtil.toggleCollapse(this.parentNode);return false;\" style=\"margin-left:-20px;padding-left:20px;\">" + collapsable[i].innerHTML + "</a>";
            //ACUtil.toggleCollapse(collapsable[i]);//20120130-hoant change to expand all help artical's items by default
		}
/*        
        var readmoreable = $('articlecontent').getElementsByClassName("readmore");
		for(var i=0; i<readmoreable.length; i++) {
			readmoreable[i].innerHTML = "<a href=\"javascript:void(0);\" onclick=\"ACUtil.toggleCollapse(this.parentNode);return false;\" style=\"padding-right: 10px;\">" + readmoreable[i].innerHTML + "</a>";
			ACUtil.toggleCollapse(readmoreable[i]);
		}
*/
		
		if($('collapser')) {
			$('collapser').style.display = 'block';
		}
	}
	
});