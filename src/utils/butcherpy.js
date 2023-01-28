const PythonShell = require('python-shell').PythonShell;
const path = require('path');

require('dotenv').config();

const RunPythonScript = async(pythonFile, srcImg, royaltyHolder, royaltyHolderAmount) => {
    let options = {
        mode: 'text',
        pythonPath: process.env.PYTHONPATH,
        pythonOptions: ['-u'],
        args: [srcImg, royaltyHolder, royaltyHolderAmount]
    };
    
  
    return new Promise((resolve,reject) =>{
      try{
        PythonShell.run(pythonFile, options, function(err, results) {
          if (err) {console.log(err);}
          console.log('results', results);
          resolve();          
        }); 
      }
      catch{
        console.log('error running python code')
        reject();
      }
    })
  };

const butcherPy = async (srcImg, royaltyHolder, royaltyHolderAmount) => {
    try{
        let butcherPath = path.resolve(__dirname, '../scripts/butcherpy/butcher.py');

        await RunPythonScript(butcherPath, srcImg, royaltyHolder, royaltyHolderAmount); 
        
        return {
            success: true, 
            message: "Image created"
        }
    } catch (error){
        console.log(error);

        return{
            success: false,
            message: error
        }

    }

}

module.exports = {
    butcherPy,
}

