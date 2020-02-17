import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

class LoadingAnimation extends React.Component {
    render() {
        return (
            <div align="center" style={{paddingTop:'35vh'}}className='sweet-loading'>
                <ClipLoader
                    // css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#D0021B'}
                    loading={true}
                />
            </div>
        )
    }
}

export default LoadingAnimation;