const {unlinkSync} = require('fs');

const File = require('../models/File');

const DeleteFilesService = {
    deleteFiles(files) {
        files.map(file => {
            try {
                File.delete(file.file_id)
                unlinkSync(file.path)
            } catch(error) {
                console.error(error)
              }
        })
    },

    async removeUpdatedFiles(fields) {
        const removedFiles = fields.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1)
        
        const removedFilesPromise = removedFiles.map(async id => {
            const file = await File.findOne({where: {id}})
            File.delete(id)
            unlinkSync(file.path)
        })
        await Promise.all(removedFilesPromise)
    }
}

module.exports = DeleteFilesService;