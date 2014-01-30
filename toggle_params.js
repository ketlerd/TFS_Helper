function toggleParams() {
	if($('.stepResults-actionParameters').css('display') === 'none') {
		$('.stepResults-actionParameters').css('display','block');
		$('.stepResults-expectedResultParameters').css('display','block'); 
	}
	else {
		$('.stepResults-actionParameters').css('display','none');
		$('.stepResults-expectedResultParameters').css('display','none');
	}
}