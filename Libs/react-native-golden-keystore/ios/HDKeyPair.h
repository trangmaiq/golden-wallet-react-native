//
//  HDKeyPair.h
//  TestModule
//
//  Created by Tran Viet on 7/25/18.
//  Copyright © 2018 Skylab. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <TrezorCrypto/TrezorCrypto.h>

@interface HDKeyPair : NSObject
+(instancetype)fromHDNode:(HDNode)node;
-(NSData *)privateKeyData;
-(NSData *)publicKeyData;
-(NSString *)privateKey;
-(NSString *)publicKey;
@end
