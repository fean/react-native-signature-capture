#import "RSSignatureView.h"
#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RSSignatureViewManager : RCTViewManager, RCTEventEmitter <RCTBridgeModule>
@property (nonatomic, strong) RSSignatureView *signView;

-(void) saveImage:(nonnull NSNumber *)reactTag;
-(void) resetImage:(nonnull NSNumber *)reactTag;
-(void) publishSaveImageEvent:(NSString *) aTempPath withEncoded: (NSString *) aEncoded;
-(void) publishDragStartEvent;
-(void) publishDragEndEvent;
@end
