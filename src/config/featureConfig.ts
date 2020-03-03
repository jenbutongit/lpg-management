import * as config from '../config'

export class FeatureConfig {
	agencyToggle = config.AGENCY_TOGGLE

	getFeatureToggleMap() {
		return {
			agencyToggle: this.agencyToggle,
		}
	}
}
