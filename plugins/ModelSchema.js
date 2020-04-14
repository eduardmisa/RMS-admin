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



export default (context, inject) => {
    inject('modelSchema', {
        Application: ApplicationSchema
    })
}
