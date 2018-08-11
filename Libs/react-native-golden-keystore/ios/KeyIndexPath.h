//
//  KeyIndexPath.h
//  TestModule
//
//  Created by Tran Viet on 7/25/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface KeyIndexPath : NSObject
@property (nonatomic) UInt32 value;
@property (nonatomic) BOOL hardened;
-(instancetype)initWithValue:(UInt32)value hardened:(bool)hardened;
@end
