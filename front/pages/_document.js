import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document { 
    static async getInitialProps(context) { 
        const sheet = new ServerStyleSheet();
        const initialProps = await Document.getInitialProps(context);
        const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />)); //renderPage로 내부페이지를 렌더링할 수 있게함.
        //App은 app.js이고 context에서 renderPage를 해줘야 app.js를 실행할 수 있다.
        const styleTags = sheet.getStyleElement();
        return { ...initialProps, ...page, helmet: Helmet.renderStatic(), styleTags } 
        //이 page는 this.props.page에 담겨있다.
    }

    render() {
        const { htmlAttributes, bodyAttributes, ...helmet} = this.props.helmet; 
        //htmlAttributes는 html의 속성들을 helmet에서 제공(ex. lang=ko 같은 것.), bodyAttributes는 body 속성들을 helmet에서 제공
        //helmet은 메타태그, 스크립트, 스타일, 링크, 타이틀 같은 것.
        const htmlAttrs = htmlAttributes.toComponent(); //기본적으로 객체형식이기 때문에 react에서 쓸 수 있는 component 형식으로 바꿔줘야 함.
        const bodyAttrs = bodyAttributes.toComponent();
        //웹 사이트의 뼈대(html, head, body)를 직접 document에 작성해줘야 한다.
        //document를 작성하게 되면 이 부분을 직접 컨트롤 할 수있게 된다. 

        return(
            <Html {...htmlAttrs}>
                <Head>
                    {this.props.styleTags}
                    {/* html과 body를 제외한 나머지 태그들은 head 태그에 넣기 */}
                    {Object.values(helmet).map(el => el.toComponent())} 
                </Head>
                <body {...bodyAttrs}>
                    {/* Main이 app.js가 될 것이다. */}
                    <Main /> 
                    {/* ie 에서의 실행을 위해 폴리필 사용 */}
                    {process.env.NODE_ENV === 'production'
                    && <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />}
                    {/* Next 구동에 필요한 script를 모아둔 것 */}
                    <NextScript />
                </body>
            </Html>
        )
    }
}

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTags: PropTypes.object.isRequired,
}

export default MyDocument;