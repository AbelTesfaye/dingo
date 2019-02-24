import React, { PureComponent, PropTypes } from 'react';
import { TouchableOpacity, Image } from 'react-native';

class ImageButton extends PureComponent {

    render() {
        const {onPress, style, imageStyle, ...props} = this.props;

        return (
            <TouchableOpacity onPress={onPress} style={style}>
                <Image {...props} style={imageStyle} />
            </TouchableOpacity>
        );
    }

}

module.exports = ImageButton;