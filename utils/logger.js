export const ConsoleLogger = (header, message) => {
    // console.log(`${(new Date()).toLocaleString()}: ${header}`, message ? message : '')
}

// export const FileLogger = (header, message) => {

//     if (process.server) {
//         try {
//             let text = `${(new Date()).toLocaleString()}: ${header} ${message ? message : ''}\n`
    
//             const basePath = process.cwd();
    
//             const logPAth = `${basePath}/${require('../nuxt.env.json').log_textfile}`
    
//             const { appendFileSync } = require('fs')
            
//             appendFileSync(logPAth, text); 
//         }
//         catch (error) {
//             console.log(`ERROR (FileLogger):`, error)
//         }
//         finally {
            
//         }
//     }
// }
