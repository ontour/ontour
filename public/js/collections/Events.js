define(['backbone', 
		'models/Event'
], function(Backbone, Event) {
	'use strict';

	return Backbone.Collection.extend({
		model: Event
	});
});