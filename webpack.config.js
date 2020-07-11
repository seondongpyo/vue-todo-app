const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    // 진입점 : 프로젝트 시작 시 가장 먼저 실행될 파일
    entry: {
        app: path.join(__dirname, 'main.js')
    },
    // 결과물에 대한 설정
    output: {
        filename: '[name].js',  // = app.js
        path: path.join(__dirname, 'dist')
    },
    // *.vue 파일 처리에 대한 설정
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },    
    plugins: [
        new VueLoaderPlugin()
    ]
}