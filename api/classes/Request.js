import Response from '@/api/classes/Response'

const consoleLogger = require('../../utils/logger').ConsoleLogger

const promiseHelper = (promiseObject) => { 

  // if (process.server) return // We don't need to track promises in Nuxt Server side

  // let existing = promiseArray.find(promiseItem => promiseItem === promiseObject)

  // ! existing ? promiseArray.push(promiseObject) : list.delete(promiseArray, { key: promiseObject })

  // promiseArray.length > 0 ? loadingCallback(true) : loadingCallback(false)

  // consoleLogger(`PROMISE ARRAY:`, promiseArray);
}
var promiseArray = []

export default class Request {
  constructor (axios, baseUrl) {
    this.axios = axios
    this.baseUrl = baseUrl

    // this.axios.defaults.headers.common['Authorization'] = 'RYKM6Aodat3Sn66KxwhMAn6nSPAdSMgt';
  }

  // Helper Methods
  slugHelper = (url, slug) => {

    if (slug) {
  
        slug = String(slug)
        
        if (!url.endsWith('/')) 
          url += '/'
  
        if (slug.startsWith('/'))
          slug = slug.substring(1, slug.length)
        
        url += slug
        
        if (!slug.endsWith('/')) 
          url += '/'
      }
  
      return url
  }
  paramsHelper = (url, params) => {
  
    // params = {key: '', value: ''}
  
    if (params) {
  
        if (!url.endsWith('/')) 
          url += '/'
  
        url += '?'
  
        params.forEach(paramObj => {
          if (paramObj.value)
            url += paramObj.key + '=' + paramObj.value + '&'
        });
  
        // Remove Trailing '&'
        url = url.substring(0, url.length - 1)
      }
  
      return url
  }
  urlHelper = ({url, slug, params}) => { return this.paramsHelper(this.slugHelper(url, slug), params) }


  // Request Methods
  async get_request ({slug, params}) {

    consoleLogger(`PROCESS OWNER:`, process.server ? 'server' : 'client');

    let furl = this.urlHelper({url: this.baseUrl, slug, params})

    consoleLogger(`GET[${furl}]: ...`)

    let response = null
    await this.axios.get(furl)
      .then(function({data}) {
        consoleLogger(`GOT[${furl}]: ${data}`);
        response = new Response(true, data, null)
      })
      .catch(function(error) {
        consoleLogger(`FAIL[${furl}]: ${error}`);
        response = new Response(false, null, error.response ? error.response.data : error)
      })
    return response
  }

  async post_request ({slug, form}) {

    consoleLogger(`PROCESS OWNER:`, process.server ? 'server' : 'client');

    let furl = this.urlHelper({url: this.baseUrl, slug})

    consoleLogger(`POST[${furl}]: ...`)

    let response = null
    await this.axios.post(furl, form)
      .then(function({data}) {
        consoleLogger(`POSTED[${furl}]: ${data}`);
        response = new Response(true, data, null)
      })
      .catch(function(error) {
        consoleLogger(`FAIL[${furl}]: ${error}`);
        response = new Response(false, null, error.response ? error.response.data : error)
      })
    return response
  }

  async put_request ({slug, form}) {

    consoleLogger(`PROCESS OWNER:`, process.server ? 'server' : 'client');

    let furl = this.urlHelper({url: this.baseUrl, slug})

    consoleLogger(`PUT[${furl}]: ...`)

    let response = null
    await this.axios.put(furl, form)
      .then(function({data}) {
        consoleLogger(`PUTTED[${furl}]: ${data}`);
        response = new Response(true, data, null)
      })
      .catch(function(error) {
        consoleLogger(`FAIL[${furl}]: ${error}`);
        response = new Response(false, null, error.response ? error.response.data : error)
      })
    return response
  }

  async patch_request ({slug, form}) {

    consoleLogger(`PROCESS OWNER:`, process.server ? 'server' : 'client');

    let furl = this.urlHelper({url: this.baseUrl, slug})

    consoleLogger(`PATCH[${furl}]: ...`)

    let response = null
    await this.axios.patch(furl, form)
      .then(function({data}) {
        consoleLogger(`PACTHED[${furl}]: ${data}`);
        response = new Response(true, data, null)
      })
      .catch(function(error) {
        consoleLogger(`FAIL[${furl}]: ${error}`);
        response = new Response(false, null, error.response ? error.response.data : error)         
      })
    return response
  }

  async delete_request ({slug}) {

    consoleLogger(`PROCESS OWNER:`, process.server ? 'server' : 'client');

    let furl = this.urlHelper({url: this.baseUrl, slug})

    consoleLogger(`PATCH[${furl}]: ...`)

    let response = null
    await this.axios.delete(furl)
      .then(function({data}) {
        consoleLogger(`DELETED[${furl}]: ${data}`);
        response = new Response(true, data, null)
      })
      .catch(function(error) {
        consoleLogger(`FAIL[${furl}]: ${error}`);
        response = new Response(false, null, error.response ? error.response.data : error)                  
      })
    return response
  }
}