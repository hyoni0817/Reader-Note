import Error from 'next/error';
import React from 'react';
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {
    return (
        <div>
            <h1>{statusCode} 에러 발생</h1>
            {/* <Error statusCode={statusCode} /> */}
        </div>
    );
};

MyError.propTypes = {
    statusCode: PropTypes.number,
};

MyError.defaultProps = {
    statusCode: 400,
}

MyError.getInitialProps = async (context) => {
    const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null; //서버이면 context.res가 존재함.
    return { statusCode };
};

export default MyError;