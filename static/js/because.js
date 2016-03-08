$(document).ready(function() {
	$('#dream-text-field').focus();
});
$(document).ready(function() {
	$('#dream-text-field').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault()
			$("#form-container").html("<p style='margin-left:-20px;'><em>I want to</em></p>");
		}
	});
});