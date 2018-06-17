var Images = [];
var Index = 0;
var MaxIndex = 0;
var ImgBorder = '0.3em dotted rgb(0, 153, 255)';
var ImgHoverBorder = '0.2em dotted rgb(0, 153, 255)'
var FirstImgBorder = '0.2em solid rgb(255, 200, 0)'
var ViewportBorderHover = 'repeating-linear-gradient(45deg, purple, aqua 1%, purple 1%, aqua 12%) 10'
var ViewportBorderUnhover = 'none';
var Viewport;
var Title;
var BorderedImg;
var ScrollBox;
var ScrollParent;
var ScrollWidth;
var ScrollPosLeft;
var ScrollPosRight;
var ImgWidth;

function SetVariables() {
    ScrollBox = $("#ScrollWrapper");
    ScrollBox.scroll(UpdateScrollBox);
    ScrollParent = $("#ScrollBox");
    Viewport = $("#Viewport");
    Viewport.mouseover(ViewportHover);
    Viewport.mouseout(ViewportUnhover);
    Title = $("#ImgTitle");
}

function UpdateSizes() {
    var background= document.getElementById("Background");
    var ViewportWidth = $(window).width();
    var ViewportHeight = $(window).height();
    background.width = ViewportWidth;
    background.height = ViewportHeight;
    Title.css('font-size', Math.min(ViewportWidth, ViewportHeight) * 0.062);
    
}

function LoadInPictures() {
    $.getJSON("https://api.myjson.com/bins/lenfy", function(data) {
        $.each(data, function(key, val) {
            var IMG = document.createElement('img');
            ScrollBox.append(IMG);   
            Images.push({
                "IMG" : $(IMG),
                "title" : key,
                "source" : val  
            });
            var Current = Images.length - 1;   
            Images[Current].IMG.attr('id', key);
            Images[Current].IMG.attr('src', val);
            Images[Current].IMG.click(function() { ImgClick(Current); });           
            Images[Current].IMG.hover(function() { ImgHover(Current); }, function() {ImgUnhover(Current); }); 
        });
        MaxIndex = Images.length - 1;
        UpdateScrollBox();
        Viewport.attr('src', Images[0].source);
        BorderedImg = Images[0].IMG;
        BorderedImg.css('border', ImgBorder);
        Title.text(Images[0].title);
    });  
}

function UpdateScrollBox() {
    ScrollWidth = ScrollParent.width();
    ScrollPosLeft = ScrollBox.scrollLeft();
    ScrollPosRight = ScrollPosLeft + ScrollWidth;
    ImgWidth = parseInt(Images[0].IMG.css('width')) + 2 * parseInt(Images[0].IMG.css('margin-left'));
}

function AddEventListeners() {
    window.addEventListener("keydown", function(event) { 
        if (event.key == "ArrowRight") 
            GoRight();
        else if (event.key == "ArrowLeft") 
            GoLeft();
    });
    window.addEventListener('mousewheel', function(e) {
        if (e.wheelDelta < 0) 
            GoRight(); 
        else 
            GoLeft();
    });
}


function ButtonHover(ButtonID) {
    $("#" + ButtonID).css('opacity', 1);
}

function ButtonUnhover(ButtonID) {
    $("#" + ButtonID).css('opacity', 0.4);
    $("#" + ButtonID).css('width', '7%');
    $("#" + ButtonID).css('height', '14%');
}

function ButtonMouseDown(ButtonID) {
    $("#" + ButtonID).css('width', '9%');
    $('#' + ButtonID).css('height', '18%');
}

function ButtonMouseUp(ButtonID) {
    $("#" + ButtonID).css('width', '7%');
    $("#" + ButtonID).css('height', '14%');
}

function GoRight() {
    if (Index == 0)
        BorderedImg.css('border', FirstImgBorder);
    else 
        BorderedImg.css('border', 'none');
    if (Index != MaxIndex) 
        Index++;
    else if (Index == MaxIndex) 
        Index = 0;
    BorderedImg = Images[Index];
    BorderedImg = Images[Index].IMG;
    Viewport.attr('src', Images[Index].source);
    BorderedImg.css('border', ImgBorder);
    Title.text(Images[Index].title);
    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (RightPos > ScrollPosRight) 
        ScrollBox.scrollLeft(LeftPos);
    else if (LeftPos < ScrollPosLeft) 
        ScrollBox.scrollLeft(RightPos - ScrollWidth);      
    
}

function GoLeft() {
    if (Index == 0)
        BorderedImg.css('border', FirstImgBorder);
    else 
        BorderedImg.css('border', 'none');
    if (Index != 0) 
        Index--; 
    else if (Index == 0) 
        Index = MaxIndex;
    BorderedImg = Images[Index].IMG;
    Viewport.attr('src', Images[Index].source);
    BorderedImg.css('border', ImgBorder);
    Title.text(Images[Index].title);

    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (LeftPos < ScrollPosLeft) 
        ScrollBox.scrollLeft(RightPos - ScrollWidth);    
    else if (RightPos > ScrollPosRight) 
        ScrollBox.scrollLeft(LeftPos); 
}

function ImgClick(i) {
    var BrdImg = document.getElementById(BorderedImg.attr('id'));
    Viewport.attr('src', Images[i].source);
    if (Index == 0)
        BorderedImg.css('border', FirstImgBorder);
    else 
        BorderedImg.css('border', 'none');
    Index = i;
    BorderedImg = Images[Index].IMG;
    BorderedImg.css('border', ImgBorder);
    Title.text(Images[Index].title);
    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (RightPos > ScrollPosRight) 
        ScrollBox.scrollLeft(LeftPos);  
    else if (LeftPos < ScrollPosLeft) 
        ScrollBox.scrollLeft(RightPos - ScrollWidth);     
}

function ImgHover(i) {
    if (Images[i].IMG != BorderedImg) {
        Images[i].IMG.css('border', ImgHoverBorder);
    }
}

function ImgUnhover(i) {
    if (Images[i].IMG != BorderedImg && i == 0)
        Images[i].IMG.css('border', FirstImgBorder);     
    else if (Images[i].IMG != BorderedImg && i != 0) 
        Images[i].IMG.css('border', 'none');
}

function ViewportHover() {
    Viewport.css('border-image', ViewportBorderHover);
}

function ViewportUnhover() {
    Viewport.css('border-image', ViewportBorderUnhover)
}