$(document).ready(function() {

    $('.edit_image').click(function() {

        $('#image').attr('src', $(this).parents('.thumbnail').find('.thumbnail_image').attr('href'));
        $('#imageTitle').val($(this).parents('.thumbnail').find('.title').html());
        $('#imageDescription').val($(this).parents('.thumbnail').find('.description').html());
        $('#modal_dialog').modal().css({
            
        });
        return false;
    });

    $('.delete_image').click(function() {

        var self = this;
        bootbox.confirm("Are you sure?", function(result) {

            if(result) {   
                var imageId = $(self).parents('.thumbnail').attr('name');
	        $.ajax({
                    url: '/deleteImage?imageId=' + imageId,
                    type: 'delete'
                }).success(function() {

                    $(self).parents('.thumbnail').remove();
                });
            }
        });
        return false;
    });
});
