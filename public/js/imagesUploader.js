$(document).ready(function(){
        
	$('#addImages').click(function() {
            
            var count = $('.image').length;
	    $('#images').append(
		'<li class="image">' +
		'<i class="icon-remove deleteImage"></i>' +
		'<input type="file" name="images['+ count +']">' +
                '<label>Image title</label>' + 
                '<input type="text" name="imageTitles['+ count +']">' +
                '<label>Description</label>' +
                '<textarea name="imageDescriptions['+ count +']"></textarea>' +
		'</li>');
	});

	$('#images').on({
            click: function() {
         
	        $(this).parent('li').remove();
	        return false;
	    }
        }, '.deleteImage');
	
});
