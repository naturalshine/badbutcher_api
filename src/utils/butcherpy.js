const PythonShell = require('python-shell').PythonShell;

const butcherPy = async (srcImg, royaltyHolder, royaltyHolderAmount) => {
    /*
    var options = {
        mode: 'text',
        pythonPath: 'path/to/python',
        pythonOptions: ['-u'],
        scriptPath: 'path/to/my/scripts',
        args: ['value1', 'value2', 'value3']
    };*/

    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [srcImg, royaltyHolder, royaltyHolderAmount]
    };
    
    try{
        PythonShell.run('../scripts/butcherpy/butcher.py', options, function (error, results) {
            if (error) 
                throw error;
        
                // Results is an array consisting of messages collected during execution
                console.log('results: %j', results);
            });
        
        return {
            success: true, 
            message: results
        }
    } catch (error){
        console.log(error);

        return{
            success: false,
            message: error
        }

    }

}

module.export = {
    butcherPy,
}