const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = withBundleAnalyzer({
    //여기에 설정들을 다 넣을 수 있다.
    distDir: '.next',
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
        analyzerMode: 'static',
        reportFilename: '../bundles/server.html'
        },
        browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
        }
    },
    webpack(config) { //config안에 기본적인 next 설정이 들어있다. 
        console.log('config', config); //기본적인 next 설정이 console로 나옴. 
        console.log('rules', config.module.rules[0]);
        
        const prod = process.env.NODE_ENV === 'production';

        return {
            ...config,
            mode: prod ? 'production' : 'development',
            //배포 환경인지 개발환경인지 구분해주기(배포 환경일 때는 hidden-source-map)
            devtool: prod ? 'hidden-source-map' : 'eval',
        };//return으로 웹팩 설정 객체를 리턴해줘야 함.  그래서 기존 설정을 먼저 해준 다음에, 기존 설정을 덮어씌울 부분을 ...config 아래에 적어준다.
    }
})