var webpack = require('webpack'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    webpack: (config, {dev, vendor}) => {
    
        // Grab everything in the model directory
        config.plugins = config.plugins.concat([
            new CopyWebpackPlugin([
                { from: `${__dirname}/train/models/initial-tfjs`, to: 'models/initial' },
            ]),
        ]);
        
        // File system is now in node and all browsers
        config.node = {
            fs: 'empty',
        };

        return config;
    }
}
