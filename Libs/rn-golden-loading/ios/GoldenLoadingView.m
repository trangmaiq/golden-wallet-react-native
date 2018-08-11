//
//  GoldenLoadingView.m
//  RNGoldenLoading
//
//  Created by Tran Viet on 7/30/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import "GoldenLoadingView.h"
#import <React/RCTAssert.h>

@implementation GoldenLoadingView {
  CALayer *contentLayer;
  UIImage *contentImage;
}

-(void)layoutSubviews {
  [super layoutSubviews];
  if (contentLayer != NULL) [contentLayer removeFromSuperlayer];
  
  CALayer *layer = [self setupLayer];
  if (contentImage != NULL) layer.contents = (id)[contentImage CGImage];
  contentLayer = layer;
  [self.layer addSublayer:layer];
}

-(CALayer *)setupLayer {
  CALayer *layer = [CALayer layer];
  layer.frame = self.bounds;
  
  CABasicAnimation *rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
  rotationAnimation.toValue = [NSNumber numberWithFloat: M_PI * 2.0];
  rotationAnimation.duration = 2.5;
  rotationAnimation.cumulative = YES;
  rotationAnimation.repeatCount = HUGE_VALF;
  rotationAnimation.removedOnCompletion = NO;
  [layer addAnimation:rotationAnimation forKey:@"rotationAnimation"];
  
  return layer;
}

- (void)setImage:(UIImage *)image {
  contentImage = image;
  [self layoutIfNeeded];
}


- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
}

//
- (void)removeReactSubview:(UIView *)subview {
    [subview removeFromSuperview];
}

@end
