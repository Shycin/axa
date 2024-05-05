import path, { dirname } from 'path';
import { spawnSync } from 'child_process';

export async function convertPDF_DOCX(pathPDF, pathDOCX) {
    const pythonProcess = await spawnSync('python3', [
        path.join(dirname(require.main.filename), './scripts/converterPDF.py'),
        'converter',
        pathPDF,
        pathDOCX
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();

    if (error) {
        console.log("error converter", error)
    }

    const status = result === 'OK';
    if (status) {
        console.log('DOCX created successfully');
        return true
    } else {
        return false
    }
}