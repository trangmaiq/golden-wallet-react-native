package com.rngoldenkeystore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.rngoldenkeystore.libs.ECPoint;
import com.rngoldenkeystore.libs.KeyDerivation;
import com.rngoldenkeystore.libs.Mnemonic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import io.github.novacrypto.bip39.MnemonicValidator;
import io.github.novacrypto.bip39.Validation.InvalidChecksumException;
import io.github.novacrypto.bip39.Validation.InvalidWordCountException;
import io.github.novacrypto.bip39.Validation.UnexpectedWhiteSpaceException;
import io.github.novacrypto.bip39.Validation.WordNotFoundException;
import io.github.novacrypto.bip39.wordlists.English;

/**
 * Created by skylab on 7/25/18.
 */

public class RNGoldenKeystoreModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNGoldenKeystoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNGoldenKeystore";
    }

    @ReactMethod
    public void generateMnemonic(int length, Promise p) {
        byte[] entropy = new byte[length / 8];
        new SecureRandom().nextBytes(entropy);
        Mnemonic mnemonic = new Mnemonic(entropy);
        p.resolve(mnemonic.GetSentence());
    }

    @ReactMethod
    public void mnemonicIsValid(String mnemonic, Promise p) {
        try {
            MnemonicValidator
                    .ofWordList(English.INSTANCE)
                    .validate(mnemonic);
            p.resolve(true);
        } catch (UnexpectedWhiteSpaceException e) {
            p.reject(e);
        } catch (InvalidWordCountException e) {
            p.reject(e);
        } catch (InvalidChecksumException e) {
            p.reject(e);
        } catch (WordNotFoundException e) {
            p.reject(e);
        }
    }

    @ReactMethod
    public void createHDKeyPair(String mnemonic,
                                String passphrase,
                                String path,
                                int index,
                                Promise p) {
        byte[] seed2 = new Mnemonic(mnemonic).GetSeed(passphrase);
        KeyDerivation key = KeyDerivation.createFromSeed(seed2);
        String pathFormated = path.replace("/index", "");
        KeyDerivation child = key.derive(pathFormated);
        if (child == null) {
            p.reject("PATH_NOT_SUPPORTED", "Path is not supported");
        } else {
            ECPoint ecPoint = child.derive(index).getKey();
            String priKey = ecPoint.getPrivateKeyHex();
            String pubKey = ecPoint.getPublicKeyHex();
            WritableMap mapResult = Arguments.createMap();
            mapResult.putString("private_key", priKey);
            mapResult.putString("public_key", pubKey);
            p.resolve(mapResult);
        }

    }

    @ReactMethod
    public void createHDKeyPairs(String mnemonic,
                                 String passphrase,
                                 String path,
                                 int from,
                                 int to,
                                 Promise p) {
        byte[] seed2 = new Mnemonic(mnemonic).GetSeed(passphrase);
        KeyDerivation key = KeyDerivation.createFromSeed(seed2);
        String pathFormated = path.replace("/index", "");
        KeyDerivation child = key.derive(pathFormated);
        if (child == null) {
            p.reject("PATH_NOT_SUPPORTED", "Path is not supported");
        } else {
            WritableArray results = Arguments.createArray();
            for (int i = from; i < to + 1; i++) {
                ECPoint ecPoint = child.derive(i).getKey();
                String priKey = ecPoint.getPrivateKeyHex();
                String pubKey = ecPoint.getPublicKeyHex();
                WritableMap mapResult = Arguments.createMap();
                mapResult.putString("private_key", priKey);
                mapResult.putString("public_key", pubKey);
                results.pushMap(mapResult);
            }
            p.resolve(results);
        }
    }

}
