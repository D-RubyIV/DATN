package org.example.demo.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class RandomCodeGenerator {

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 6;

    public String generateRandomCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        // Random 4 chữ cái
        for (int i = 0; i < 4; i++) {
            code.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }

        // Random 2 chữ số
        for (int i = 0; i < 2; i++) {
            code.append(random.nextInt(10)); // Random số từ 0 đến 9
        }

        return code.toString();
    }
}
