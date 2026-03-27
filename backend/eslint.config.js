import js from "@eslint/js";
import globals from "globals";

export default [
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: globals.node,
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: {
            ...js.configs.recommended.rules,
            // Allow unused vars for now, or disable
            "no-unused-vars": "off"
        }
    },
    {
        files: ["tests/**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "off"
        }
    }
];
