const fs = require('fs')
const xlsx = require('xlsx')

let texts = {}

function LoadText(fileName)
{
    return new Promise((resolve, reject) => {
        const workbook = xlsx.readFile(fileName)
        const sheet = workbook.Sheets.contents

        let rowIndex = 2
        let cols = ['B', 'C', 'D']
        let titleCell = sheet[`A${rowIndex}`]
        let title
        let lang
        let content
        while(titleCell)
        {
            title = titleCell.v.toUpperCase()
            texts[title] = {}
            for(const col of cols)
            {
                lang = sheet[`${col}1`].v
                content = sheet[`${col}${rowIndex}`] ? sheet[`${col}${rowIndex}`].v : ''
                texts[title][lang] = content
            }

            rowIndex++
            titleCell = sheet[`A${rowIndex}`]
        }

        resolve()
    })
}

function SaveData()
{
	fs.writeFileSync('assets/strings.js', 'module.exports = ' + JSON.stringify(texts))
}

let promises = []
promises.push(LoadText('strings.ods'))

Promise.all(promises)
    .then(() => SaveData())
