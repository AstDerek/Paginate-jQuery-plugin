/*
 * Paginate 0.1
 * Ast Derek
 * 19/10/2010
 */
(function($){
    var methods = {
        init: function (options) {
            return this.each(function(){
                
                var $this = $(this),
                data = $this.data('paginate');
                
                if (data) {
                    return true;
                }
                
                var settings = {
                    target: $this,
                    
                    minPages: 2,
                    driveBy: 'height',
                    
                    height: 600,
                    minHeight: 200,
                    
                    sectionSelector: 'p:has(strong:only-child)',
                    sectionIdentifier: '^\\s*\\d+',
                    sectionClass: 'tabnavigation-section-header',
                    
                    holder: '#tabnavigation',
                    nav: '#tabnavigation .tabnavigation-nav',
                    ignore: 'p.meta',
                    select: '>p, >blockquote',
                    ignoreClass: 'to-bottom',
                    
                    link: '<li><a href="#">{c}</a></li>',
                    layout: '<div id="tabnavigation">'+
                        '<a class="tabnavigation-prev tabnavigation-back" href="#">Prev</a>'+
                        '<ul class="tabnavigation-nav"></ul>'+
                        '<a class="tabnavigation-next tabnavigation-forth" href="#">Next</a>'+
                        '<div class="tabnavigation-container"><div class="tabnavigation-wrapper"></div>'+
                        '</div>'+
                        '</div>',
                    section: '<div id="section-{c}" class="tabnavigation-content"></div>',
                    
                    wrapperId: '.tabnavigation-wrapper',
                    sectionId: '#section-{c}'
                };
                
                if (options) { 
                    $.extend(settings, options,{playing: false});
                }
                
                $this.data('paginate', settings);
                
                if (settings.by === 'height') {
                    $this.paginate('_byHeight');
                }
                else if (settings.by === 'content') {
                    $this.paginate('_byContent');
                }
            });
        },
        
       destroy: function () {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('paginate');
                $(window).unbind('.paginate');
                data.paginate.remove();
                $this.removeData('paginate');
            });
        },
        
        _byHeight: function () {
            return this.each(function(){
                
                var c, h, partial, total, data, $this;
                
                $this = $(this);
                data = $this.data('paginate');
                
                c = 1;
                h = 0;
                total = 0;
                partial = 0;
                
                $(data.ignore,$this).addClass(data.ignoreClass);
                $(data.select,$this).each(function(){
                    if ($(this).hasClass(data.ignoreClass)) {
                        return true;
                    }
                    
                    total += $(this).outerHeight();
                });
                
                if (total/data.height <= data.minPages) {
                    return true;
                }
                
                $this.append(data.layout);
                
                $(data.select,$this).each(function(){
                    if ($(this).hasClass(data.ignoreClass)) {
                        return true;
                    }
                    
                    if ((total - partial) <= data.minHeight) {
                        data.minHeight += h + 10;
                    }
                    else if (h >= data.minHeight) {
                        h = 0;
                        c++;
                    }
                    
                    partial += $(this).outerHeight();
                    
                    if (!h) {
                        $(data.nav,$this).append(data.link.replace(/\{c\}/ig,c));
                        $(data.holder+' '+data.wrapperId,$this).append(data.section.replace(/\{c\}/ig,c));
                    }
                    
                    h += $(this).outerHeight();
                    $(data.holder+' '+data.sectionId.replace(/\{c\}/ig,c),$this).append($(this));
                });
                
                $('.'+data.ignoreClass,$this).insertAfter(data.holder);
            });
        },
        
        _byContent: function () {
            return this.each(function(){
                
                var c, h, total, data, $this;
                
                $this = $(this);
                data = $this.data('paginate');
                
                c = 0;
                h = 0;
                
                $(data.ignore,$this).addClass(data.ignoreClass);
                total = $(data.sectionSelector,$this).length;
                if (total <= data.minPages) {
                    return true;
                }
                
                $this.append(data.layout);
                
                if (data.sectionIdentifier) {
                    data.sectionIdentifier = new RegExp(data.sectionIdentifier,'i');
                    $(data.sectionSelector,$this).each(function(){
                        if ($(this).text().match(data.sectionIdentifier)) {
                            $(this).addClass(data.sectionClass);
                        }
                    });
                }
                else {
                    $(data.sectionSelector,$this).accClass(data.sectionClass);
                }
                
                $(data.select,$this).each(function(){
                    if ($(this).hasClass(data.ignoreClass)) {
                        return true;
                    }
                    
                    if (!c && !$(this).hasClass(data.sectionClass)) {
                        return true;
                    }
                    
                    if ($(this).hasClass(data.sectionClass)) {
                        c++;
                        $(data.nav,$this).append(data.link.replace(/\{c\}/ig,c));
                        $(data.holder+' '+data.wrapperId,$this).append(data.section.replace(/\{c\}/ig,c));
                    }
                    
                    $(data.holder+' '+data.sectionId.replace(/\{c\}/ig,c),$this).append($(this));
                });
                
                $('.'+data.ignoreClass,$this).insertAfter(data.holder);
            });
        },
        
        _dummy: function () {
            return this;
        }
    };
    
    $.fn.paginate = function (method) {
        if (methods[method]) {
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this,arguments);
        }
        else {
            $.error('Method ' +  method + ' does not exist on jQuery.paginate');
        }
    };
})(jQuery);