var entityMap;
entityMap = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'};
    var escapeHtml = function(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

//Code Change
$('.box .listArea > dd').not('.guide-description')
    .each(function(){
        var desc = $(this).data('description');
        var $iframe = $(this).find('iframe');
        var $code = $(this).siblings('dt').find('code');

        if(!$iframe.length){
            var sample = escapeHtml(String($(this).html()));
            $code.append(sample);
        }else{
            var src = $iframe.attr('src');
            var link = '<a href="' + src + '" target="_blank">소스 바로 가기</a>';
            $code.append(link);
        }
        if(desc) $(this).prepend('<p class="g-desc">' + desc + '</p>');
    })

$('.box').on('click','.btn-view-source',function(){
    $(this).toggleClass('is-active');
});

$('.box:not(.fold)').find('.listArea:not([aria-expanded=true]) > dt').prepend('<button class="btn-view-source"><span></span></button>');
$('.box:not(.fold)').find('.listArea[aria-expanded=true] > dt').prepend('<button class="btn-view-source is-active"><span></span></button>');