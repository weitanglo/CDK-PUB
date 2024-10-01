import { SpaceEntry } from "../model/model";

export class MissingFieldError extends Error {            //customs error
    constructor(missingField: string) {
        super(`Value for ${missingField} expected`)
    }
}

export class JsonError extends Error { }

export function vailateAsSpaceEntry(arg: any) {            //the function that assert certain entries as space antry or not     
    if ((arg as SpaceEntry).location == undefined) {
        throw new MissingFieldError('location')
    }
    if ((arg as SpaceEntry).name == undefined) {
        throw new MissingFieldError('name')
    }
    if ((arg as SpaceEntry).id == undefined) {
        throw new MissingFieldError('id')
    }
}


