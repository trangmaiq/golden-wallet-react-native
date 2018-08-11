//
//  KeyIndexPath.m
//  TestModule
//
//  Created by Tran Viet on 7/25/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import "KeyIndexPath.h"

const UInt32 highestBit = 0x80000000;

@implementation KeyIndexPath
- (instancetype)initWithValue:(UInt32)value hardened:(bool)hardened {
  if (self = [self init]) {
    self.value = hardened ? value | highestBit : value;
    self.hardened = hardened;
  }
  
  return self;
}
@end
