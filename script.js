$(function(){

    var checkCount = 0;
    $('#results').on('click', '.thumb', function(){
       var img = $(this).attr('src').split('.')[0].split('/')[1].replace('t', '');
       var cid = $(this).parent().find('p').html().split(' <')[0];
       $('#popup').fadeIn().find('img').attr('src', 'citations/' + img + '.jpg?' + Date.now()).parent().find('p').text(cid);
       $('#screenCover').fadeIn();
       $('#popupClose').delay(500).show(200);
    }).on('change', '.printCheck', function(){
        if($(this).is(':checked')){
            checkCount++
        } else {
            checkCount--
        }
        if(checkCount>0){
            var im = (checkCount === 1) ? 'Image' : 'Images';
            $('#printButton').text('Print ' + checkCount + ' Selected ' + im).fadeIn();
            $('#clearButton').delay(200).fadeIn(400)
        } else {
            $('#printButton, #clearButton').fadeOut()
        }
    }).on('click', '.prB', function(){
        var ch = $(this).parent().find('.printCheck').is(':checked');
        $(this).parent().find('.printCheck').click();
        if(!ch){
            $(this).css({'background-image': 'url("images/printerOn.png")'})
        } else {
            $(this).css({'background-image': 'url("images/printerOff.png")'})
        }
    });


    $('#searchButton').on('click', function(){

    });

    $('form').on('submit', function(){
        resetCount()
    });

    $('#screenCover, #popupClose').on('click', function(){
        if($('#expungeConfirm').is(':hidden')) {
            $('#screenCover').fadeOut();
            $('#popup').fadeOut();
            $('#popupClose').fadeOut();
        }
    });

    $('.inputs').on('input', function(){
        if ($(this).val() !== '') {
            $('.inputs').not(this).not('.expInput').prop('disabled', true);
            $('#searchButton').fadeIn();
            if ($('.docket').val() !== '') {
                $('#expungeSection').fadeIn();
            }
        } else {
            $('.inputs').prop('disabled', false);
            $('#searchButton, #expungeSection').fadeOut();
        }
    }).on('focusin', function(){
        $(this).closest('.items').find('.label').animate({'top': 10, 'color': '#2E8B57', 'font-size': 12}, 200)
    }).on('focusout', function(){
        if($(this).val() === ''){
            $(this).closest('.items').find('.label').animate({'top': 27, 'color': '#808080', 'font-size': 16}, 200)
        } else {
            $(this).closest('.items').find('.label').animate({'color': '#808080'}, 200)
        }
    });

    $('#printButton').on('click', function(){
        var checked = [];
        $('div#multiPrint').html('');
        checked = $('input:checkbox:checked.printCheck').map(function () {
            return $(this).closest('.citations').find('.thumb').attr('src').split('.')[0].split('/')[1].replace('t', '');
        }).get();
        checked.forEach(function(e){
            $('#multiPrint').append('<img src="citations/' + e + '.jpg?">' + Date.now())
        });
        $('#multiPrint').printThis({
            removeInline: true,
            loadCSS: 'css/check.css'
        });
        setTimeout(function(){$('#multiPrint').html('')}, 5000)
    });

    $('#clearButton').on('click', function(){
        $('.printCheck').prop('checked', false);
        $('.prB').css({'background-image': 'url("images/printerOff.png")'});
        resetCount()
    });

    $('#popupPrintButton').on('click', function(){
        $('div#popup>img').printThis({
            removeInline: true,
            loadCSS: 'css/check.css'
        });
    });

    $('#expungeButton').on('click', function(){
        $('div#expungeHeader span').html($('.docket').val());
        $('#screenCover, #expungeConfirm').fadeIn();
    });

    $('.expInput').on('input', function(){
        if($(this).val() !== ''){
            $('#expungeConfirmButton').fadeIn().css("display","inline-block")
        } else {
            $('#expungeConfirmButton').fadeOut()
        }
    }).on('focusin', function(){
        $(this).closest('.items').find('.label').animate({'top': 10, 'color': '#2E8B57', 'font-size': 12}, 200)
    }).on('focusout', function(){
        if($(this).val() === ''){
            $(this).closest('.items').find('.label').animate({'top': 27, 'color': '#808080', 'font-size': 16}, 200)
        } else {
            $(this).closest('.items').find('.label').animate({'color': '#808080'}, 200)
        }
    });

    $('#expungeCancelButton').on('click', function(){
        $('.expInput').val('').closest('.items').find('.label').animate({'top': 27, 'color': '#808080', 'font-size': 16}, 200);
        $('#screenCover, #expungeConfirm, #expungeConfirmButton').fadeOut();
    });

    function resetCount(){
        checkCount = 0;
        $('#printButton, #clearButton').fadeOut()
    }
});

