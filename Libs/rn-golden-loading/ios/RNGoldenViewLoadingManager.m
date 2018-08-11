
#import "RNGoldenViewLoadingManager.h"
#import "GoldenLoadingView.h"
#import <React/RCTConvert.h>

@implementation RNGoldenViewLoadingManager {
//    GoldenLoadingView *_view;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

-(GoldenLoadingView *)view {
    GoldenLoadingView *view = [[GoldenLoadingView alloc] init];
    return view;
}

RCT_CUSTOM_VIEW_PROPERTY(image, UIImage, GoldenLoadingView)
{
    UIImage *img = [RCTConvert UIImage:json];
    [view setImage:img];
}

@end
  
