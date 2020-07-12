const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('@babel/polyfill');

module.exports = {
    // 진입점 : 프로젝트 시작 시 가장 먼저 실행될 파일
    entry: {
        app: [
            '@babel/polyfill',  // 구형 브라우저 지원용
            path.join(__dirname, 'main.js')
        ]
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
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,    // node_modules 폴더의 *.js 파일들은 제외
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [  // 반드시 동작하는 순서대로 입력해야 됨
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },    
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html')
        }),
        new CopyWebpackPlugin({
            patterns: [ // patterns 속성에 넣어야 됨
                {
                    from: 'assets/',    // 배포용 결과물에 복사할 파일들의 위치
                    to: ''  // '' : root 경로 (= dist/)
                }
            ]
        })
    ]
}