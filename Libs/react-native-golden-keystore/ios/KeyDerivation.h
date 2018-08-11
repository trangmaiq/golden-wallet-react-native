//
//  KeyDerivation.h
//  TestModule
//
//  Created by Tran Viet on 7/24/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import <Foundation/Foundation.h>
@class HDKeyPair;

@interface KeyDerivation : NSObject
@property (strong, nonatomic) NSString *path;
-(instancetype)initWithPath:(NSString *)path;
-(KeyDerivation *)derivePathFromSeed:(NSData *)seed;
-(HDKeyPair *)keyAt:(UInt32)index;
@end
