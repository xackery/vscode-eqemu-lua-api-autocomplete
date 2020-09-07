interface EQEmuTypeMap {
    [prop: string]: EQEmuType
}

interface EQEmuType {
    type?: string
    name?: string
    doc?: string
    mode?: string
    properties?: EQEmuTypeMap
    args?: EQEmuTypeMap
    returns?: string
    inherits?: string[]
}
