
'use strict';

const ReactNative = require('react-native');
const React = require('react');
const PropTypes = require('prop-types');
const {
    requireNativeComponent,
    View,
    UIManager,
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Platform,
} = ReactNative;

const { RSSignatureView: NativeSignatureModule } = NativeModules;

const eventEmitter = Platform.OS === 'ios'
    ? new NativeEventEmitter(NativeSignatureModule)
    : DeviceEventEmitter;
const RSSignatureView = requireNativeComponent('RSSignatureView', SignatureCapture);

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
    subscriptions = [];

    componentDidMount() {
        if (this.props.onSaveEvent) {
            this.addListener('onSave', this.props.onSaveEvent)
        }

        if (this.props.onStartDrag) {
            this.addListener('onDragStart', this.props.onDragStart)
        }

        if (this.props.onEndDrag) {
            this.addListener('onDragEnd', this.props.onDragEnd)
        }

        // Support for legacy API
        if (this.props.onDragEvent) {
            this.addListener('onDragEnd', this.props.onDragEvent)
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach(sub => sub.remove());
        this.subscriptions = [];
    }

    addListener = (eventName, handler) => {
        const sub = eventEmitter.addListener(eventName, handler);
        this.subscriptions.push(sub);
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

    render() {
        return (
            <RSSignatureView {...this.props} />
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
    outputFormat:PropTypes.oneOf(['png', 'jpg']),
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onSaveEvent: PropTypes.func,
};

module.exports = SignatureCapture;
