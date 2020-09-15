import React from 'react';
import Helmet from 'react-helmet';
import Document, { Main, NextScript } from 'next/document';

class MyDocument extends Document { 
    static getInitialProps(context) { 
        return { helmet: Helmet.renderStatic() } 
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
            <html {...htmlAttrs}>
                <head>
                    {/* html과 body를 제외한 나머지 태그들은 head 태그에 넣기 */}
                    {Object.values(helmet).map(el => el.toComponent())} 
                </head>
                <body {...bodyAttrs}>
                    {/* Main이 app.js가 될 것이다. */}
                    <Main /> 
                    {/* Next 구동에 필요한 script를 모아둔 것 */}
                    <NextScript />
                </body>
            </html>
        )
    }
}