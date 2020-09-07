declare class EQEmuTypeMap {
    [prop: string]: EQEmuType
}

declare class EQEmuType {
    type?: string;
    name?: string;
    doc?: string;
    mode?: string;
    properties?: EQEmuTypeMap;
    args?: EQEmuTypeMap;
    returns?: string;
    inherits?: string[];
}
