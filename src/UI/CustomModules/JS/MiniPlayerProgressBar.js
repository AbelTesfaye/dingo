
import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export class MiniPlayerProgressBar extends Component {

    render() {
        let progress = this.props.progress * 100;
        let buffered = this.props.bufferedProgress * 100;
        buffered -= progress;
        if(buffered < 0) buffered = 0;

        return (
            <View style={styles.view}>
                <TouchableWithoutFeedback>
                    <View style={styles.bar}>
                        <View style={[{width: progress + '%'}, styles.played]} />
                        <View style={[{width: buffered + '%'}, styles.buffered]} />
                    
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%'
    },
    info: {
        color: '#c0c0c0',
        fontSize: 16,
        fontWeight: '300',
    },
    bar: {
        backgroundColor: '#eee',
        height: 5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    played: {
        backgroundColor: '#3f3f3f',
        height: 5
    },
    buffered: {
        backgroundColor: '#aaa',
        height: 5
    }
});

