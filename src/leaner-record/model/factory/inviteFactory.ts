import {Invite} from '../invite'

export class InviteFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		let invite: Invite = new Invite()

		invite.id = data.id
		invite.eventId = data.eventId
		invite.learnerEmail = data.learnerEmail

		return invite
	}
}
