module.exports = {
    devServer: {               
        port: 1218,
        proxy: {                 
            '/api': {             
                target: 'http://localhost:1218',    
                changeOrigin: true,              
                pathRewrite: {                   
                    '/api': '/'                     
                }
            }
        }
    }
}
