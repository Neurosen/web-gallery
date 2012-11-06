$(document).ready(function() {

    $('#modal_save').click(function() {

        var imageId = $('#image').attr('src').split('/').pop(),
 	    title = $('#imageTitle').val(),
            description = $('#imageDescription').val();
        $.ajax({
            url:'/editImage',
            type:'put',
            data:{
                imageId: imageId,
                title: title,
                description: description
            }
        }).success(function() {
            
            var image = $('.thumbnails').find('.thumbnail[name|="'+ imageId + '"]');
            image.find('.title').html(title);
            image.find('.description').html(description);
        });
    });
});
