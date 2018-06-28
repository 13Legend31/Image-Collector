"use strict";
// CSS Borders
const FirstScrollImageBorder = '0.2em solid rgb(255, 200, 0)';
const ScrollImageBorder = '0.3em dotted rgb(0, 153, 255)';
const ScrollImageHoverBorder = '0.2em dotted rgb(0, 153, 255)';
const ViewportBorder = '0.3em solid black';
const ViewportHoverBorderImage = 'repeating-linear-gradient(45deg, purple, aqua 1%, purple 1%, aqua 12%) 10';
const ViewportUnhoverBorderImage = 'none';

// ALL Initialize() FUNCTIONS MUST BE CALLED THROUGH OnLoadInitialize()
// ALL NAMESPACE VARIABLES MUST START WITH A '_'

// Namespace that handles Images
var Images = (function() {
    var _Images = []; 
    var _Position = null; // Current array position
    var _Last = null;
    var _CurrentImage = null;
    
    var Initialize = function () {

    }
    // This function loads in the Images from URL into _Images and Display
    // ONLY CALL FROM DISPLAY.LOADIMAGES()
    var LoadImagesFromURL = function(URL, ScrollBox, Viewport, Title) {
        _Images.length = 0; // Clears Images Array
        _Position = 0;
        $.getJSON(URL, function(data) {
            $.each(data, function(key, val) {
                var IMG = $(document.createElement('img'));
                _Images.push({
                    IMG : IMG,
                    title : key,
                    src : val  
                });
                IMG.attr('id', key);
                IMG.attr('src', val);
                var Index = _Images.length - 1;         
                IMG.hover(function() { Hover(Index); }, function() { Unhover(Index); }); 
                IMG.click(function() { ImageClick(Index); });
                ScrollBox.append(IMG);
            }); 
            _Last = _Images.length - 1;
            _CurrentImage = _Images[0].IMG;
            _CurrentImage.css('border', ScrollImageBorder);
            Viewport.attr('src', _Images[0].src);
            Viewport.css('border', ViewportBorder);
            Title.text(_Images[0].title);
        });
    }
    var SetCurrentImage = function(i) {
        if (_Position === 0)
            _CurrentImage.css('border', FirstScrollImageBorder);
        else
            _CurrentImage.css('border', 'none');
        if (i < 0) 
            _Position = _Last; 
        else if (i > _Last) 
            _Position = 0;
        else 
            _Position = i;
        _CurrentImage = _Images[_Position].IMG;
        _CurrentImage.css('border', ScrollImageBorder);  
    }
    // Getters -----------
    var Image = function(i) {
        if (i && i <= _Last) 
            return _Images[i];
        else 
            return _Images[_Position];
    }
    var Position = function() {
        return _Position;
    }
    // ----------------------------
    // Element Interaction Functions
    function Hover(i) {
        if (_Images[i].IMG !== _CurrentImage) 
            _Images[i].IMG.css('border', ScrollImageHoverBorder); 
    }
    function Unhover(i) {
        if (_Images[i].IMG !== _CurrentImage && i == 0)
            _Images[i].IMG.css('border', FirstScrollImageBorder);     
        else if (_Images[i].IMG != _CurrentImage)
            _Images[i].IMG.css('border', 'none'); 
    }
    // ---------------------------
    return {
        Initialize: Initialize,
        LoadImagesFromURL: LoadImagesFromURL,
        SetCurrentImage: SetCurrentImage,
        Image: Image,
        Position: Position
    }
})();

