// const hdlUtil = require('./hdlUtil.js');
const fs = require('fs');
const Path = require('path');

class CustomPlugin {
    
    apply(compiler) {
        // compiler.hooks.entryOption.tap('Custom Zmage Plugin', (
        //     stats /* stats is passed as an argument when done hook is tapped.  */
        // ) => {
        //     const reactZmageIndexPath = Path.resolve('./node_modules/react-zmage/lib/index.js');
        //     const zmageIndex = this.getZmageIndex();
        //     fs.writeFileSync(reactZmageIndexPath, zmageIndex, {encoding: 'utf8', flag: 'w'});
        //     console.log(hdlUtil.date2string(new Date(), 'ss'), 'alter react zmage index.js: ', reactZmageIndexPath);
        // });
        compiler.hooks.done.tap('Custom Plugin', (
            stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */
        ) => {
            console.log('Custom Plugin', stats);
        });
    }

    /*
        'use strict';
        if (process.env.NODE_ENV === 'production') {
            module.exports = require('./zmage.production.min.js');
        } else {
            module.exports = require('./zmage.development.js');
        }
     */

    // getZmageIndex(){
    //     const arr = [
    //         "'use strict';",
    //         "module.exports = require('./zmage.development.js');"
    //     ];
    //     return arr.join('\n');
    // }

}

module.exports = CustomPlugin;