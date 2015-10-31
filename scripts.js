// IIFE for not polluting the global namespace
(function($){
	$("#search-load").hide();
	$("#error-card").hide();
	$("#no-result-card").hide();
	$("#search_field").blur(function(event){
		searchVal = $(this).val();
		$("#autocomplete-dropdown").html("");
		if (searchVal != ""){
			$(".searchResults").html("");				
			$("#error-card").hide();
			$("#no-result-card").hide();

			$("#search-load").show();

			var $q = searchQuery(searchVal);
			$q.done(function(data){
				$("#search-load").hide();
				data.query.search.forEach(function(value){
					constructCard(value.title, value.snippet);
				});

				if (data.query.search.length == 0) {
					$("#no-result-card").show();
					$("#not-found-query").text(searchVal);
				}
			});

			$q.fail(function(){
				$("#search-load").hide();
				$("#error-card").show();
			});

			// $(".searchResults").html("");
		}	

	});



	// autocomplete suggestions 
	// $("#search_field").keypress(function(event){
	// 	var searchVal = $(this).val();
	// 	var dropdown = $("#autocomplete-dropdown");
	// 	dropdown.html("");
	// 	if (searchVal != "" && searchVal.length % 2 == 0){
	// 		var $q = searchQuery(searchVal);
	// 		$q.done(function(data){
	// 			data.query.search.forEach(function(value, index) {
	// 				// populate the dropdown list used for suggestions with items
	// 				if  (index < 5) {
	// 					var a = $("<a/>", {
	// 						text: value.title
	// 					});
	// 					dropdown.append($("<li/>", {
	// 						"class": "autocomplete-option"
	// 					}).append(a));
	// 				}
	// 			});
	// 		});
	// 	}
	// });

	// when a dropdown is clicked

	$('#search_field').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );

	function constructCard(contentTitle, contentText) {
		var wikiLink = "https://en.wikipedia.org/wiki/" + contentTitle;
		var searchResultsBox = $('.searchResults');
		var row = $("<div/>", {
			class: "row cardRow animated flipInX"
		});
		var col = $("<div/>", {
			class: "col s12"
		});
		var card = $("<div/>", {
			class: "card blue-grey darken-1"
		});
		var cardTitle = $("<span/>", {
			"class": "card-title",
			text: contentTitle
		});
		var cardParagraph = $("<p/>", {
			html: contentText + "..."
		});
		var cardContent = $("<div/>", {
			"class": "card-content white-text"
		});

		var cardAction = $("<div/>", {
			"class": "card-action"
		});
		var wikipediaLink = $("<a>", {
			"href": wikiLink,
			"text": "Visit Wikipedia Link"
		});

		// appending all the content so that all the content is the children of
		// the row
		wikipediaLink.appendTo(cardAction);
		cardTitle.appendTo(cardContent);
		cardParagraph.appendTo(cardContent);

		card.append(cardContent);
		card.append(cardAction);

		col.append(card);
		row.append(col);

		searchResultsBox.append(row);
	}

	function searchQuery(srsearch) {
		var API_ENDPOINT = "https://en.wikipedia.org/w/api.php";

		return $.ajax({
			url: API_ENDPOINT,
			data: {
				action: 'query',
				list: "search",
				srsearch: srsearch,
				format: "json"
			},
			dataType: "jsonp"
		});

	}

})(jQuery);