export class Identity {
	static create(data: any) {
		const user = new Identity(
			data.uid || data.id,
			data.userName || data.username,
			data.sessionIndex,
			Array.isArray(data.roles) ? data.roles : [data.roles],
			data.accessToken
		)

		user.department = data.organisation
			? data.organisation.code
			: data.department
		user.givenName = data.fullName ? data.fullName : data.givenName
		user.grade = data.grade
		if (data.profession || data.areasOfWork) {
			user.areasOfWork = Object.values(data.profession || data.areasOfWork)
		}
		user.otherAreasOfWork = data.otherAreasOfWork
		user.interests = data.interests

		return user
	}

	readonly id: string
	readonly userName: string
	readonly sessionIndex: string
	readonly roles: string[]
	readonly accessToken: string

	department?: string
	areasOfWork?: string[]
	otherAreasOfWork?: string[]
	interests?: string[]
	givenName?: string

	grade?: string

	constructor(
		id: string,
		userName: string,
		sessionIndex: string,
		roles: string[],
		accessToken: string
	) {
		this.id = id
		this.userName = userName
		this.sessionIndex = sessionIndex
		this.roles = roles
		this.accessToken = accessToken
	}

	hasCompleteProfile() {
		//	return this.department && this.areasOfWork && this.grade
		return true
	}

	hasRole(role: string) {
		return this.roles && this.roles.indexOf(role) > -1
	}

	hasAnyRole(roles: string[]) {
		return this.roles && this.roles.some(value => roles.indexOf(value) > -1)
	}
}
