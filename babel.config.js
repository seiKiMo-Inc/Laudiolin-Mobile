module.exports = (api) => {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@app": "./src",
                        "@backend": "./src/backend",
                    }
                }
            ]
        ]
    };
};
