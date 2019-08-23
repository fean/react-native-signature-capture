#import "RSSignatureViewManager.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@implementation RSSignatureViewManager
{
    bool hasListeners;
}

@synthesize bridge = _bridge;
@synthesize signView;

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(rotateClockwise, BOOL)
RCT_EXPORT_VIEW_PROPERTY(square, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showBorder, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showNativeButtons, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showTitleLabel, BOOL)
RCT_EXPORT_VIEW_PROPERTY(compressionQuality, double)
RCT_EXPORT_VIEW_PROPERTY(outputFormat, NSString)
RCT_EXPORT_VIEW_PROPERTY(maxSize, CGFloat)

-(dispatch_queue_t) methodQueue
{
	return dispatch_get_main_queue();
}

-(UIView *) view
{
	self.signView = [[RSSignatureView alloc] init];
	self.signView.manager = self;
	return signView;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onDragStart", @"onDragEnd", "onSave"];
}

// Both of these methods needs to be called from the main thread so the
// UI can clear out the signature.
RCT_EXPORT_METHOD(saveImage:(nonnull NSNumber *)reactTag) {
	dispatch_async(dispatch_get_main_queue(), ^{
		[self.signView saveImage];
	});
}

RCT_EXPORT_METHOD(resetImage:(nonnull NSNumber *)reactTag) {
	dispatch_async(dispatch_get_main_queue(), ^{
		[self.signView erase];
	});
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

-void sendEvent

-(void) publishSaveImageEvent:(NSString *) aTempPath withEncoded: (NSString *) aEncoded {
    if (!hasListeners) {
        return;
    }

    [self sendEventWithName: @"onSave" body: @{ @"pathName": aTempPath, @"encoded": aEncoded }];
}

-(void) publishDragStartEvent {
    if (!hasListeners) {
        return;
    }

    [self sendEventWithName: @"onDragStart"];
}

-(void) publishDragEndEvent {
    if (!hasListeners) {
        return;
    }

    [self sendEventWithName: @"onDragEnd"];
}

@end
