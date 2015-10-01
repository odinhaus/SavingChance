$(function() {
	window.scrollReveal = new scrollReveal();
	"use strict";
	
	// PreLoader
	$(window).load(function() {
		$(".loader").fadeOut(400);
	});

	// Backstretchs
	$("#header").backstretch("images/bg.png");
	$("#services").backstretch("images/bg2.png");
	
	// Countdown
	$('.countdown').downCount({
		date: '12/01/2015 12:00:00',
		offset: -6
	});			
    
});