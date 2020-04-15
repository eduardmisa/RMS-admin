class ApplicationSchema  {
    constructor () {
        this.name = 'Name'
        this.description = 'Description'
        this.base_url = 'Base Url'
    }

    getHeaders () {
        let headers = []
        Object.keys(this).forEach(key => {
            headers.push({
                text: this[key], value: key
            })
        });
        return headers
    }

    clear () {
        Object.keys(this).forEach(key => {
            this[key] = null
        });
    }
}

class ModuleSchema  {
    constructor () {
        this.name =         {name:'Name', type:''}
        this.description =  {name:'Description', type:''}
        this.front_icon =   {name:'Front Icon', type:''}
        this.front_url =    {name:'Front Url', type:''}
        this.application =  {name:'Application', type: new ApplicationSchema()}
        this.parent =       {name:'Parent', type:0}
    }

    getHeaders () {
        let headers = []
        Object.keys(this).forEach(key => {
            headers.push({
                text: this[key]['name'],
                value: key,
                type: typeof(this[key]['type'])
            })
        });
        return headers
    }

    clear () {
        Object.keys(this).forEach(key => {
            this[key] = null
        });
    }
}

class EndpointSchema  {
    constructor () {
        this.method = 'Method'
        this.url = 'Url'
        this.permission = 'Permission'
        this.module = 'Module'

    }

    getHeaders () {
        let headers = []
        Object.keys(this).forEach(key => {
            headers.push({
                text: this[key], value: key
            })
        });
        return headers
    }

    clear () {
        Object.keys(this).forEach(key => {
            this[key] = null
        });
    }
}



export default (context, inject) => {
    inject('modelSchema', {
        Application: ApplicationSchema,
        Module: ModuleSchema,
        Endpoint: EndpointSchema
    })
}
