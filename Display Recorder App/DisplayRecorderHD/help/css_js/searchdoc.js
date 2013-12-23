// We're using a global variable to store the number of occurrences
var SearchDoc_SearchResultCount = 0;

// helper function, recursively searches in elements and their child nodes
function SearchDoc_HighlightAllOccurencesOfStringForElement(element,keyword) {
  if (element) 
  {
    if (element.nodeType == 3) 
    {        // Text node
      while (true) 
      {
        var value = element.nodeValue;  // Search for keyword in text node
        var idx = value.toLowerCase().indexOf(keyword);

        if (idx < 0) break;             // not found, abort

        var span = document.createElement("span");
        var text = document.createTextNode(value.substr(idx,keyword.length));
        span.appendChild(text);
        span.setAttribute("class","MyAppHighlight");
        span.style.backgroundColor="yellow";
        span.style.color="black";
        text = document.createTextNode(value.substr(idx+keyword.length));
        element.deleteData(idx, value.length - idx);
        var next = element.nextSibling;
        element.parentNode.insertBefore(span, next);
        element.parentNode.insertBefore(text, next);
        element = text;
        SearchDoc_SearchResultCount++;	// update the counter
      }
    } 
    else if (element.nodeType == 1) 
    { // Element node
      if (element.style.display != "none" && element.nodeName.toLowerCase() != 'select') {
        for (var i=element.childNodes.length-1; i>=0; i--) 
        {
          SearchDoc_HighlightAllOccurencesOfStringForElement(element.childNodes[i],keyword);
        }
      }
    } //else element node
  } //element not nil
}

//hoant add
function SearchDoc_HighlightAllOccurencesOfSearchString()
{
	// put the value of the textbox in string
	var string = document.getElementById('search_doc_text').value;
   	var search_result_label= document.getElementById('search_doc_result_label');
    if(search_result_label)
    {
        search_result_label.innerHTML='';
    }

    if(string)
    {
        SearchDoc_HighlightAllOccurencesOfString(string);
        
        //update search result
        if(search_result_label)
        {
            if(string)
            {
                if(SearchDoc_SearchResultCount == 0)
                {//Not found
                    search_result_label.innerHTML='Not Found ';          
                }
                else if(SearchDoc_SearchResultCount == 1)
                {//found 1 item
                    search_result_label.innerHTML= SearchDoc_SearchResultCount + ' match ' ;       
                }
                else
                {//found multiple items
                    search_result_label.innerHTML= SearchDoc_SearchResultCount + ' matches ';       
                }
            }
            else
            {//empty search string
                search_result_label.innerHTML='';     
            }
        }
    }
    else
    {
        SearchDoc_ClearSearchText();
    }
    

}

function SearchDoc_ClearSearchText()
{
	var search_text= document.getElementById('search_doc_text');
    if(search_text)
    {
        search_text.value='';
        //search_text.focus();
    }
    
	var search_result_label= document.getElementById('search_doc_result_label');
    if(search_result_label)
    {
        search_result_label.innerHTML='';
    }
    
    SearchDoc_RemoveAllHighlights();
}


// the main entry point to start the search
function SearchDoc_HighlightAllOccurencesOfString(keyword) {
  SearchDoc_RemoveAllHighlights();
  SearchDoc_HighlightAllOccurencesOfStringForElement(document.body, keyword.toLowerCase());
}

// helper function, recursively removes the highlights in elements and their childs
function SearchDoc_RemoveAllHighlightsForElement(element) {
  if (element) {
    if (element.nodeType == 1) {
      if (element.getAttribute("class") == "MyAppHighlight") {
        var text = element.removeChild(element.firstChild);
        element.parentNode.insertBefore(text,element);
        element.parentNode.removeChild(element);
        return true;
      } else {
        var normalize = false;
        for (var i=element.childNodes.length-1; i>=0; i--) {
          if (SearchDoc_RemoveAllHighlightsForElement(element.childNodes[i])) {
            normalize = true;
          }
        }
        if (normalize) {
          element.normalize();
        }
      }
    }
  }
  return false;
}

// the main entry point to remove the highlights
function SearchDoc_RemoveAllHighlights() {
  SearchDoc_SearchResultCount = 0;
  SearchDoc_RemoveAllHighlightsForElement(document.body);
}