var Images = [];
var Index = 0;
var Last = 0;
var ScrlImgBrdr = '0.3em dotted rgb(0, 153, 255)';
var ScrlImgHovBrdr = '0.2em dotted rgb(0, 153, 255)';
var ScrlFirstImgBrdr = '0.2em solid rgb(255, 200, 0)';
var VwBrdr = '0.3em solid black';
var VwBrdrHov = 'repeating-linear-gradient(45deg, purple, aqua 1%, purple 1%, aqua 12%) 10';
var VwBrdrUnhov = 'none';
var Vw;
var Title;
var BrdrImg;
var ScrlBox;
var ScrlWidth;
var ScrlLeftBound;
var ScrlRightBound;
var ImgWidth;

function SetVar() {
    ScrlBox = $("#ScrollBox");
    Vw = $("#Viewport");
    Title = $("#ImgTitle");
}

function UpdateSizes() {
    var background = document.getElementById("Background");
    background.width = $(window).width();
    background.height = $(window).height();
    Title.css('font-size', Math.min(background.width, background.height) * 0.062);
    
}

function LoadInPictures() {
    $.getJSON("https://api.myjson.com/bins/lenfy", function(data) {
        $.each(data, function(key, val) {
            var ScrlIMG = $(document.createElement('img'));
            ScrlBox.append(ScrlIMG);   
            Images.push({
                "IMG" : ScrlIMG,
                "title" : key,
                "source" : val  
            });   
            var Current = Images.length - 1;
            ScrlIMG.attr('id', key);
            ScrlIMG.attr('src', val);
            ScrlIMG.click(function() { ImgClick(Current); });           
            ScrlIMG.hover(function() { ImgHov(Current); }, function() {ImgUnhov(Current); }); 
        });
        Last = Images.length - 1;
        UpdateScrollInfo();
        Vw.attr('src', Images[0].source);
        Vw.css('border', VwBrdr);
        BrdrImg = Images[0].IMG;
        BrdrImg.css('border', ScrlImgBrdr);
        Title.text(Images[0].title);
    });  
}

function UpdateScrollInfo() {
    ScrlWidth = ScrlBox.width();
    ScrlLeftBound = ScrlBox.scrollLeft();
    ScrlRightBound = ScrlLeftBound + ScrlWidth;
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
        BrdrImg.css('border', ScrlFirstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    Index = (Index == Last) ? 0 : Index + 1;
    BrdrImg = Images[Index].IMG;
    Vw.attr('src', Images[Index].source);
    BrdrImg.css('border', ScrlImgBrdr);
    Title.text(Images[Index].title);

    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (RightPos > ScrlRightBound) 
        ScrlBox.scrollLeft(LeftPos);
    else if (LeftPos < ScrlLeftBound) 
        ScrlBox.scrollLeft(RightPos - ScrlWidth);      
    
}

function GoLeft() {
    if (Index == 0)
        BrdrImg.css('border', ScrlFirstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    Index = (Index == 0) ? Last : Index - 1;
    BrdrImg = Images[Index].IMG;
    Vw.attr('src', Images[Index].source);
    BrdrImg.css('border', ScrlImgBrdr);
    Title.text(Images[Index].title);

    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (LeftPos < ScrlLeftBound) 
        ScrlBox.scrollLeft(RightPos - ScrlWidth);    
    else if (RightPos > ScrlRightBound) 
        ScrlBox.scrollLeft(LeftPos); 
}

function ImgClick(i) {
    Vw.attr('src', Images[i].source);
    if (Index == 0)
        BrdrImg.css('border', ScrlFirstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    Index = i;
    BrdrImg = Images[Index].IMG;
    BrdrImg.css('border', ScrlImgBrdr);
    Title.text(Images[Index].title);

    var LeftPos = Index * ImgWidth;
    var RightPos = LeftPos + ImgWidth;
    if (RightPos > ScrlRightBound) 
        ScrlBox.scrollLeft(LeftPos);  
    else if (LeftPos < ScrlLeftBound) 
        ScrlBox.scrollLeft(RightPos - ScrlWidth);     
}

function ImgHov(i) {
    if (Images[i].IMG != BrdrImg) 
        Images[i].IMG.css('border', ScrlImgHovBrdr);
}

function ImgUnhov(i) {
    if (Images[i].IMG != BrdrImg && i == 0)
        Images[i].IMG.css('border', ScrlFirstImgBrdr);     
    else if (Images[i].IMG != BrdrImg && i != 0) 
        Images[i].IMG.css('border', 'none');
}

function ViewportHover() {
    Vw.css('border-image', VwBrdrHov);
}

function ViewportUnhover() {
    Vw.css('border-image', VwBrdrUnhov);
}