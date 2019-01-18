export class Identity {
	public static readonly ORGANISATION_MANAGER = 'ORGANISATION_MANAGER'
	public static readonly CSL_AUTHOR = 'CSL_AUTHOR'
	public static readonly LEARNING_MANAGER = 'LEARNING_MANAGER'
	public static readonly LEARNING_CREATE = 'LEARNING_CREATE'
	public static readonly LEARNING_EDIT = 'LEARNING_EDIT'
	public static readonly LEARNING_DELETE = 'LEARNING_DELETE'
	public static readonly ORGANISATION_AUTHOR = 'ORGANISATION_AUTHOR'
	public static readonly PROFESSION_AUTHOR = 'PROFESSION_AUTHOR'

	readonly uid: string
	readonly roles: string[]
	readonly accessToken: string

	constructor(uid: string, roles: string[], accessToken: string) {
		this.uid = uid
		this.roles = roles
		this.accessToken = accessToken
	}

	hasRole(role: string) {
		return this.roles && this.roles.indexOf(role) > -1
	}

	hasAnyRole(roles: string[]) {
		return this.roles && this.roles.some(value => roles.indexOf(value) > -1)
	}

	isOrganisationManager() {
		return this.hasRole(Identity.ORGANISATION_MANAGER)
	}

	isLearningManager() {
		return this.hasRole(Identity.LEARNING_MANAGER)
	}

	isCslAuthor() {
		return this.hasRole(Identity.CSL_AUTHOR)
	}

	isOrganisationAuthor() {
		return this.hasRole(Identity.ORGANISATION_AUTHOR)
	}

	isProfessionAuthor() {
		return this.hasRole(Identity.PROFESSION_AUTHOR)
	}

	hasLearningCreate() {
		return this.hasRole(Identity.LEARNING_CREATE) || this.isCslAuthor() || this.isLearningManager()
	}

	hasLearningEdit() {
		return this.hasRole(Identity.LEARNING_EDIT) || this.isCslAuthor() || this.isLearningManager()
	}

	hasLearningDelete() {
		return this.hasRole(Identity.LEARNING_DELETE) || this.isCslAuthor() || this.isLearningManager()
	}
}
