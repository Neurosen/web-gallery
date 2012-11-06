$(document).ready(function(){
    var current_position =  '"/' + document.URL.split('/').pop() + '"';
    $('#main_menu').find('a[href|=' + current_position + ']').parent('li').addClass('active');
});
