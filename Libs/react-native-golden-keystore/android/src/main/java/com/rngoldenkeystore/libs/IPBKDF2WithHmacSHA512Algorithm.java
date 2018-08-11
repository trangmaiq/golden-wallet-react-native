package com.rngoldenkeystore.libs;

/**
 * Created by skylab on 7/23/18.
 */

public interface IPBKDF2WithHmacSHA512Algorithm {
    byte[] hash(final char[] chars, final byte[] salt);
}
