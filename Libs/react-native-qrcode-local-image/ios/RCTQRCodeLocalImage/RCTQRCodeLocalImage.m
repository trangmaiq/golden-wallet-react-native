//
//  RCTQRCodeLocalImage.m
//  RCTQRCodeLocalImage
//
//  Created by fangyunjiang on 15/11/4.
//  Copyright (c) 2015年 remobile. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>
#import "RCTQRCodeLocalImage.h"

@implementation RCTQRCodeLocalImage
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(decode:(NSString *)path callback:(RCTResponseSenderBlock)callback)
{
    UIImage *srcImage;
    if ([path hasPrefix:@"http://"] || [path hasPrefix:@"https://"]) {
        srcImage = [UIImage imageWithData: [NSData dataWithContentsOfURL:[NSURL URLWithString: path]]];
    } else {
        NSLog(@"%@", [NSData dataWithContentsOfURL:[NSURL fileURLWithPath:path]]);
        
//        srcImage = [UIImage imageWithData: [NSData dataWithContentsOfURL:[NSURL fileURLWithPath:path]]];
        [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:path] callback:^(NSError *error, UIImage *srcImage) {
            NSDictionary *detectorOptions = @{@"CIDetectorAccuracy": @"CIDetectorAccuracyHigh"};
            CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:detectorOptions];
            CIImage *image = [CIImage imageWithCGImage:srcImage.CGImage];
            NSArray *features = [detector featuresInImage:image];
            if (0==features.count) {
                NSLog(@"PROBLEM! Feature size is zero!\n");
                callback(@[RCTMakeError(@"Feature size is zero!", nil, nil)]);
                return;
            }
            
            CIQRCodeFeature *feature = [features firstObject];
            
            NSString *result = feature.messageString;
            NSLog(@"result: %@", result);
            
            if (result) {
                callback(@[[NSNull null], result]);
            } else {
                callback(@[RCTMakeError(@"QR Parse failed!", nil, nil)]);
                return;
            }
        }];
        
        return;
    }
    if (nil==srcImage){
        NSLog(@"PROBLEM! IMAGE NOT LOADED\n");
        callback(@[RCTMakeError(@"IMAGE NOT LOADED!", nil, nil)]);
        return;
    }
    NSLog(@"OK - IMAGE LOADED\n");
    NSDictionary *detectorOptions = @{@"CIDetectorAccuracy": @"CIDetectorAccuracyHigh"};
    CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:detectorOptions];
    CIImage *image = [CIImage imageWithCGImage:srcImage.CGImage];
    NSArray *features = [detector featuresInImage:image];
    if (0==features.count) {
        NSLog(@"PROBLEM! Feature size is zero!\n");
        callback(@[RCTMakeError(@"Feature size is zero!", nil, nil)]);
        return;
    }
    
    CIQRCodeFeature *feature = [features firstObject];
    
    NSString *result = feature.messageString;
    NSLog(@"result: %@", result);
    
    if (result) {
        callback(@[[NSNull null], result]);
    } else {
        callback(@[RCTMakeError(@"QR Parse failed!", nil, nil)]);
        return;
    }
}
@end
