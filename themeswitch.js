var sheetIndex = 0;
var themes = [
    "css/style.css",
    "css/tumblr-kinda.css",
    "css/white-paper.css",
    "css/eye-burn.css",
    "css/sky.css",
    "css/vamp.css"
    ];
    
    var currentTheme = 'style';
    
    var getLinkId = function(themeString){
         var themeName = themeString.slice(4, themeString.length-4);
        //var themeNameNoHyp = themeName.replace(/-/g, ' ');
        var linkId = themeName.replace(/\s/g, '');
        return linkId;
    }
    
    console.log(themes);
    
    
    var dropdown = document.getElementById('theme-dropdown');
    var createThemeList = function(listOfThemes){
        listOfThemes.forEach(function(themeString){
            //themeString.substring(0,5); // for file name if need
            var n = themeString.search("css");
            if(n >= 0){
                
                var themeLink = document.createElement('a');
                var themeName = themeString.slice(4, themeString.length-4);
                var themeNameNoHyp = themeName.replace(/-/g, ' ');
                themeLink.innerHTML = themeNameNoHyp;
                themeLink.id = themeName.replace(/\s/g, '');
                dropdown.appendChild(themeLink);
            }else{console.log("not in folder")};
        });
        document.getElementById(currentTheme).classList.add('selectedTheme');
    };
    
    var createThemeListener = function(listOfThemes){
        listOfThemes.forEach(function(themeString){
            var themeName = themeString.slice(4, themeString.length-4);
            var themeNameNoHyp = themeName.replace(/-/g, ' ');
            var linkId = themeName.replace(/\s/g, '');
            var themeLink = document.getElementById(linkId);
            themeLink.addEventListener('click', function(){
                changeTheme(themeString);
                changeCurrThemeDisp(themeNameNoHyp);
                listOfThemes.forEach(function(themeS){
                    var el = document.getElementById(getLinkId(themeS));
                   el.classList.remove('selectedTheme'); 
                });
                currentTheme = linkId;
                
                document.getElementById(currentTheme).classList.add('selectedTheme');
                
                
                }
            );
            
            
        });
        
    };

    
    
    var changeTheme = function(themeFile){
        //sheetIndex = (sheetIndex + 1) % themes.length;
        //var newHref = themes[sheetIndex];
        //document.getElementById('currentstyle').innerHTML = newHref;
        
        document.getElementById('pagestyle').setAttribute('href', themeFile);
        
    };
    
    var changeCurrThemeDisp = function(themeName){
       var $themeSelect = document.getElementById('themeSelect'); 
       $themeSelect.innerHTML = themeName;
    };
    
    
    document.addEventListener('DOMContentLoaded', function(){ //ASK ANDY WHY LOAD DOESNTWORK AND NULL AT TOP WHY
        //console.log("HAY IGNORE ME");
        //console.log(dropdown);
        createThemeList(themes);
        createThemeListener(themes);
    });
    
    /*
    <p id="stylechange" onclick="changeTheme()">
    Don't like this style?  Click here to change it! <span id="currentstyle">blue.css</span>
  </p>
    
    */