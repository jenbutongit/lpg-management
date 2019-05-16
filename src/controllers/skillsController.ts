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
            // Get profession
            // const areaOfWork = [req.body['parent']]
            // console.log("hey: ", areaOfWork)

            // Getting CSV from file uploader, and converting into JSON
			// @ts-ignore
            csvtojson().fromString(req.files.file.data.toString('utf-8')).then((questions: any) => {
                console.log(questions)
                questions.forEach((question : any) => {
                    // console.log(question['CHOICE A'])
                })
            })

			//TODO: restructure JSON to match endpoint JSON

			//TODO: verify the record matches what we expect maybe?
			//TODO: display error on UI
			// TODO: now send the array to the API
			// TODO: send success to the UI
        }
    }
}
