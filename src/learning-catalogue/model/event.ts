import _ = require("lodash")

import {IsNotEmpty, ValidateNested} from 'class-validator'
import {DateRange} from './dateRange'
import {Venue} from './venue'
import * as moment from "moment";

export class Event {
	id: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.dateRanges'],
		message: 'validation_module_event_dateRanges_empty',
	})
	dateRanges: Array<DateRange> = []

	@ValidateNested({
		groups: ['all', 'event.all', 'event.location'],
	})
	venue: Venue

	status: Event.Status

	cancellationReason: string

	getDuration(){
		let duration = 0
    this.dateRanges.forEach( dateRange => {
			duration += extractDurationOfEvent(dateRange)
    })
    return duration
	}
}

const extractDurationOfEvent = (dateRange: DateRange) => {
	const startTime = moment(_.get(dateRange, 'startTime', 0), "HH:mm")
	const endTime = moment(_.get(dateRange, 'endTime', 0), "HH:mm")
  const duration = moment.duration(endTime.diff(startTime));
	return duration.asSeconds()
}
export namespace Event {
	export enum Status {
		ACTIVE = 'Active',
		CANCELLED = 'Cancelled',
	}
}