// Namespace that handles scrollbar and viewport
var Display = (function() {
    // References ------
    var _ScrollBox = null;
    var _Viewport = null;
    var _Title = null;
    // Dimensions ------
    var _ScrollWidth = -1;
    var _ScrollLeftBound = -1;
    var _ScrollRightBound = -1;
    var _ImageWidth = -1;

    // Called on load to initialize all variables except ImageWidth
    var Initialize = function() {
        _ScrollBox = $("#ScrollBox");
        _Viewport = $("#Viewport");
        _Title = $("#Title");
        _Title.css('font-size', Math.min(window.innerWidth, window.innerHeight) * 0.062); 
        _Viewport.hover(function() { ViewportHover(); }, function() { ViewportUnhover(); });
        _ScrollWidth = _ScrollBox.width();
        _ScrollLeftBound = _ScrollBox.scrollLeft();
        _ScrollRightBound = _ScrollLeftBound + _ScrollWidth;
    }
    // Called on resize
    var UpdateDimensions = function () {
        _Title.css('font-size', Math.min(window.innerWidth, window.innerHeight) * 0.062);
        _ScrollWidth = _ScrollBox.width();
        _ScrollLeftBound = _ScrollBox.scrollLeft();
        _ScrollRightBound = _ScrollLeftBound + _ScrollWidth;
        var IMG = Images.Image(0);
        if (IMG)
            _ImageWidth = parseInt(IMG.IMG.css('width')) + 2 * parseInt(IMG.IMG.css('margin-left'));
    }
    // ONLY CALL THIS FROM INPUT
    // This populates the scrollbox with images
    var LoadImages = function(URL) {
        Images.LoadImagesFromURL(URL, _ScrollBox, _Viewport, _Title);  
    }
    var SetViewportImage = function(IMG) {
        _Viewport.attr('src', IMG.src);
        _Title.text(IMG.title);        
    }
    var MoveScrollPosition = function(i) {
        if (_ImageWidth === -1) {
            var IMG = Images.Image(0);
            _ImageWidth = parseInt(IMG.IMG.css('width')) + 2 * parseInt(IMG.IMG.css('margin-left'));
        }

        var LeftPosition = i * _ImageWidth;
        var RightPosition = LeftPosition + _ImageWidth;
        if (RightPosition > _ScrollRightBound) 
            _ScrollBox.scrollLeft(LeftPosition);
        else if (LeftPosition < _ScrollLeftBound) 
            _ScrollBox.scrollLeft(RightPosition - _ScrollWidth); 
        else if (i === 0)
            _ScrollBox.scrollLeft(0);
    }
    // Element Interaction Functions
    function ViewportHover() {
        _Viewport.css('border-image', ViewportHoverBorderImage);
    }
    function ViewportUnhover() {
        _Viewport.css('border-image', ViewportUnhoverBorderImage);
    }
    // -----------------------------
    return {
        UpdateDimensions: UpdateDimensions,
        LoadImages: LoadImages,
        Initialize: Initialize,
        SetViewportImage: SetViewportImage,
        MoveScrollPosition: MoveScrollPosition
    }
})();

// Top Bar and Input
var TopBar = (function() {
    var _TopBar;
    var _InputBox;
    // Call On Load to Initialize
    var Initialize = function() {
        _TopBar = $("#TopBar");
        _InputBox = $("InputBox");
    }
    var LoadJSON = function() {
        if (_InputBox.val() != "") {
            var JSON = _InputBox.val();
            Display.LoadImages(JSON);
        }
    }    
    var Hide = function() {
        _TopBar.css('z-index', -2);
    }
    var Reveal = function() {
        _TopBar.css('z-index', 2);
    }
    return {
        Initialize: Initialize,
        LoadJSON: LoadJSON,
        Hide: Hide,
        Reveal: Reveal
    }
})();

// All functions in this namespace are called onload
// Functions are reduced in LoadDocument
// DO NOT CALL FROM ANYWHERE ELSE
var LoadDocument = (function() {
    var InitializeNamespaces = function() {
        Display.Initialize();
        TopBar.Initialize();
    }
    var AddEventListeners = function() {
        window.addEventListener("keydown", function(event) { 
            if (event.keyCode == 39) 
                GoRight();
            else if (event.keyCode == 37) 
                GoLeft();
            else if (event.keyCode == 13) 
                TopBar.LoadJSON();
        });
        window.addEventListener('mousewheel', function(e) {
            if (e.wheelDelta < 0) 
                GoRight(); 
            else 
                GoLeft();
        });
    }
    // Reducer and interface of load functions
    var LoadDocument = function() {
        InitializeNamespaces();
        AddEventListeners();
    }
    return LoadDocument;
})();

function GoRight() {
    var i = Images.Position() + 1;
    Images.SetCurrentImage(i);
    i = Images.Position();
    var IMG = Images.Image(i);
    Display.SetViewportImage(IMG);
    Display.MoveScrollPosition(i);    
}

function GoLeft() {
    var i = Images.Position() - 1;
    Images.SetCurrentImage(i);
    i = Images.Position();
    var IMG = Images.Image(i);
    Display.SetViewportImage(IMG);
    Display.MoveScrollPosition(i);
}

function ImageClick(i) {
    Images.SetCurrentImage(i);
    Display.SetViewportImage(Images.Image(i));
    Display.MoveScrollPosition(i);
}