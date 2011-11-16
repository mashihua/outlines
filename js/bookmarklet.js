(function(){
    var s = document.createElement('script'),
        ele = document.getElementsByTagName('script')[0] || document.getElementsByTagName('head')[0],
        styles = '.__reset {background: none repeat scroll 0 0 transparent;border: 0 none;border-spacing: 0;color: #000000;cursor: auto;direction: ltr;font-family: "lucida grande",tahoma,verdana,arial,sans-serif;font-size: 11px;font-style: normal;font-variant: normal;font-weight: normal;letter-spacing: normal;line-height: 1;margin: 0;overflow: visible;padding: 0;text-align: left;text-decoration: none;text-indent: 0;text-shadow: none;text-transform: none;visibility: visible;white-space: normal;word-spacing: normal;}.__out_lines{position:fixed;top:10px;right:10px;border:1px solid #BEDCE7;background:rgba(224,242,245,.9);padding:15px;z-index:99999;max-height:400px;overflow:auto;border-radius:8px;-moz-border-radius:8px;-webkit-border-radius:8px;}.__reset a{color:#008;text-decoration:underline;}.__reset .close{float: right; margin: 0 0 5px 5px; padding: 5px;color:#4183C4;font-size:130%;}.close a{text-decoration:none;}';
    ele.parentNode.insertBefore(s, ele);
    s.src='https://raw.github.com/mashihua/outlines/master/js/outlines.js';
    s.onload = s.onreadystatechange = function(){
        var outlins = HTMLOutline(window.document.body).toHTML(true),
            div = document.createElement('div'),
            html,
            close;
        div.className='__reset';
        html = div.insertBefore(document.createElement('div'), div.firstChild);
        html.className = '__out_lines';
        html.innerHTML = outlins;
        close = html.insertBefore(document.createElement('a'), html.firstChild);
        close.className= 'close';
        close.innerHTML = 'X';
        close.href='#';
    	close.onclick=function(){ document.body.removeChild(div); close = html = div = null; };
        document.body.appendChild(div);
    }
    if (!window.ActiveXObject) {
         var style = document.createElement('style');
         style.type = 'text/css';
         style.textContent = styles;
         ele.parentNode.insertBefore(style,ele);
       } else {
         try {
           document.createStyleSheet().cssText = styles;
         } catch (exc) {
           if (document.styleSheets[0]) {
             document.styleSheets[0].cssText += styles;
           }
         }
       }
}());