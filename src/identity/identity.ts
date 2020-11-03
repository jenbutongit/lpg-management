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
	public static readonly KPMG_SUPPLIER_AUTHOR = 'KPMG_SUPPLIER_AUTHOR'
	public static readonly KORNFERRY_SUPPLIER_AUTHOR = 'KORNFERRY_SUPPLIER_AUTHOR'
	public static readonly KNOWLEDGEPOOL_SUPPLIER_AUTHOR = 'KNOWLEDGEPOOL_SUPPLIER_AUTHOR'
	public static readonly LEARNING_PROVIDER_MANAGER = 'LEARNING_PROVIDER_MANAGER'
	public static readonly SKILLS_MANAGER = 'SKILLS_MANAGER'
	public static readonly CSHR_REPORTER = 'CSHR_REPORTER'
	public static readonly DOWNLOAD_BOOKING_FEED = 'DOWNLOAD_BOOKING_FEED'
	public static readonly IDENTITY_DELETE = 'IDENTITY_DELETE'
	public static readonly IDENTITY_MANAGER = 'IDENTITY_MANAGER'
	public static readonly KORNFERRY_SUPPLIER_REPORTER = 'KORNFERRY_SUPPLIER_REPORTER'
	public static readonly KPMG_SUPPLIER_REPORTER = 'KPMG_SUPPLIER_REPORTER'
	public static readonly MANAGE_CALL_OFF_PO = 'MANAGE_CALL_OFF_PO'
	public static readonly ORGANISATION_REPORTER = 'ORGANISATION_REPORTER'
	public static readonly PROFESSION_MANAGER = 'PROFESSION_MANAGER'
	public static readonly PROFESSION_REPORTER = 'PROFESSION_REPORTER'

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

	hasAnyAdminRole() {
		// i.e. isn't just a LEARNER who navigated to the admin app by modifying the URL
		return this.hasAnyRole([Identity.CSHR_REPORTER,
			Identity.CSL_AUTHOR,
			Identity.DOWNLOAD_BOOKING_FEED,
			Identity.IDENTITY_DELETE,
			Identity.IDENTITY_MANAGER,
			Identity.KNOWLEDGEPOOL_SUPPLIER_AUTHOR,
			Identity.KORNFERRY_SUPPLIER_AUTHOR,
			Identity.KORNFERRY_SUPPLIER_REPORTER,
			Identity.KPMG_SUPPLIER_AUTHOR,
			Identity.KPMG_SUPPLIER_REPORTER,
			Identity.LEARNING_ARCHIVE,
			Identity.LEARNING_CREATE,
			Identity.LEARNING_DELETE,
			Identity.LEARNING_EDIT,
			Identity.LEARNING_MANAGER,
			Identity.LEARNING_PUBLISH,
			Identity.MANAGE_CALL_OFF_PO,
			Identity.ORGANISATION_AUTHOR,
			Identity.ORGANISATION_MANAGER,
			Identity.ORGANISATION_REPORTER,
			Identity.PROFESSION_AUTHOR,
			Identity.PROFESSION_MANAGER,
			Identity.PROFESSION_REPORTER
		])
	}

	hasEventViewingRole() {
		// coarse-grained check for general permission to view events
		return this.hasAnyRole([Identity.CSL_AUTHOR, Identity.LEARNING_MANAGER]) || this.isSupplierAuthor()
	}

	isOrganisationManager() {
		return this.hasRole(Identity.ORGANISATION_MANAGER)
	}

	isOrganisationManagerOrSuperUser() {
		return this.hasRole(Identity.ORGANISATION_MANAGER) || this.isSuperUser()
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

	isSupplierAuthor() {
		return this.hasRole(Identity.KPMG_SUPPLIER_AUTHOR) || this.hasRole(Identity.KNOWLEDGEPOOL_SUPPLIER_AUTHOR) || this.hasRole(Identity.KORNFERRY_SUPPLIER_AUTHOR)
	}

	isLearningProviderManager() {
		return this.hasRole(Identity.LEARNING_PROVIDER_MANAGER)
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

	isLearner() {
		return this.hasRole(Identity.LEARNER)
	}

	isCshrReporter() {
		return this.hasRole('CSHR_REPORTER')
	}

	isProfessionReporter() {
		return this.hasRole('PROFESSION_REPORTER')
	}

	isOrganisationReporter() {
		return this.hasRole('ORGANISATION_REPORTER')
	}

	isKPMGSupplierReporter() {
		return this.hasRole('KPMG_SUPPLIER_REPORTER')
	}

	isKornferrySupplierReporter() {
		return this.hasRole('KORNFERRY_SUPPLIER_REPORTER')
	}

	isSkillsManagerOrSuperUser() {
		return this.hasRole(Identity.SKILLS_MANAGER) || this.isSuperUser() || this.isCshrReporter() || this.isOrganisationReporter() || this.isProfessionReporter()
	}
}
