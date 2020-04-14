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
        this.name = 'Name'
        this.description = 'Description'
        this.front_icon = 'Front Icon'
        this.front_url = 'Front Url'
        this.application = 'Application'
        this.parent = 'Parent'

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
