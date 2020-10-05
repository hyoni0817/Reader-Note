const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
    //여기에 설정들을 다 넣을 수 있다.
    distDir: '.next',
    webpack(config) { //config안에 기본적인 next 설정이 들어있다. 
        console.log('config', config); //기본적인 next 설정이 console로 나옴. 
        console.log('rules', config.module.rules[0]);
        
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/), //moment github에서 이 코드 사용방법 알려줌. 이걸 사용하면 tree shakin이 됨.
        ];
        if (prod) {
            plugins.push(new CompressionPlugin()); //배포일 때만 사용, 파일 확장자를 .gz(gZip)로 만들고(ex: main.js.gz) 용량을 3분의 1로 압축시켜줌
        }

        return {
            ...config,
            mode: prod ? 'production' : 'development',
            //배포 환경인지 개발환경인지 구분해주기(배포 환경일 때는 hidden-source-map)
            devtool: prod ? 'hidden-source-map' : 'eval',
            module: {
                ...config.module,
                rules: [
                    ...config.module.rules,
                    {
                        loader: 'webpack-ant-icon-loader',
                        enforce: 'pre',
                        include: [
                            require.resolve('@ant-design/icons/lib/dist'),
                        ]
                    }
                ]
            },     
            plugins,       
        };//return으로 웹팩 설정 객체를 리턴해줘야 함.  그래서 기존 설정을 먼저 해준 다음에, 기존 설정을 덮어씌울 부분을 ...config 아래에 적어준다.
    }
})