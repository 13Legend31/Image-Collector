var IMGs = [];
var x = 0;
var Last = 0;
var ScImgBrdr = '0.3em dotted rgb(0, 153, 255)';
var ScImgHovBrdr = '0.2em dotted rgb(0, 153, 255)';
var ScFstImgBrdr = '0.2em solid rgb(255, 200, 0)';
var VwBrdr = '0.3em solid black';
var VwBrdrHov = 'repeating-linear-gradient(45deg, purple, aqua 1%, purple 1%, aqua 12%) 10';
var VwBrdrUnhov = 'none';
var Vw;
var Title;
var BrdrImg;
var ScBx;
var ScWd;
var ScLBnd;
var ScRBnd;
var ImgWd;

function SetVar() {
    ScBx = $("#ScrollBox");
    Vw = $("#Viewport");
    Title = $("#Title");
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
            var ScIMG = $(document.createElement('img'));
            ScBx.append(ScIMG);   
            IMGs.push({
                "IMG" : ScIMG,
                "title" : key,
                "source" : val  
            });   
            var Cur = IMGs.length - 1;
            ScIMG.attr('id', key);
            ScIMG.attr('src', val);
            ScIMG.click(function() { ImgClick(Cur); });           
            ScIMG.hover(function() { ImgHov(Cur); }, function() {ImgUnhov(Cur); }); 
        });
        Last = IMGs.length - 1;
        UpdateScrollInfo();
        Vw.attr('src', IMGs[0].source);
        Vw.css('border', VwBrdr);
        BrdrImg = IMGs[0].IMG;
        BrdrImg.css('border', ScImgBrdr);
        Title.text(IMGs[0].title);
    });  
}

function UpdateScrollInfo() {
    ScWd = ScBx.width();
    ScLBnd = ScBx.scrollLeft();
    ScRBnd = ScLBnd + ScWd;
    ImgWd = parseInt(IMGs[0].IMG.css('width')) + 2 * parseInt(IMGs[0].IMG.css('margin-left'));
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
    if (x == 0)
        BrdrImg.css('border', ScFstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    x = (x == Last) ? 0 : x + 1;
    BrdrImg = IMGs[x].IMG;
    Vw.attr('src', IMGs[x].source);
    BrdrImg.css('border', ScImgBrdr);
    Title.text(IMGs[x].title);

    var LPos = x * ImgWd;
    var RPos = LPos + ImgWd;
    if (RPos > ScRBnd) 
        ScBx.scrollLeft(LPos);
    else if (LPos < ScLBnd) 
        ScBx.scrollLeft(RPos - ScWd);      
    
}

function GoLeft() {
    if (x == 0)
        BrdrImg.css('border', ScFstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    x = (x == 0) ? Last : x - 1;
    BrdrImg = IMGs[x].IMG;
    Vw.attr('src', IMGs[x].source);
    BrdrImg.css('border', ScImgBrdr);
    Title.text(IMGs[x].title);

    var LPos = x * ImgWd;
    var RPos = LPos + ImgWd;
    if (LPos < ScLBnd) 
        ScBx.scrollLeft(RPos - ScWd);    
    else if (RPos > ScRBnd) 
        ScBx.scrollLeft(LPos); 
}

function ImgClick(i) {
    Vw.attr('src', IMGs[i].source);
    if (x == 0)
        BrdrImg.css('border', ScFstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    x = i;
    BrdrImg = IMGs[x].IMG;
    BrdrImg.css('border', ScImgBrdr);
    Title.text(IMGs[x].title);

    var LPos = x * ImgWd;
    var RPos = LPos + ImgWd;
    if (RPos > ScRBnd) 
        ScBx.scrollLeft(LPos);  
    else if (LPos < ScLBnd) 
        ScBx.scrollLeft(RPos - ScWd);     
}

function ImgHov(i) {
    if (IMGs[i].IMG != BrdrImg) 
        IMGs[i].IMG.css('border', ScImgHovBrdr);
}

function ImgUnhov(i) {
    if (IMGs[i].IMG != BrdrImg && i == 0)
        IMGs[i].IMG.css('border', ScFstImgBrdr);     
    else if (IMGs[i].IMG != BrdrImg && i != 0)
        IMGs[i].IMG.css('border', 'none');
}

function ViewportHover() {
    Vw.css('border-image', VwBrdrHov);
}

function ViewportUnhover() {
    Vw.css('border-image', VwBrdrUnhov);
}