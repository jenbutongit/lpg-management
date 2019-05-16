import {NextFunction, Request, Response, Router} from 'express'
// @ts-ignore
import parse from 'csv-parse'
import {CsrsService} from "../csrs/service/csrsService";

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
            // get profession
            const areaOfWork = [req.body['parent']]
            console.log("hey: ", areaOfWork)

            // get file
            // console.log(req.files.foo)

            // check if CSV
            // check if valid CSV
            //TODO: take the profession ID from the request
            //TODO: Take the uploaded file
            const output = []
            // @ts-ignore
            let parser = parse(req.files.foo);
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
}
