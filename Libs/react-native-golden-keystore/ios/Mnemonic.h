//
//  Mnemonic.h
//  RNGoldenHdNode
//
//  Created by Tran Viet on 7/24/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import <Foundation/Foundation.h>
@class KeyDerivation;

@interface Mnemonic : NSObject
@property (strong, nonatomic) NSString *value;
@property (strong, nonatomic) NSData *seed;

+(instancetype)generateRandomWithStrength:(int)strength;
+(instancetype)fromMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase;
+(instancetype)fromDataSeed:(NSData *)seed;
+(BOOL)isValid:(NSString *)mnemonic;

-(KeyDerivation *)keyDerivationWithPath:(NSString *)path;
@end
