import {Request, Response, Router} from 'express'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {Module} from '../../learning-catalogue/model/module'
import {Validator} from '../../learning-catalogue/validator/validator'
import axios from 'axios'
import * as config from '../../config'
import {ContentRequest} from '../../extended'
import * as datetime from '../../lib/datetime'

const logger = log4js.getLogger('controllers/courseController')

export class ModuleController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		moduleValidator: Validator<Module>,
		moduleFactory: ModuleFactory
	) {
		this.learningCatalogue = learningCatalogue
		this.moduleValidator = moduleValidator
		this.moduleFactory = moduleFactory
		this.router = Router()

		this.setRouterPaths()
	}

	private setRouterPaths() {
		this.router.get('/content-management/add-module', this.getModule())
		this.router.post('/content-management/:courseId/add-module', this.setModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/add-module')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest & {files: any}

			let module: Module

			const data = {
				...req.body,
			}

			// && Object.keys(req.files).length == 0
			if (data.type == 'video') {
				const info = await this.getBasicYoutubeInfo(data.location)
				if (!info) {
					logger.error('Unable to get info on module via the Yotube API')
					response.sendStatus(500)
					return
				}

				const duration = await this.getDuration(info.id)
				if (!duration) {
					logger.error('Unable to get duration of module via the YouTube API')
					response.sendStatus(500)
					return
				}

				data.duration = duration
				data.title = data.title || info.title
			}

			data.startPage = 'Not set' // need this as placeholder or java falls over

			module = await this.moduleFactory.create(data)

			const courseId = request.params.courseId
			const course = await this.learningCatalogue.getCourse(courseId)

			course.modules.push(module)

			await this.learningCatalogue.createModule(courseId, module)

			response.redirect(`/content-management/course-preview/${courseId}`)
		}
	}

	private async getBasicYoutubeInfo(url: string): Promise<BasicInfo | undefined> {
		let response

		try {
			response = await axios.get(
				`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json&key=${
					config.YOUTUBE_API_KEY
				}`
			)
		} catch (err) {
			console.error(`Error fetching basic info from YouTube: ${err}`)
			return
		}

		if (response.status !== 200) {
			return
		}
		if (response.data.type !== 'video' && response.data.html) {
			return
		}

		const suffix = response.data.html.split('embed/')[1]
		if (!suffix) {
			return
		}
		const id = suffix.split('?')[0]
		if (!id) {
			return
		}

		return {
			height: response.data.height,
			id,
			thumbnail_height: response.data.thumbnail_height,
			thumbnail_url: response.data.thumbnail_url,
			thumbnail_width: response.data.thumbnail_width,
			title: response.data.title,
			width: response.data.width,
		}
	}

	private async getDuration(videoID: string): Promise<number | undefined> {
		let resp
		try {
			resp = await axios.get(
				`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoID}&key=${
					config.YOUTUBE_API_KEY
				}`
			)
		} catch (err) {
			console.error(`Error fetching metadata from YouTube: ${err}`)
			return
		}
		if (resp.data && resp.data.items && resp.data.items[0]) {
			return datetime.parseDuration(resp.data.items[0].contentDetails.duration)
		}
	}
}

export interface BasicInfo {
	height: number
	id: string
	thumbnail_height: string
	thumbnail_url: string
	thumbnail_width: string
	title: string
	width: number
}
