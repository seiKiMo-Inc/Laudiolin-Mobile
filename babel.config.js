module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            "module-resolver",
            {
                alias: {
                    "@app": "./src",
                    "@backend": "./src/backend",
                    "@pages": "./src/ui/pages",
                    "@modals": "./src/ui/modals",
                    "@widgets": "./src/ui/components/widgets",
                    "@components": "./src/ui/components",
                    "@styles": "./src/ui/styles"
                }
            }
        ]
    ]
};
