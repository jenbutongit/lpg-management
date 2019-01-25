export class Identity {
	public static readonly LEARNER = 'LEARNER'
	public static readonly ORGANISATION_MANAGER = 'ORGANISATION_MANAGER'
	public static readonly CSL_AUTHOR = 'CSL_AUTHOR'
	public static readonly LEARNING_MANAGER = 'LEARNING_MANAGER'
	public static readonly LEARNING_CREATE = 'LEARNING_CREATE'
	public static readonly LEARNING_EDIT = 'LEARNING_EDIT'
	public static readonly LEARNING_DELETE = 'LEARNING_DELETE'
	public static readonly ORGANISATION_AUTHOR = 'ORGANISATION_AUTHOR'
	public static readonly PROFESSION_AUTHOR = 'PROFESSION_AUTHOR'
	public static readonly LEARNING_PUBLISH = 'LEARNING_PUBLISH'
	public static readonly LEARNING_ARCHIVE = 'LEARNING_ARCHIVE'
	public static readonly SUPPLIER_AUTHOR = 'SUPPLIER_AUTHOR'

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

	isSuperUser() {
		return this.isCslAuthor() || this.isLearningManager()
	}

	isOrganisationAuthorOrSuperUser() {
		return this.hasRole(Identity.ORGANISATION_AUTHOR) || this.isSuperUser()
	}

	isOrganisationAuthor() {
		return this.hasRole(Identity.ORGANISATION_AUTHOR)
	}

	isProfessionAuthorOrSuperUser() {
		return this.hasRole(Identity.PROFESSION_AUTHOR) || this.isSuperUser()
	}

	isProfessionAuthor() {
		return this.hasRole(Identity.PROFESSION_AUTHOR)
	}

	isSupplierAuthorOrSuperUser() {
		return this.hasRole(Identity.SUPPLIER_AUTHOR) || this.isSuperUser()
	}

	isSupplierAuthor() {
		return this.hasRole(Identity.SUPPLIER_AUTHOR)
	}

	hasLearningCreate() {
		return this.hasRole(Identity.LEARNING_CREATE) || this.isSuperUser()
	}

	hasLearningEdit() {
		return this.hasRole(Identity.LEARNING_EDIT) || this.isSuperUser()
	}

	hasLearningDelete() {
		return this.hasRole(Identity.LEARNING_DELETE) || this.isSuperUser()
	}

	hasLearningPublish() {
		return this.hasRole(Identity.LEARNING_PUBLISH) || this.isSuperUser()
	}

	hasLearningArchive() {
		return this.hasRole(Identity.LEARNING_ARCHIVE) || this.isSuperUser()
	}
}
