"use strict";
// CSS Borders
const FirstScrollImageBorder = '0.2em solid rgb(255, 200, 0)';
const ScrollImageBorder = '0.3em dotted rgb(0, 153, 255)';
const ScrollImageHoverBorder = '0.2em dotted rgb(0, 153, 255)';

// ALL Initialize() FUNCTIONS MUST BE CALLED THROUGH OnLoadInitialize()
// ALL NAMESPACE VARIABLES MUST START WITH A '_'

// Namespace that handles Images
var Images = (function() {
    var _Images = []; 
    var _Position = null; // Current _Images position
    var _Last = null;
    var _CurrentImage = null;
    
    var Initialize = function () {

    }
    // This function loads in the Images from URL into _Images and Display
    // ONLY CALL FROM DISPLAY.LOADIMAGES()
    var LoadImagesFromURL = function(URL, ScrollBox, Viewport, Title) {
        // Clears Display
        _Images.length = 0; 
        _Position = 0;
        ScrollBox.empty();
        Title.empty();
        Viewport.attr('src', '');
        // --------------------------
        $.getJSON(URL, function(data) {
            $.each(data, function(key, val) {
                var IMG = document.createElement('img');
                IMG.id = key;
                IMG.src = val;
                _Images.push(IMG);
                var Index = _Images.length - 1;  
                IMG.addEventListener('mouseover', function() { Hover(Index); });
                IMG.addEventListener('mouseout', function() { Unhover(Index); });       
                IMG.addEventListener('click', function() {ImageClick(Index); });
                ScrollBox.append(IMG);
            }); 
            _Last = _Images.length - 1;
            _CurrentImage = _Images[0];
            _CurrentImage.style.border = ScrollImageBorder;
            Viewport.attr('src', _Images[0].src);
            Title.text(_Images[0].id);
        });
    }
    var SetCurrentImage = function(i) {
        if (_Position === 0)
            _CurrentImage.style.border = FirstScrollImageBorder;
        else
            _CurrentImage.style.border = 'none';
        if (i < 0) 
            _Position = _Last; 
        else if (i > _Last) 
            _Position = 0;
        else 
            _Position = i;
        _CurrentImage = _Images[_Position];
        _CurrentImage.style.border = ScrollImageBorder;  
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
        if (_Images[i] !== _CurrentImage) 
            _Images[i].style.border = ScrollImageHoverBorder; 
    }
    function Unhover(i) {
        if (_Images[i] !== _CurrentImage && i == 0)
            _Images[i].style.border = FirstScrollImageBorder;     
        else if (_Images[i] !== _CurrentImage)
            _Images[i].style.border = 'none'; 
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
            _ImageWidth = IMG.clientWidth + 2 * parseInt(window.getComputedStyle(IMG).margin);
    }
    // ONLY CALL THIS FROM INPUT BOX
    // This populates the scrollbox with images
    var LoadImages = function(URL) {
        Images.LoadImagesFromURL(URL, _ScrollBox, _Viewport, _Title);  
    }
    var SetViewportImage = function(IMG) {
        _Viewport.attr('src', IMG.src);
        _Title.text(IMG.id);        
    }
    var MoveScrollPosition = function(i) {
        if (_ImageWidth === -1) {
            var IMG = Images.Image(0);
            _ImageWidth = IMG.clientWidth + 2 * parseInt(window.getComputedStyle(IMG).margin);
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
    // -----------------------------
    return {
        Initialize: Initialize,
        LoadImages: LoadImages,
        UpdateDimensions: UpdateDimensions,
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
        _InputBox = $("#InputBox");
    }
    var LoadJSON = function() {
        if (_InputBox.val() !== "") {
            var JSON = _InputBox.val();
            _InputBox.val('');
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
        Images.Initialize();
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