import { stringify } from "querystring";

export const { isArray } = Array;
export const { assign, keys } = Object;

export const getMatches = (regex: RegExp, str: string) : string[] => {
    let matches = regex.exec(str);
    let results:string[] = [];

    if (matches?.length === 0) {
        return results;
    }
    matches?.forEach(match => {
        results.push(match);
    }); 
    return results;
};

export const getLastMatch = (regex: RegExp, str: string) : string => {
    let matches = getMatches(regex, str);
    if (matches === undefined) {
        return "";
    }
    if (matches.length === 1) {
        return matches[0];
    }
    return matches[matches.length-1];
};

