
'use strict';

var ReactNative = require('react-native');
var React = require('react');
var PropTypes = require('prop-types');
var {
    requireNativeComponent,
    View,
    UIManager,
    DeviceEventEmitter
} = ReactNative;

/**
 * Return the native view manager config.
 * Use the new UIManager.getViewManagerConfig if it is available.
 * Otherwise fallback to the previous method.
 * @param {String} viewName the native view name
 */
const getViewManagerConfig = (viewName) => {
    if(typeof UIManager.getViewManagerConfig === "function") {
        return UIManager.getViewManagerConfig(viewName);
    }
    return UIManager[viewName];
}
class SignatureCapture extends React.Component {

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.subscriptions = [];
    }

    onChange(event) {
        if(event.nativeEvent.pathName){

            if (!this.props.onSaveEvent) {
                return;
            }
            this.props.onSaveEvent({
                pathName: event.nativeEvent.pathName,
                encoded: event.nativeEvent.encoded,
            });
        }

        if(event.nativeEvent.dragged){
            if (!this.props.onDragEvent) {
                return;
            }
            this.props.onDragEvent({
                dragged: event.nativeEvent.dragged
            });
        }
    }

    componentDidMount() {
        if (this.props.onSaveEvent) {
            let sub = DeviceEventEmitter.addListener(
                'onSaveEvent',
                this.props.onSaveEvent
            );
            this.subscriptions.push(sub);
        }

        if (this.props.onDragEvent) {
            let sub = DeviceEventEmitter.addListener(
                'onDragEvent',
                this.props.onDragEvent
            );
            this.subscriptions.push(sub);
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach(sub => sub.remove());
        this.subscriptions = [];
    }

    render() {
        return (
            <RSSignatureView {...this.props} onChange={this.onChange} />
        );
    }

    saveImage() {
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(this),
            getViewManagerConfig('RSSignatureView').Commands.saveImage,
            [],
        );
    }

    resetImage() {
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(this),
            getViewManagerConfig('RSSignatureView').Commands.resetImage,
            [],
        );
    }
}

SignatureCapture.propTypes = {
  ...View.propTypes,
    rotateClockwise: PropTypes.bool,
    square: PropTypes.bool,
    saveImageFileInExtStorage: PropTypes.bool,
    viewMode: PropTypes.string,
    showBorder: PropTypes.bool,
    showNativeButtons: PropTypes.bool,
    showTitleLabel: PropTypes.bool,
    maxSize:PropTypes.number,
    minStrokeWidth: PropTypes.number,
    maxStrokeWidth: PropTypes.number,
    strokeColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    compressionQuality: PropTypes.number,
    outputFormat:PropTypes.oneOf(['png', 'jpg'])
};

var RSSignatureView = requireNativeComponent('RSSignatureView', SignatureCapture, {
    nativeOnly: { onChange: true }
});

module.exports = SignatureCapture;
