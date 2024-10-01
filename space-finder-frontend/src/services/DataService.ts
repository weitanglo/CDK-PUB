import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AutnService";
import { Datastack, ApiStack } from '../../../space-finder/outputs.json'
import { SpaceEntry } from "../components/model/model";


const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces' // add resources correctly

export class DataService {

    private authService: AuthService;
    private s3Client :S3Client | undefined;
    private awaRegion = 'ap-northeast-1'

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public reserveSpace(spaceId: string) {
        return spaceId;
    }

    public async getSpaces():Promise<SpaceEntry[]>{
        const getSpacesResult = await fetch(spacesUrl, {
            method: 'GET',
            headers: {
                'Authorization': this.authService.jwtToken!
            }            
        });
        const getSpacesResltJSON = await getSpacesResult.json();
        return getSpacesResltJSON;
    }

    public async createSpace(name: string, location:string, photo?: File){
        // const credentials = await this.authService.getTemporaryCredentials();
        // console.log(credentials); // for temporary credentials 
        const space = {} as any;
        space.name = name;
        space.location = location;

        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo);
            space.photoUrl = uploadUrl  
            // console.log(uploadUrl);  // for upload a file
        }
        const postResult = await fetch(spacesUrl, {
            method: 'POST',
            body: JSON.stringify(space),
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const postReultJSON = await postResult.json();
        return postReultJSON.id
        // return '123' // for creating spaces  
    }

    private async uploadPublicFile(file: File){
        const credentials = await this.authService.getTemporaryCredentials();
        if (!this.s3Client){
            this.s3Client = new S3Client({
                credentials: credentials as any,
                region: this.awaRegion
            })
        }
        const command  = new PutObjectCommand({
            Bucket: Datastack.SpaceFinderPhotosBucketName,
            Key: file.name,
            ACL: 'public-read',
            Body: file
        })
        await this.s3Client.send(command);
        return `https://${command.input.Bucket}.s3.${this.awaRegion}.amazonaws.com/${command.input.Key}`
    }

    public isAuthorized(){
        return this.authService.isAuthorized();
    }
}