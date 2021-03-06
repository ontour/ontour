'use strict';

import { View } from 'backbone.marionette';
import App from '../App';
import eventTemplate from '../templates/Event.tmpl';

export default class EventView extends View {

	constructor(props) {
		super(props);
		
		this.tagName = 'div id="event-item"';

		this.template = eventTemplate;

		this.ui = {
			saveEvent : '.save-event'
		};

		this.events = {
			'click'     		  : 'selectEvent',
			'mouseenter' 		  : 'showPopup',
			'mouseleave'  		  : 'hidePopup',
			'click @ui.saveEvent' : 'saveEvent'
		};
	}

	initialize() {
		this.addIcon();
		this.addMarker();
		this.addPopup();

		this.listenTo(this.model, 'change:filtered', this.filterEvent);
	}

	render() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

	filterEvent() {
		if (!this.model.get('filtered')) {
			this.$el.hide();
		} else {
			this.$el.show();
		}		
	}

	saveEvent(e) {
		e.stopPropagation();
		this.save();
	}

	save() {
		this.model.save({event_id: this.model.get('id')},
		{
			patch: true,
			error: function() {
				this.triggerMethod('showNotification', 'Error!');
			},
			success: function(model, response) {
				switch (response.result) {
					case 'success':
						this.triggerMethod('showNotification', 'The event is saved!');
						break;
					case 'fail':
						this.triggerMethod('showNotification', 'This event is already saved!');
						break;
					case 'guest':
						this.triggerMethod('showNotification', 'Sign in!');
						break;
				}			
			}	
		});
	}

	addIcon() {
		if (this.model.get('image')) {
			// var icon = L.icon({
			// 	iconUrl: this.model.get('image'),
			// 	iconSize: this.model.collection.param == 'geo' ? [75, 75] : [25, 25],
			// 	className: "dot"
			// });

			this.model.set('icon', icon);
		}
	}

	addMarker() {
		if (this.model.get('venue').location['geo:point']['geo:lat'] && 
			this.model.get('venue').location['geo:point']['geo:long'] &&
			this.model.get('icon')) {

			// let marker = L.marker([this.model.get('venue').location['geo:point']['geo:lat'], 
			// 			  this.model.get('venue').location['geo:point']['geo:long']],
			// 			{icon: this.model.get('icon')});

			// this.model.set('marker', marker);
				// .addTo(App.map.getMap()));

			// App.map.getCluster().addLayer(this.model.get('marker'));
		}
	}

	addPopup() {

		if(this.model.get('marker') == null) {
			return false;
		}

		// let popup = L.popup({
		// 		autoPan: false,
		// 		closeButton: false,
		// 		offset: L.point(0, this.model.collection.param == 'geo' ? -30 : -5),
		// 		closeOnClick: false,
		// 		className: 'p'+this.model.get('id')
		// 	})
		// 	.setLatLng(this.model.get('marker').getLatLng())
		// 	.setContent(this.template(this.model.toJSON()));

		// this.model.set("popup", popup);

		var actions = {
			mouseover: this.showPopup,
			mouseout: this.hidePopup,
			click: this.selectEvent
		};

		this.model.get('marker').on(actions, this);

		var self = this;

		App.map.$el.on('click', '.p'+this.model.get('id')+' .save-event', function() {
			self.save();
		});

	}

	selectEvent() {
		if (this.model.get('popup') != null) {
			if(this.model.get('selected')) {
				this.hidePopup();
				this.model.set('selected', false);
				this.triggerMethod('hideEventDetails');
			} else {
				this.showPopup();
				this.model.set('selected', true);
				App.map.getMap().panTo(this.model.get('marker').getLatLng());
				this.triggerMethod('showEventDetails', this.model);
			}
		}
		return false;
	}

	showPopup() {
		if (this.model.get('popup') != null && this.model.get('selected') == false) {
			App.map.getMap().addLayer(this.model.get('popup'));
			this.$el.addClass('selected');
			return false;
		}
	}

	hidePopup() {
		if (this.model.get('popup') != null && this.model.get('selected') == false) {
			App.map.getMap().removeLayer(this.model.get('popup'));
			this.$el.removeClass('selected');
			return false;
		}
	}

}