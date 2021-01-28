const fs = require('fs')
const path = require('path')
const marked = require('marked')
const hljs = require('highlight.js')
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

const summary_file_name = 'swoft_summary.json'
const doc_base_dir = 'swoft-doc/zh-CN/'

const summary_json = JSON.parse(fs.readFileSync(path.join(__dirname, summary_file_name), { encoding: 'utf-8' }))
let indexes = []
for(let chapter_name in summary_json){
	sections = summary_json[chapter_name]
	for(let section_name in sections){
		section_path = sections[section_name]
		const markdownContent = fs.readFileSync(path.join(doc_base_dir, section_path), { encoding: 'utf-8' })
		const html = `<!DOCTYPE html><html lang="zh_CN"><head><meta charset="UTF-8"><title></title><link rel="stylesheet" href="doc.css" /></head>
		<body><div class="markdown-body">${marked(markdownContent)}</div></body></html>`
		fs.writeFileSync(path.join(__dirname, 'public', 'command', chapter_name.replace('/',' ') + ' - ' + section_name.replace('/',' ') + '.html'), html)
		indexes.push({
			"t":chapter_name+"/"+section_name,
			"d":markdownContent.replace(/#/g,''),
			"p":path.join('command', chapter_name.replace('/',' ') + ' - ' + section_name.replace('/',' ') + '.html')
		})
	}
}
fs.writeFileSync(path.join(__dirname, 'public', 'indexes.json'), JSON.stringify(indexes))