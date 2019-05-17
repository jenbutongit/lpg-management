import {NextFunction, Request, Response, Router} from 'express'
import {CsrsService} from "../csrs/service/csrsService";
import * as csvtojson from "csvtojson"

export class SkillsController {
    csrsService: CsrsService
    router: Router

    constructor(
        csrsService: CsrsService
    ) {
        this.router = Router()
        this.configureRouterPaths()
        this.csrsService = csrsService
    }

    private configureRouterPaths() {
        this.router.get('/content-management/skills', this.getSkills())
        this.router.post('/content-management/skills', this.uploadAndProcess())
    }

    getSkills() {
        return async (req: Request, res: Response) => {
            const areasOfWork = await this.csrsService.getAreasOfWork()

            res.render('page/skills/skills', areasOfWork)
        }
    }

    uploadAndProcess() {
        return async (req: Request, res: Response, next: NextFunction) => {

            // Getting CSV from file uploader, and converting into JSON
			// @ts-ignore
            csvtojson().fromString(req.files.file.data.toString('utf-8')).then((questions: any) => {
            	console.log("JSON parsed from CSV: ", questions)

				// Creating and populating array of 'Yes' answers for all questions
				let answers : string[] = []
				let i : number = 0;

            	// For each question in JSON:
				questions.forEach((question : any) => {
					i++
					let questionNumber : string = "QUESTION #" + i.toString()
					answers.push(questionNumber)

					// Check if answer exists in A,B,D,C or E
					if(question['ANSWER A']){
						answers.push(question['ANSWER A'])
					}
					if(question['ANSWER B']){
						answers.push(question['ANSWER B'])
					}
					if(question['ANSWER C']){
						answers.push(question['ANSWER C'])
					}
					if(question['ANSWER D']){
						answers.push(question['ANSWER D'])
					}
					if(question['ANSWER E']){
						answers.push(question['ANSWER E'])
					}
				})
				console.log("Array of 'Yes' answers: ", answers)
            })

			//TODO: restructure JSON to match endpoint JSON
			//TODO: verify the record matches what we expect maybe?
			//TODO: display error on UI
			// TODO: now send the array to the API
			// TODO: send success to the UI
        }
    }
}
