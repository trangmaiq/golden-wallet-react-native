//
//  Data+HexString.m
//  TestModule
//
//  Created by Tran Viet on 7/25/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import "Data+HexString.h"

@implementation NSData(HexString)
- (NSString *)hexString {
  NSUInteger dataLength = [self length];
  NSMutableString *string = [NSMutableString stringWithCapacity:dataLength*2];

  const unsigned char *dataBytes = [self bytes];
  for (NSInteger idx = 0; idx < dataLength; ++idx) {
    [string appendFormat:@"%02x", dataBytes[idx]];
  }
  
  return string;
}
@end
