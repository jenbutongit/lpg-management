import {Request, Response, Router} from 'express'
import parse from 'csv-parse'

import * as log4js from 'log4js'

export class SkillsController {
	logger = log4js.getLogger('controllers/searchController')
	router: Router

	constructor() {
		this.router = Router()
		this.configureRouterPaths()
	}

	private configureRouterPaths() {
		this.router.get('/skills/', this.show())
		this.router.post('/skills/', this.uploadAndProcess())
	}

	show() {

		// TODO: list the professions in dropdown with web request
		// TODO: Upload form
		let professions: [];
		return async (request: Request, response: Response) => {
			response.render('page/skills', {
				professions
			})
		}
	}

	uploadAndProcess() {
		//TODO: take the profession ID from the request
		//TODO: Take the uploaded file
		const output = []
		let parser = parse("uploaded file");
		parser.on('readable', () => {
			let record
			while (record = parser.read()) {
				output.push(record)
				//TODO: verify the record matches what we expect maybe?
			}
		})
		parser.on('error', (err: any) => {
			console.error(err.message)
			//TODO: display error on UI
		})

		parser.on('end', () => {
			// TODO: now send the array to the API
            // TODO: send success to the UI
		})
	}


}
