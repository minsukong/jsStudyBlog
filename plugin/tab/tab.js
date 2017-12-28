var scope = {
    w : window,
    jQ : jQuery
};


/**
 * ----------------------------
 * @Plug-in Tab Menu Type
 * ----------------------------
 **/
(function (param) {
    
    var global = param.w,
        $      = param.jQ;
    
    var pluginName = 'uiTab';
    
    function TabPlugin($selector, options) {
        this.$selector = $selector;
        this.detect = {};
        this.config = $.extend({}, this.defaults, options || {});
        
        if (!this.$selector.length){
            return
        }else{
            this._init();
        }
    }
    
    TabPlugin.prototype = {
        constructor :  TabPlugin.prototype,
        defaults : {
            menuItemClass : '.tabItem',
            contentClass : '.panel',
            isSelected : 'is-selected',
            visibleContent : 1
        },
        _init : function () {
            this.setting();
            this._setEvent();
            this._defaultShowing();
        },
        setting : function () {
            this.detect.$selector = this.$selector;
            this.detect.$items    = this.detect.$selector.find(this.config.menuItemClass + ' a');
        },
        _setEvent : function () {
            
            var self = this;
            $(document).on('click.ui.tab', this.config.menuItemClass + ' a' , function (e) {
                e.preventDefault();
                var target     = this,
                    $showTabContent = $(target.hash);
                
                self._hidePanels($(target), $showTabContent);
                self._showPanels($(target), $showTabContent);
            })
        },
        _showPanels : function ($this, $showContent) {
            this.$targetItem.addClass(this.config.isSelected);
            $showContent.addClass(this.config.isSelected);
        },
        _hidePanels : function ($this, $showContent) {
            this.$targetItem = $this.closest('li');
            var isActived = this.$targetItem.siblings('.' + this.config.isSelected);
            
            if (!!isActived) {
                isActived.removeClass(this.config.isSelected);
            }
            
            $showContent.siblings(this.config.contentClass).removeClass(this.config.isSelected);
        },
        _defaultShowing : function () {
            this.detect.$items.eq(this.config.visibleContent - 1).trigger('click');
        }
        
    };
    
    $.fn[pluginName] = $.fn[pluginName] || function (options) {
        var $this = this;
        return $.each($this, function (idx, el) {
            var $selector = $this.eq(idx);
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new TabPlugin($selector, options));
            }
            return $selector;
        })
    };
    
    $(function () {
        /**
         * [data-*] 로 플러그인 호출 권장
         * @param @type {} : 플러그인 옵션값
         * 기본값 { menuItemClass : '.tabItem', isSelected : 'is-selected', visibleContent : 1}
         */
        
        /* // 탭 메뉴 플러그인 사용법
         $('[data-tab="***"]').koicaTabs({
            menuItemClass : ".tabItem", // 탭 메뉴의 li 클래스 사용자 정의
            isSelected : "is-selected", // 탭 메뉴 활성화 클래스
            contentClass : '.panel', // 탭 콘텐츠 클래스
            visibleContent: 1 // 처음에 보여줄 탭 메뉴 및 콘텐츠
         });
         */
        $('[data-tab="tabs"]').uiTab();
    });
    
})(scope);