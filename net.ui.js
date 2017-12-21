'use strict';

define(['jquery','underscore','netComm','text!templates/lib/netUi.html'], function ($, _, netComm, netUiTemplate) {
	var netUi = {};
	var layerZIndex  = 10000;
    var IOS_TABLET_9=isIOSTablet9();
	function isIOSTablet9(){
		if(netComm.checkOS()=="ios"&&DEVICE=="tablet"){
			if(netComm.checkOSVer().split(".")[0]<10) return true;
        }
		return false;
	}
	function arrText() { // netUi 공통 다국어
		var str = arguments[0];
		var strInfo = {
			"btnConfirm"	:[polyglot.t("c_btn_confirm")	,"확인"],
			"btnCancel"		:[polyglot.t("c_btn_cancel")	,"취소"]
		};
		return (I18N) ? strInfo[str][0] : strInfo[str][1];
	}

	/*
	'@name      : netUi.template('id', {option}, 'target_id', 'prepend')
	'@desc      : 공통 템플릿 사용
	'@arguments : [0] id
				  [1] options
				  [2] target_id
				  [3] append or prepend
	*/	
	netUi.template = function(){
		var id		= arguments[0];
		var option	= arguments[1];
		var target	= arguments[2];
		var append	= arguments[3];
		append = (append == undefined || append != "prepend") ? true : false;
		target = (target == undefined  || target == "") ? $("body") : $("#"+target);		
		var temp = $("<div>"+netUiTemplate+"</div>").find("#"+id).html();
		if(append){
			target.append(_.template(temp)(option));
		}else{
			target.prepend(_.template(temp)(option));
		}
	}
	
	netUi.tab = function() {
		var id		= arguments[0];
		var options	= arguments[1];
		var _options	= {
			events : (options != undefined && options.events) ? 'click '+options.events : 'click',	//이벤트
			start : (options != undefined && options.start) ? options.start : 0, 					//시작인덱스
			callback :(options != undefined && options.callback) ? options.callback : function(){}//콜백함수
		}
		var tab_a	= $("#" + id + " a");
		var tab_li	= $("#" + id + " li");
		var tab_sub	= $("div[id^=" + id+ "Sub]");
		
		tab_li.removeClass("on").eq(_options.start).addClass("on");
		tab_sub.hide().eq(_options.start).show();
		
		tab_a.on(_options.events, function(e) {
			var idx = tab_a.index(this);
			e.preventDefault();
			tab_li.removeClass("on");
			$(this).parent().addClass("on");
			tab_sub.hide().eq(idx).show();
			return _options.callback(idx);
		});
	}
	
	netUi.body = function(){
		var targetBody = (netComm.checkBrowser()=="ie" || netComm.checkBrowser()=="firefox") ? $("html") : $("body");
		return targetBody;
	}

	netUi.goScroll = function(){
		/*
		'@name      : netUi.goScroll(target, {})
		'@desc      : 스크롤 이동
		'@arguments : [0] target
					  [1] options
		*/		
		var target		= arguments[0]; // "#divId", ".section3 a:eq(4)"
		var options		= arguments[1];
		var _options	= {
			margin 		: (options != undefined && options.margin != undefined) ? options.margin : 0,
			delay 		: (options != undefined && options.delay != undefined) ? options.delay : 300,
			speed 		: (options != undefined && options.speed != undefined) ? options.speed : 300,
			callback 	: (options != undefined && options.callback) ? options.callback : function(){}
		}
		var _appViewZoom = $("#appView").css("zoom");
		var _zoom = (_appViewZoom=="normal"||_appViewZoom==undefined) ? 1 : _appViewZoom;
		var _scrollTop;			
		setTimeout(function(){	
			if(netComm.checkBrowser()=="ie"&&_appViewZoom!="normal"){
				if(netComm.checkBrowserVer()>8){
					_zoom = parseInt(_appViewZoom.replace("%",""))/100;
				}else{
					_zoom = (parseInt(_appViewZoom)/$(window).width()).toFixed(1);
				}
				_scrollTop = (($(target).offset().top/_zoom)+(_options.margin))*_zoom;
			}else{
				_scrollTop = (($(target).offset().top)+(_options.margin))*_zoom;
			}	
			netUi.body().animate({"scrollTop":_scrollTop},_options.speed,_options.callback)
		},_options.delay)
	}

	/*
	'@name      : netUi.alert('message', {button1},{button2})
	'@desc      : 공통 얼럿
	'@arguments : [0] message
				  [1] button1 - options
				  [2] button2 - options
	*/	
	netUi.alert = function(){
		var message		= arguments[0];
		var options1	= arguments[1];
		var options2	= arguments[2];
		var _options	= {
			text1 		: (options1 != undefined && options1.text) ? options1.text : arrText("btnConfirm"),
			bg1 		: (options1 != undefined && (options1.bg == "white" || options1.bg == "blue")) ? 'bt_'+options1.bg : 'bt_gray',
			callback1 	: (options1 != undefined && options1.callback) ? options1.callback : function(){},
			text2 		: (options2 != undefined && options2.text) ? options2.text :  arrText("btnCancel"),
			bg2 		: (options2 != undefined && (options2.bg == "gray" || options2.bg == "blue")) ? 'bt_'+options2.bg : 'bt_white',
			callback2 	: (options2 != undefined && options2.callback) ? options2.callback : function(){}
		}
		if($("#popAlertMessage").length>0){ $("#popAlertMessage").remove() }
		netUi.template("netUiAlert",{message:message, button1:_options.text1, button2:_options.text2})
		if(options2 == undefined){ $("#btnAlertMessage a").eq(1).remove() }
		for(var i=0;i<$("#btnAlertMessage a").length;i++){
			$("#btnAlertMessage a").eq(i).attr({"class":eval("_options.bg"+(i+1))}).find("em").html(eval("_options.text"+(i+1)))
		}
		netUi.layer.open('popAlertMessage', { dimclose: false });
		$("#btnAlertMessage a").on("click",function(e){
			var n = $("#btnAlertMessage a").index($(e.currentTarget))
			netUi.layer.close('popAlertMessage',{"callback":{"closed":n==0? _options.callback1 : _options.callback2 }});
		})
	}

	netUi.layer = {
		/*
		'@name      : netUi.layer.open('id', options)
		'@desc      : 레이어 열기
		'@arguments : [0] 객체의 id
					  [1] options
		'@return    :
		*/
		open : function() {
			var id		= arguments[0];
			var _this	= $("#" + id);
			var options	= arguments[1];
			var _options	= {
				animate :	(options != undefined && options.animate != undefined) ? options.animate : true,	//애니메이션사용 : true(default), false
				effect :	(options != undefined && options.effect != undefined) ? options.effect : "scale",	//애니메이션효과 : scale(default)
				dimopen :	(options != undefined && options.dimopen != undefined) ? options.dimopen : true,	//dim 사용 여부 : true(default), false
				dimclose :	(options != undefined && options.dimclose != undefined) ? options.dimclose : true,	//dim 클릭 시 닫기 효과 : true(default), false
				callback :	{																					//콜백함수 : callback.opened, callback.closed
					opened : (options != undefined && options.callback != undefined && options.callback.opened != undefined) ? options.callback.opened : function(){}
				}
			}
			
			if(_options.dimclose) {
				$("#uLayerDimmed").unbind("click");
				netUi.layer.dim(layerZIndex, id, _options.dimopen).on('click', function() {
					netUi.layer.close(id, options);
				});
			} else {
				netUi.layer.dim(layerZIndex, id, _options.dimopen);
			}
							
			layerZIndex++;
            if(IOS_TABLET_9&&_this.find("select").length!=0){
                _this.addClass("ab_popup");
                netUi.layer.resize();
            }else{
                _this.css({
                    "position": "fixed",
                    "zIndex": layerZIndex,
                    "top": "50%",
                    "left": "50%",
                    "margin": "0",
                    "marginLeft": (_this.outerWidth()/2) * -1,
                    "marginTop": (_this.outerHeight()/2) * -1
                })
			}
			_this.show();
			/*
			if(_options.animate && netComm.checkOS() != "ios" && IEVersion > 9) {
				if(_options.effect=="scale") {
					_this.css({
						"transform": "scale(0)",
						"-webkitTransform": "scale(0)",
						"-mozTransform": "scale(0)",
						"-msTransform": "scale(0)",
						"transition": "transform 0.3s",
						"-webkitTransition": "-webkit-transform 0.3s",
						"-mozTransition": "-moz-transform 0.3s",
						"-msTransition": "-ms-transform 0.3s"
					}).show();
					setTimeout(function() {
						_this.css({
							"transform": "scale(1)",
							"-webkitTransform": "scale(1)",
							"-mozTransform": "scale(1)",
							"-msTransform": "scale(1)"
						});
					},50);
				} else {}
			} else {
				_this.show();
			}
			*/
			
			_this.find("*[data-layer-close='true']").on("click", {"id": id}, function(e){
				e.preventDefault();
				netUi.layer.close(e.data.id, options);				
			});			
			if( navigator.userAgent.toLowerCase().indexOf("msie 7")!=-1){
				$("#appView").css({"z-index":"1003"})
			}		
			return _options.callback.opened(_this);	
		},	

		/*
		'@name      : netUi.layer.close('id', options)
		'@desc      : 레이어 닫기
		'@arguments : [0] 객체의 id
					  [1] options
		'@return    :
		*/
		close : function() {

			var id		= arguments[0];
			var _this	= $("#" + id);
			var options	= arguments[1];
			var _options	= {
				animate :	(options != undefined && options.animate != undefined) ? options.animate : true,	//애니메이션사용 : true(default), false
				effect :	(options != undefined && options.effect != undefined) ? options.effect : "scale",	//애니메이션효과 : scale(default)
				callback :	{																					//콜백함수 : callback.opened, callback.closed
					closed : (options != undefined && options.callback != undefined && options.callback.closed != undefined) ? options.callback.closed : function(){}
				}
			}

			/*
			if(_options.animate && netComm.checkOS() != "ios" && IEVersion > 9) {
				if(_options.effect=="scale") {
					_this.css({
						"-transform": "scale(0)",
						"-webkitTransform": "scale(0)",
						"-mozTransform": "scale(0)",
						"-msTransform": "scale(0)"
					});
					setTimeout(function(){
						_this.hide();
						netUi.layer.dim(0, id, true, true).remove();
						return _options.callback.closed(_this);
					}, 100);
				}
			} else {
				_this.hide();
				netUi.layer.dim(0, id, true, true).remove();
				return _options.callback.closed(_this);
			}
			*/
			_this.hide();
			netUi.layer.dim(0, id, true, true).remove();
			if( navigator.userAgent.toLowerCase().indexOf("msie 7")!=-1){
				$("#appView").css({"z-index":"1000"})
			}			
			return _options.callback.closed(_this);
		},
		
		dim : function() {
			var dimZIndex		= arguments[0];			//dimmed Layer z-index
			var layerId			= arguments[1];			//popup layer id
			var blnDimopen		= arguments[2];			//dimed 사용 여부
			var blnDimClose		= arguments[3];			//dimed 받기 여부
			var dimmdedOpacity;
			var dimmdedBgColor;
			
			blnDimClose == undefined ? blnDimClose = false : blnDimClose = blnDimClose;;
			var dimLength = $(".dimmedLayer").length;
			if (blnDimClose == false) {
				if (blnDimopen == true) {
					for (var loopi=0;loopi<dimLength;loopi++) {
						$(".dimmedLayer").eq(loopi).css({"background-color":"#fff","opacity":"0"});
					}
				}
			} else {			
				for (var loopi=dimLength-2;loopi>=0;loopi--) {
					if ($(".dimmedLayer").eq(loopi).attr("dimmed") == "true") {
						$(".dimmedLayer").eq(loopi).css({"background-color":"#000","opacity":"0.7"});
						break;
					}
				}					
			}
			
			if(!$("#uLayerDimmed"+layerId).length) {
				var dimmed = $('<div id="uLayerDimmed'+layerId+'" class="dimmedLayer" dimmed='+blnDimopen+'/>');
				if (blnDimopen) {
					dimmdedOpacity = "0.7"
					dimmdedBgColor = "#000"
				} else {
					dimmdedOpacity = "0"
					dimmdedBgColor = "#fff"
				}
				dimmed.css({
					"position": "fixed",
					"zIndex": dimZIndex,
					"top": "0",
					"left": "0",
					"width": "100%",
					"height": "100%",
					"background": dimmdedBgColor,
					"opacity": dimmdedOpacity
				}).appendTo('#appView');
				return dimmed;
			} else {
				return $("#uLayerDimmed"+layerId);
			}
		},
		resize:function(){
			var length  =$(".ab_popup").length;
            if(length==0)return;
            var delay=100;//바로 resizeFnc 호출 하면 화면 크기를 제대로 못읽음.
            var resizeFnc=function(){
                var height_screen=$(window).height();
                var scrollTop=$("body").scrollTop();
                var gnbHeight =0;
                if($("#gnbView")!=null) {
                    gnbHeight = $("#gnbView").height();
                }
                var topPx=top+"px";
                for(var z=0; z<length; z++){
                    var item = $(".ab_popup").eq(z);
                    var height_this = item.outerHeight();
                    var top  = scrollTop + ((height_screen-height_this)/2)- gnbHeight;
                    var topPx=top+"px";
                    item.css({
                        "position": "absolute",
                        "zIndex": layerZIndex,
                        "top": topPx,
                        "left": "50%",
                        "margin": "0",
                        "marginLeft": (item.outerWidth()/2) * -1
                    })
                }
			}
			setTimeout(resizeFnc, delay);
		},
		scroll:function(e){
            if($(".dimmedLayer").length!=0)return false;
            return true;
		}
	}

	netUi.webviewZoom = function(){
		var agent = navigator.userAgent;
		var os="";
		var osVer="";
		var fIndex;
		var checkText;
		var checkTextLen;
		var checkSep;
		var minusBorder = 0;

		try {
			if( agent.match( /iPad/i ) || agent.match( /iPhone/i ) || agent.match( /iPod/i ) ){
				checkText = "OS ";
				checkSep = "_";
				os = "ios";
			}else if( agent.match( /Android/i ) ){
				checkText = "Android ";
				checkSep = ".";
				os = "aos";
			}

			fIndex = agent.indexOf(checkText);
			checkTextLen = checkText.length;
			osVer = (agent.substr(fIndex+checkTextLen,agent.indexOf(' ',fIndex+checkTextLen)-fIndex-checkTextLen));
			osVer = (osVer.substr(0,osVer.indexOf(checkSep)+2));
			if(os == "ios") osVer = osVer.replace("_",".");
			osVer = Number(osVer);
		} catch(err) {}

		function zooming(){
			var intContWidth = $(".section .cont").eq(0).width();
			var intWindowWidth = $(window).width();
			var intZoomIn, intZoomOut;

			if(intContWidth == "320"){
				intZoomIn = 480;
				intZoomOut = 320;
			}else{ // 480
				intZoomIn = 640;
				intZoomOut = 480;
			}

			if(intWindowWidth > intZoomIn){
				$("#appView").css({
					"width":intZoomIn+"px",
					"zoom":intWindowWidth/intZoomIn
				});
			}else if(intWindowWidth < intZoomOut){
				if(os=="ios"){
					$("body").css("padding","6px");
					minusBorder = 12;
				}
				$("#appView").css({
					"width":intZoomOut+"px",
					"zoom":(intWindowWidth-minusBorder)/intZoomOut
				});
			}else{
				$("#appView").css({
					"width":"100%",
					"zoom":1
				});
			}
		}

		if( (os=="aos" && osVer>=2.1) || (os=="ios" && osVer>=4.1) ){
			$(document).ready(zooming);
			$(window).resize(zooming);
		}
	}	

	var ytPlayer = [];
	var ytPlayerLoad = [];
	var ytPlayerArg;
	var ytApiLoad = false;	
	var ytVarIE = "?rel=0&autoplay=0&showinfo=0&controls=1&modestbranding=0&enablejsapi=1&loop=1&wmode='transparent'";
	netUi.youtube = {
		set : function(){
			var arg = arguments
			if(!ytApiLoad){ require(['https://www.youtube.com/iframe_api'], function(){}); }
			if(netComm.checkBrowser=="ie" && netComm.checkBrowserVer()<9 ){
				netUi.template("netUiYoutube",{yt_id:arg[1]},arg[0],"append");
				return false;
			}
			var setYoutube = function(arg){				
				var div_id	= arg[0];
				var yt_id	= arg[1];
				var options	= arg[2];
				var _options	= {
					addvars 			: (options != undefined && options.addvars) ? options.addvars : {},
					callbackReady 		: (options != undefined && options.callbackReady) ? options.callbackReady : function(){},
					callbackStateChange : (options != undefined && options.callbackStateChange) ? options.callbackStateChange : function(){}
				}				
				var defalutvars = {rel:0,autoplay:0,showinfo:0,controls:1,modestbranding:0,enablejsapi:1,loop:1,playlist:yt_id,wmode:'opaque'};
				defalutvars = _.extend(defalutvars, _options.addvars);				
				if(defalutvars.loop==0){
					defalutvars["playlist"]="";
				}				
				var ytCallbackReady = function(e){
					ytPlayerLoad[div_id] = true;					
					_options.callbackReady(e)
				}
				var ytcallbackStateChange = function(e){
				    _options.callbackStateChange(e);					
				    if (e.data==YT.PlayerState.PLAYING && DEVICE=="pc"){
				    	e.target.setPlaybackQuality('hd1080');
				    }
				}
				ytPlayer[div_id] = new YT.Player(div_id, {
					width : $("#"+div_id).width(),
					height : $("#"+div_id).height(),
					videoId: yt_id,
					playerVars:defalutvars,
					events: {
						'onReady': ytCallbackReady,
						'onStateChange': ytcallbackStateChange						
					}
				});						
			}
			if(ytApiLoad==false){					
				window.onYouTubeIframeAPIReady = function(){ ytApiLoad = true; }
			}		
			var setGo = function(){				
				if(ytApiLoad==false){
					setTimeout(function(){ setGo() },100)
				}else{					
					setYoutube(arg)
				}
			}
			setGo()
		},
		change : function() {			
			if(ytPlayerLoad[arguments[0]]){
				if(ytApiLoad==false){
					$("#"+arguments[0]).find("iframe").attr("src","http://www.youtube.com/embed/"+  arguments[1] + ytVarIE)	
				}else{
					try{
						var arrList = new Array();
						arrList.push(arguments[1])
						ytPlayer[arguments[0]].loadPlaylist(arrList).setLoop(true);
					}catch(e){}
				}
			}else{
				ytPlayerArg = arguments;				
				setTimeout(function(){
					netUi.youtube.change(ytPlayerArg[0],ytPlayerArg[1])
				},50)
			}		
		},
		play : function() { netUi.youtube.action(arguments,"play") },
		stop : function() { netUi.youtube.action(arguments,"stop") },
		pause : function() { netUi.youtube.action(arguments,"pause") },
		mute : function() { netUi.youtube.action(arguments,"mute") },
		unMute : function() { netUi.youtube.action(arguments,"unMute") },
		isMuted : function() { return netUi.youtube.action(arguments,"isMuted") },
		action : function() {
			var div_id = (arguments[0][0]).split(",");
			var act = arguments[1];						
			if(ytApiLoad==false){
				for(var i=0;i<div_id.length;i++){ 
					if(act=="stop" || act=="pause"){
						$("#"+div_id[i]).find("iframe").attr("src","")	
					}else if(act=="play"){
						$("#"+div_id[i]).find("iframe").attr("src","http://www.youtube.com/embed/"+  $("#"+div_id[i]).find("iframe").attr("mov_id") + ytVarIE)	
					}else if(act=="mute"||act=="unMute"||act=="isMute"){
						
					}
				}
			}else{
				try{
					for(var i=0;i<div_id.length;i++){
						if(act=="stop"){ ytPlayer[div_id[i]].stopVideo(); }
						else if(act=="pause"){ ytPlayer[div_id[i]].pauseVideo(); }
						else if(act=="play"){ ytPlayer[div_id[i]].playVideo(); }
						else if(act=="mute"){ ytPlayer[div_id[i]].mute(); }
						else if(act=="unMute"){ ytPlayer[div_id[i]].unMute(); }
						else if(act=="isMuted"){ return ytPlayer[div_id[i]].isMuted() }											
					}
				}catch(e){}	
			}
		}
	}	
	netUi.bgYoutube = {
		load : function() {
			if(!ytApiLoad){ require(['https://www.youtube.com/iframe_api'], function(){}); }			
			var movieId 	= arguments[0];
			var bgImage 	= arguments[1];
			var options		= arguments[2];
			var _options	= {
				cover		: (options != undefined && options.cover) ? "bg_mesh.png" : "trans.gif",
				addvars 	: (options != undefined && options.addvars) ? options.addvars : {},
				callback 	: (options != undefined && options.callback) ? options.callback : function(){}
			}
			var coverImage = "http://sgimage.netmarble.com/event/common/" + _options.cover;
			var setBgYoutube = function(){				
				if( (DEVICE=="pc" && netComm.checkBrowser()=="safari" && netComm.checkOS()=="win") || DEVICE=="tablet" ){
					$("body").css({"background":"url("+bgImage+") 50% 40px no-repeat"});
					_options.callback();	
				}else{	
					if(DEVICE=="mobile"){ return false; }
					if($("#bgYoutube").length>0){ netUi.bgYoutube.show(); return false; }
					var defalutvars = {rel:0,autoplay:1,showinfo:0,controls:0,modestbranding:0,enablejsapi:1,loop:1,playlist:movieId,wmode:'opaque'};
					defalutvars = _.extend(defalutvars, _options.addvars);				
					netUi.template("netUiBgYoutube",{width:$(window).width(), height:$(window).height(), coverImage:coverImage},"","prepend");	
					window.BG_PLAYER = new YT.Player('bgYoutubeIframe', {
						videoId: movieId,
						playerVars: defalutvars,
	          			events: {
	            			'onReady': function() {
	            				netUi.bgYoutube.resize();
								window.BG_PLAYER.mute();
								_options.callback();
							},
							'onStateChange': function(e){								
							    if (e.data==YT.PlayerState.PLAYING){
							    	e.target.setPlaybackQuality('hd1080');
							    }
							}		
	        			}					
					});
					$(window).on("resize",function(){
						netUi.bgYoutube.resize()
					});
				}
			}
			if(ytApiLoad==false){					
				window.onYouTubeIframeAPIReady = function(){ ytApiLoad = true; }
			}
			var setGo2 = function(){				
				if(ytApiLoad==false){
					setTimeout(function(){ setGo2() },100)
				}else{					
					setBgYoutube()
				}
			}
			setGo2()
		},
		resize : function(){
			var ratio = 16/9;
			var win_wd = $(window).width()
			var win_ht = $(window).height()
			if(win_wd>win_ht*ratio){					
				$("#bgYoutubeIframe").css({"width":win_wd,"height":win_wd/ratio,"margin-top":((win_wd/ratio-win_ht)/2)*-1,"margin-left":0,"z-index":-1})
			}else{
				$("#bgYoutubeIframe").css({"width":win_ht*ratio,"height":win_ht,"margin-top":0,"margin-left":((win_ht*ratio-win_wd)/2)*-1,"z-index":-1})
			}
		},
		remove 	: function(){ $("#bgYoutube").remove(); },
		play 	: function(){ try{ BG_PLAYER.playVideo(); }catch(e){} },
		pause 	: function(){ try{ BG_PLAYER.pauseVideo(); }catch(e){} },
		stop 	: function(){ try{ BG_PLAYER.stopVideo(); }catch(e){} },
		show 	: function(){ netUi.bgYoutube.play(); $("#bgYoutube").show(); },
		hide 	: function(){ netUi.bgYoutube.pause(); $("#bgYoutube").hide(); },
		getPlayTime : function() {
			var iTime;
			try {
				iTime = BG_PLAYER.getCurrentTime();
			} catch(err) {
				iTime = 0;
			}		
			return iTime;
		}
	}
	/*
	'@name      : netUi.customYoutube.set('youtubeDivId', 'youtubeId', addvars)
	'@desc      : 유튜브 스킨 적용
	'@arguments : [0] youtubeDivId
				  [1] youtubeId
				  [2] options
	*/	

    netUi.customYoutube = {
        set : function() {
            var div_id	= arguments[0];
            var yt_id	= arguments[1];
            var options	= arguments[2];
			var _options	= {
				addvars 			: (options != undefined && options.addvars) ? options.addvars : {},
				callbackReady 		: (options != undefined && options.callbackReady) ? options.callbackReady : function(){},
				callbackStateChange : (options != undefined && options.callbackStateChange) ? options.callbackStateChange : function(){}
			}
            
            var defalutvars = {controls:0};
				defalutvars = _.extend(defalutvars, _options.addvars);
            
            var isLowVer = false;
            if(netComm.checkBrowser=="ie" && netComm.checkBrowserVer() < 9 ){
                isLowVer = true;
            } 
            var div_wrap_id = div_id + "Wrap";
            $("#" + div_id).wrap("<div id='" + div_wrap_id + "' style='position:relative;width:100%;height:100%;' />");
            
            if (!isLowVer) {
                netUi.template("netUiVideoPlayer", {}, div_wrap_id, "append");
            }
            
            function customReady(event){
            	initialize(event)
            	_options.callbackReady(event)
            }
            function customChange(event){
            	onPlayerStateChange(event)
            	_options.callbackStateChange(event)
            }
            netUi.youtube.set(arguments[0], arguments[1], {addvars:defalutvars ,callbackReady:customReady, callbackStateChange:customChange});
            
            var _this = $("#" + div_wrap_id).find(".vp_controls");
            var videoCurTimer, player;
            function initialize(event) {
                player = event.target;
                
                _this.fadeIn();

                $("#" + div_wrap_id).find(".vp_btn_play").on("click", function() {
                    (_this.find(".vp_btn_play").hasClass("vp_btn_pause") ?  netUi.youtube.pause(div_id) : netUi.youtube.play(div_id) );
                })

                _this.find(".vp_btn_fullscreen").on("click", function() {fullScreenMode()});
                _this.find(".vp_player").on("click", function(e) {
                    var clickPos = e.pageX - $(this).offset().left;
                    var barRatio = ( clickPos / $(this).width());
                    var newTime = player.getDuration() * barRatio;
                    player.seekTo(newTime, true);
                })

                _this.find(".vp_btn_mute").on("click", function() {
                    $(this).toggleClass("on");
                    if (netUi.youtube.isMuted(div_id)) {
                        netUi.youtube.unMute(div_id);
                        volumeAmt.css("width",  player.getVolume()+"%");
                    } else{
                        netUi.youtube.mute(div_id);
                        volumeAmt.css("width", "0");
                    }
                });
                
                var volumeSlider = _this.find(".vp_volume_slider");
                var volumeAmt = volumeSlider.find(".vp_amount");
                volumeAmt.css("width", player.getVolume()+"%");
                volumeSlider.slider({
                    min: 0,
                    max: 100,
                    slide: function( event, ui ) {
                        var vol = ui.value;
                        player.setVolume(vol);
                        volumeAmt.css("width",  vol+"%");
                        if (vol == 0) {_this.find(".vp_btn_mute").addClass("on")}
                        else  {
                            if(netUi.youtube.isMuted(div_id)) {
                                netUi.youtube.unMute(div_id);
                            }
                            _this.find(".vp_btn_mute").removeClass("on")
                        }
                    }
                });
                $("#" + div_wrap_id + " .vp_volume").on("mouseenter", function() {
                    volumeSlider.stop().show(150);
                });
                $("#" + div_wrap_id + " .vp_volume").on("mouseleave", function() {
                    volumeSlider.stop().hide(150);
                });

                $("#" + div_wrap_id).on("mouseenter", function() {
                	_this.fadeIn();
                })
                $("#" + div_wrap_id).on("mouseleave", function() {
                	_this.fadeOut();
                })
            }
            function onPlayerStateChange(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    showPlayProgress();
                    _this.find(".vp_btn_play").addClass("vp_btn_pause");
                } else if(event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.UNSTARTED) {
                	_this.find(".vp_btn_play").removeClass("vp_btn_pause");
                    clearInterval(videoCurTimer);
                } 
            }
            function showPlayProgress() {
                videoCurTimer = setInterval(function(){
	                var progPercent = player.getCurrentTime() / player.getDuration() * 100;
	                _this.find(".vp_player_bar").css("width", progPercent + "%");
	                    
	                var time = player.getCurrentTime();
	                var sec = Math.floor(time % 60);
	                var min =  Math.floor(time / 60);
	                _this.find(".vp_time span").text(min + " : " + (sec < 10 ? '0': '' ) + sec);
                },100);
            }
            function fullScreenMode() {
                var elem = document.getElementById(div_id);
                if (elem.requestFullscreen) {
                  elem.requestFullscreen();
                }else if (elem.msRequestFullScreen) {
                  elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                  elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                  elem.webkitRequestFullscreen();
                }
            }
		},
        reset : function() {
            var div_id = arguments[0];
            var _this = $("#" + div_id).next();
            _this.find(".vp_btn_play").removeClass("vp_btn_pause");
            _this.find(".vp_player_bar").css("width", "0");
        }
    }

	netUi.bgVideo = {
		load : function() {		
			var videoUrl 	= arguments[0];
			var poster	 	= arguments[1];
			if($("#bgVideo").length<1){
				if(netComm.autoPlay()){
					netUi.template("netUiBgVideo",{"url":videoUrl},"","prepend");
					$(window).on("resize",function(){
						netUi.bgVideo.resize()
					});
				}else{
					netUi.template("netUiBgVideoCover",{"poster":poster},"","prepend");
				}
			}
		},
		resize : function(){
			var ratio = 16/9;
			var win_wd = $(window).width()
			var win_ht = $(window).height()
			if(win_wd>win_ht*ratio){					
				$("#bgVideo").css({"width":win_wd,"height":win_wd/ratio,"margin-top":((win_wd/ratio-win_ht)/2)*-1,"margin-left":0,"z-index":-1})
			}else{
				$("#bgVideo").css({"width":win_ht*ratio,"height":win_ht,"margin-top":0,"margin-left":((win_ht*ratio-win_wd)/2)*-1,"z-index":-1})
			}
		},
		remove 	: function(){ $("#bgVideo").remove(); },
		play 	: function(){ if(netComm.autoPlay()){ document.getElementById("bgVideo").play(); } },
		pause 	: function(){ if(netComm.autoPlay()){ document.getElementById("bgVideo").pause(); } },
		show 	: function(){ netUi.bgVideo.play(); $("#bgVideo").show(); },
		hide 	: function(){ netUi.bgVideo.pause(); $("#bgVideo").hide(); }
	}

	/*
	'@name      : netUi.scrollAniPerSection(".wrap.event3", [0,1000, 5520]);
	'@desc      : 마우스 스크롤로 한번으로 섹션 단위로 자동 이동
	'@arguments : [0] 마우스크스롤 event target 객체
				  [1] 각 섹션 별 시작 top값
	*/	
	netUi.scrollAniPerSection = function() {
		var oTarget				= arguments[0];
		var aScrollTopInfo		= arguments[1];
		var nWheelDelta;
		var nSectionHeight;
		var nNextPos;
		var nPosition;
		var nScrollTop;
		var nWinHeight = $(window).height();
		
		$(oTarget).on('mousewheel DOMMouseScroll', function(event) {
			nScrollTop = Math.floor($(window).scrollTop());
			//현재 섹션 번호 찾기
			nNextPos = _.find(aScrollTopInfo, function(topPos){ return topPos >  nScrollTop });
			nPosition = _.indexOf(aScrollTopInfo, nNextPos)
			nPosition = (nPosition == -1 ? aScrollTopInfo.length-1 : nPosition - 1)
			nSectionHeight =  aScrollTopInfo[nPosition+1] - aScrollTopInfo[nPosition];

			if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
				nWheelDelta = -(event.originalEvent.detail);	
			} else {
				nWheelDelta = event.originalEvent.wheelDelta;	
			}
			
			if (nWheelDelta >= 0) {
				//scroll up
				if ( (nScrollTop - nWinHeight < aScrollTopInfo[nPosition]) &&  (nScrollTop != aScrollTopInfo[nPosition])) {
					$("body").stop().animate({scrollTop:aScrollTopInfo[nPosition]}, 400);	
				}
			} else {
				if (nScrollTop + nWinHeight + 100 >= aScrollTopInfo[nPosition+1]) {
					$("body").stop().animate({scrollTop:aScrollTopInfo[nPosition+1]}, 400);
				}
			}
		});	
	}
	netUi.video = function (selector, path, options) {
		/**
		 * netUi.video(DOM 객체 셀렉터,비디오 주소,옵션객체 - { muted:true ......} -> 비디오랑 동일 프로퍼티사용)
		 * video엘리먼트 참고 - https://www.w3.org/2010/05/video/mediaevents.html
		 * 추가된 video엘리먼트 메소드 
		 * 1. playVideo -> 재생(재생안되는 엘리먼트에 대해 예외처리되어있음)
		 * 2. pauseVideo -> 일시정지 (위와동일)
		 * 3. stopVideo -> 멈춤 (위와 동일하며 기존엔 멈춤이 없음)
		 * 4. togglePlayVideo -> 재생/멈춤상태를 토글
		 * 
		 * 리턴되는 함수에  추가된 메소드
		 * changeVideo -> 비디오를 변경하는 메소드
		 * 나머지 이하는 video엘리먼트
		 */
        var videoDiv = $("#"+selector);
        var source = "";
        //video 태그 생성
        var video = document.createElement('video');
        //옵션은 videoElement랑 동일하게 한다
        var option = _.keys(options);
        //video 소스 생성
        if(typeof HLS == undefined){
        	console.log("if u use m3u8 file,need Hls module");
        }else{
        	var hls = new HLS();
        }
        for (var idx = 0; idx < option.length; idx++) {
            video[option[idx]] = options[option[idx]];
        }
        
        var isLowVer = false;
        if(netComm.checkBrowser=="ie" && netComm.checkBrowserVer() < 9 ){
            isLowVer = true;
        } 
        
        if (!isLowVer) {
            netUi.template("netUiVideoPlayer", {}, selector, "append");
        }
        //비디오 엘리먼트와 동일한 파라미터 사용
        if (HTMLElement.prototype.playVideo == undefined) {
            HTMLElement.prototype.playVideo = function () {
                if (this.play != undefined) {
                    this.play();
                    return true;
                } else {
                    console.log("maybe not videoelement");
                    return false;
                }
            }
        }
        //엘리먼트에 필요한 함수 정의
        if (HTMLElement.prototype.pauseVideo == undefined) {
            HTMLElement.prototype.pauseVideo = function () {
                if (this.pause != undefined) {
                    this.pause();
                    return true;
                } else {
                    console.log("maybe not videoelement");
                    return false;
                }
            }
        }
        if (HTMLElement.prototype.stopVideo == undefined) {
            HTMLElement.prototype.stopVideo = function () {
                if (this.pauseVideo() && !isNaN(this.duration)) {
                    this.currentTime = 0;
                }
            }
        }
        if (HTMLElement.prototype.togglePlayVideo == undefined) {
            HTMLElement.prototype.togglePlayVideo = function () {
                if (this.paused) {
                    this.playVideo();
                } else {
                    this.pauseVideo();
                }
            }
        }
        //프로그래스바 채우는 함수
        $(video).on("timeupdate", function (e) {
            var _this = e.currentTarget;
            videoDiv.find(".vp_player_bar").css("width", (_this.currentTime / _this.duration) * 100 + "%");
            videoDiv.find(".vp_time span").text(parseInt(_this.currentTime / 60) + " : " + (parseInt(_this.currentTime % 60) < 10 ? "0" + parseInt(_this.currentTime % 60) : parseInt(_this.currentTime % 60)));
        })

        //프로그레스 바 액션
        videoDiv.find(".vp_player").on(" mouseup touchend", function (e) {
            var sliderBt = e.target;
            var mousePos = e.clientX != undefined ? e.clientX : e.originalEvent.touches[0].clientX;
            var slider = videoDiv.find(".vp_player_bg");
            var amount = videoDiv.find(".vp_player_bar");
            var playCurrent = (mousePos - amount.offset().left) / slider.innerWidth();
            playControl(playCurrent);
        })
        //컨트롤 숨심 노출 처리
        videoDiv.hover(function () {
            videoDiv.find(".vp_controls").fadeIn();
        }, function () {
            videoDiv.find(".vp_controls").fadeOut();
        })
        //볼륨 엘리먼트에 마우스 올릴떄 보여주고 숨기는 함수
        videoDiv.find(".vp_volume").hover(function () {
            videoDiv.find(".vp_volume_slider").css("display", "block");
        }, function () {
            videoDiv.find(".vp_volume_slider").css("display", "none");
        })
        //오버레이 클릭시 멈춤/재생
        videoDiv.find(".vp_overlay").on("click",function(e){
        	video.togglePlayVideo();
        })
        //볼륨늘리기 줄이기 관련 함수
        videoDiv.find(".vp_volume_slider").on("mousemove touchmove", function (e) {
            console.log(e.buttons);
            if (e.buttons == 1 || (e.originalEvent.touches != undefined && e.originalEvent.touches.length == 1)) {
                var sliderBt = e.target;
                var mousePos = e.clientX != undefined ? e.clientX : e.originalEvent.touches[0].clientX;
                var slider = videoDiv.find(".vp_volume_slider");
                var amount = videoDiv.find(".vp_amount");
                var volume = (mousePos - amount.offset().left) / slider.innerWidth();
            }
        })
        //프로그레스 바와 연계된 인터렉션(넘어가기,뒤로 돌아가기)
        var playControl = function (time) {
            var amount = videoDiv.find(".vp_player_bar");
            if (time * video.currentTime <= 0) {
                amount.css("width", 0);
                video.currentTime = 0;
            } else if (time * video.currentTime >= video.duration) {
                amount.css("width", "100%");
                video.currentTime = video.duration;
            } else {
                amount.css("width", (time * 100) + "%");
                video.currentTime = video.duration * time;
            }
        }
        //비디오 재생 멈춤 아이콘
        $(video).on("playing", function () {
            videoDiv.find(".vp_btn_play").addClass("vp_btn_pause");
        })
        $(video).on("pause", function () {
            videoDiv.find(".vp_btn_play").removeClass("vp_btn_pause");
        })

        //풀스크린(IE 11외 기타 모던 브라우저)
        videoDiv.find(".vp_btn_fullscreen").on("click", function (e) {
            //TODO : video 엘리먼트인지 그걸감싸는 videoDiv인지 확인필요
            var screenStatus = (document.fullscreenEnabled || document.msFullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled);
            if (screenStatus) {
                var isFullscreen = document.webkitFullscreenElement || document.webkitFullscreenElement || document.webkitFullscreenElement || document.webkitFullscreenElement;
                if (isFullscreen) {
                    //풀스크린 종료 API 호출
                    resetFullScreen(videoDiv[0]);
                } else {
                    //풀스크린 API 호출
                    setFullScreen(videoDiv[0]);
                }
            }
        })
        //풀스크린버튼 변경 함수
        document.onwebkitfullscreenchange = function (e) {
            var fullscreenBt = videoDiv.find(".vp_btn_fullscreen");
            var isFullscreen = document.webkitFullscreenElement || document.webkitFullscreenElement || document.webkitFullscreenElement || document.webkitFullscreenElement;
            if (isFullscreen) {
                fullscreenBt.addClass("on");
            } else {
                fullscreenBt.removeClass("on");
            }
        }
        //풀스크린 관련함수
        var resetFullScreen = function (videoPlayer) {
            //웹표준에 맞게 구현했는지 확인
            var resetFullScreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || document.msExitFullscreen;
            if (resetFullScreen) {
                resetFullScreen.call(document);
            } else {
                console.log("can't exit fullscreen");
                return false;
            }
            return true;
        }
        var setFullScreen = function (videoPlayer) {
            var setFullScreen = videoPlayer.requestFullscreen || videoPlayer.webkitRequestFullscreen || videoPlayer.mozRequestFullscreen || videoPlayer.msRequestFullscreen;
            if (setFullScreen) {
                setFullScreen.call(DEVICE == "mobile" ? video : videoPlayer);
            } else {
                console.log("can't set fullscreen");
                return false;
            }
            return true;
        }

        //볼륨조절 (IE9~11)
        var volumeAmountControl = function (volume) {
            var amount = videoDiv.find(".vp_amount");
            if (!video.muted) {
                videoDiv.find(".vp_btn_mute").removeClass("on");
                if (volume <= 0.05) {
                    amount.css("width", 0);
                    video.volume = 0;
                    video.muted = true;
                    videoDiv.find(".vp_btn_mute").addClass("on");
                } else if (volume >= 0.95) {
                    amount.css("width", "100%");
                    video.volume = 1;
                    video.muted = false;
                } else {
                    amount.css("width", (volume * 100) + "%");
                    video.volume = volume;
                    video.muted = false;
                }
            } else {
                videoDiv.find(".vp_btn_mute").addClass("on");
                amount.css("width", 0);
            }
        }
        videoDiv.find(".vp_volume_slider").on("click touchstart", function (e) {
            var sliderBt = e.target;
            var mousePos = e.clientX != undefined ? e.clientX : e.originalEvent.touches[0].clientX;
            var slider = videoDiv.find(".vp_volume_slider");
            var amount = videoDiv.find(".vp_amount");
            var volume = (mousePos - amount.offset().left) / slider.innerWidth();
            video.muted = false;
            volumeAmountControl(volume);
        })
        videoDiv.find(".vp_volume_slider").on("mousemove touchmove", function (e) {
            console.log(e.buttons);
            if (e.buttons == 1 || (e.originalEvent.touches != undefined && e.originalEvent.touches.length == 1)) {
                var sliderBt = e.target;
                var mousePos = e.clientX != undefined ? e.clientX : e.originalEvent.touches[0].clientX;
                var slider = videoDiv.find(".vp_volume_slider");
                var amount = videoDiv.find(".vp_amount");
                var volume = (mousePos - amount.offset().left) / slider.innerWidth();
                video.muted = false;
                volumeAmountControl(volume);
            }
        })


        //재생 멈춤 관련 액션
        videoDiv.find(".vp_btn_play").on("click", function (e) {
            video.togglePlayVideo();
        })

        //음소거 조정
        videoDiv.find(".vp_btn_mute").on("click", function () {
            video.muted = !video.muted;
            volumeAmountControl(video.volume);
        })

        //비디오 로드 및 변경
        video.changeVideo = function(sourcePath){
        	if (HLS && sourcePath.indexOf("m3u8") != -1 && Hls.isSupported()) {
            	if(videoDiv.find("video").length==0){
                	videoDiv.prepend(video);
                }else{
                	video.src=sourcePath;
                }
            	hls.detachMedia();
        		volumeAmountControl(1);
                hls.loadSource(sourcePath);
                hls.attachMedia(video);
            } else if(netComm.checkBrowser()=="ie" && window.navigator.userAgent.indexOf("Windows NT 6.1") != -1){
            	return false;
            }else {
        		if(videoDiv.find("video").length==0){
        			videoDiv.prepend(video);
        		}
        		video.src = sourcePath;
        		volumeAmountControl(1);
            }
        	return video
        }   
        return video.changeVideo(path);
    }
	var blnAutoPlay = "";
	netUi.videoAutoPlay = function() {
		var strID 		= arguments[0];
		var callback	= arguments[1];
		
		if (blnAutoPlay == "") {
		  var video = document.createElement('video');
			video.src = 'data:video/mp4;base64,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';
			video.muted = true;
			video.setAttribute("playsinline", true);
			video.setAttribute("webkit-playsinline", true);
			video.play();
	
			video.ontimeupdate = function() {
				blnAutoPlay = "true";
				document.getElementById(strID).play();
			};
			 
			setTimeout(function() {
				if(blnAutoPlay == "") {callback()}
			},1000);
		} else {
			if (blnAutoPlay =="true") {
				document.getElementById(strID).play();
			} else {
			   callback();
			}
		}
	}

    if(IOS_TABLET_9){
        //select box error
        $(window).bind('resize', netUi.layer.resize)
        $(window, "html, body").bind("scroll",  netUi.layer.scroll);
        $(window, "html, body").bind("touchmove",  netUi.layer.scroll);
    }

    return netUi;
});
