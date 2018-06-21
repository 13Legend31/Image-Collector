var IMGs = [];
var x = 0;
var Last = 0;
var Wndw = $(window);
var TopBar;
var InputBx;
var JSON;
var BrdrImg;
var ScImgBrdr = '0.3em dotted rgb(0, 153, 255)';
var ScImgHovBrdr = '0.2em dotted rgb(0, 153, 255)';
var ScFstImgBrdr = '0.2em solid rgb(255, 200, 0)';
var Title;
var Vw;
var VwBrdr = '0.3em solid black';
var VwBrdrHov = 'repeating-linear-gradient(45deg, purple, aqua 1%, purple 1%, aqua 12%) 10';
var VwBrdrUnhov = 'none';
var ScBx;
var ScWd;
var ScLBnd;
var ScRBnd;
var ScImgWd;

function SetVar() {
    TopBar = $("#TopBar");
    InputBx = $("#JSON");
    ScBx = $("#ScBox");
    Vw = $("#Vw");
    Title = $("#Title");
}

function UpdateSizes() {
    Title.css('font-size', Math.min(Wndw.width(), Wndw.height()) * 0.062);
}

function LoadPics() {
    ScBx.empty();
    IMGs = [];
    $.getJSON(JSON, function(data) {
        $.each(data, function(key, val) {
            var ScIMG = $(document.createElement('img'));
            ScBx.append(ScIMG);   
            IMGs.push({
                "IMG" : ScIMG,
                "title" : key,
                "src" : val  
            });   
            var Cur = IMGs.length - 1;
            ScIMG.attr('id', key);
            ScIMG.attr('src', val);
            ScIMG.click(function() { ImgClick(Cur); });           
            ScIMG.hover(function() { ImgHov(Cur); }, function() {ImgUnhov(Cur); }); 
        });
        Last = IMGs.length - 1;
        Vw.attr('src', IMGs[0].src);
        Vw.css('border', VwBrdr);
        BrdrImg = IMGs[0].IMG;
        BrdrImg.css('border', ScImgBrdr);
        Title.text(IMGs[0].title);
        UpdateScrollInfo();
    });  
}

function UpdateScrollInfo() {
    ScWd = ScBx.width();
    ScLBnd = ScBx.scrollLeft();
    ScRBnd = ScLBnd + ScWd;
    if (IMGs.length > 0)
        ScImgWd = parseInt(IMGs[0].IMG.css('width')) + 2 * parseInt(IMGs[0].IMG.css('margin-left'));
}

function AddEventListeners() {
    window.addEventListener("keydown", function(event) { 
        if (event.keyCode == 39) 
            GoRight();
        else if (event.keyCode == 37) 
            GoLeft();
        else if (event.keyCode == 13) 
            LoadJSON();
    });
    window.addEventListener('mousewheel', function(e) {
        if (e.wheelDelta < 0) 
            GoRight(); 
        else 
            GoLeft();
    });
}


function BtnHov(ID) {
    $("#" + ID).css('opacity', 1);
}

function BtnUnhov(ID) {
    $("#" + ID).css('opacity', 0.4);
    if (ID == "LB" || ID == "RB") {
        $("#" + ID).css('width', '7%');
        $("#" + ID).css('height', '14%');
    }
}

function BtnMDown(ID) {
    if (ID == "LB" || ID == "RB") {
        $("#" + ID).css('width', '9%');
        $('#' + ID).css('height', '18%');
    }
}

function BtnMUp(ID) {
    if (ID == "LB" || ID == "RB") {
        $("#" + ID).css('width', '7%');
        $("#" + ID).css('height', '14%');
    }
}

function GoRight() {
    if (IMGs.length != 0) {
        if (x == 0)
            BrdrImg.css('border', ScFstImgBrdr);
        else 
            BrdrImg.css('border', 'none');
        x = (x == Last) ? 0 : x + 1;
        BrdrImg = IMGs[x].IMG;
        Vw.attr('src', IMGs[x].src);
        BrdrImg.css('border', ScImgBrdr);
        Title.text(IMGs[x].title);

        var LPos = x * ScImgWd;
        var RPos = LPos + ScImgWd;
        if (RPos > ScRBnd) 
            ScBx.scrollLeft(LPos);
        else if (LPos < ScLBnd) 
        ScBx.scrollLeft(RPos - ScWd);      
    }   
    
}

function GoLeft() {
    if (IMGs.length != 0) {
        if (x == 0)
            BrdrImg.css('border', ScFstImgBrdr);
        else 
            BrdrImg.css('border', 'none');
        x = (x == 0) ? Last : x - 1;
        BrdrImg = IMGs[x].IMG;
        Vw.attr('src', IMGs[x].src);
        BrdrImg.css('border', ScImgBrdr);
        Title.text(IMGs[x].title);

        var LPos = x * ScImgWd;
        var RPos = LPos + ScImgWd;
        if (LPos < ScLBnd) 
            ScBx.scrollLeft(RPos - ScWd);    
        else if (RPos > ScRBnd) 
            ScBx.scrollLeft(LPos); 
    }
}

function ImgClick(i) {
    Vw.attr('src', IMGs[i].src);
    if (x == 0)
        BrdrImg.css('border', ScFstImgBrdr);
    else 
        BrdrImg.css('border', 'none');
    x = i;
    BrdrImg = IMGs[x].IMG;
    BrdrImg.css('border', ScImgBrdr);
    Title.text(IMGs[x].title);

    var LPos = x * ScImgWd;
    var RPos = LPos + ScImgWd;
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

function ViewHov() {
    Vw.css('border-image', VwBrdrHov);
}

function ViewUnhov() {
    Vw.css('border-image', VwBrdrUnhov);
}

function LoadJSON() {
    if (InputBx.val() != "") {
        JSON = InputBx.val();
        InputBx.val("");
        LoadPics();
    }
}

function Reveal() {
    TopBar.css('z-index', 2);
}

function Hide() {
    TopBar.css('z-index', -2);
}