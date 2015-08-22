require! cheerio
#require! stylus
MarkdownIt = require("markdown-it")
md = new MarkdownIt {+html}
.use require('markdown-it-attrs')
.use require('markdown-it-header-sections')
.use require('markdown-it-emoji')
.use require('markdown-it-ins')
.use require('markdown-it-mark')

export function render(input)
  result = md.render input
  $ = cheerio.load result, {-decodeEntities}

  $('section:has(> h2)').each ->
    # XXX :has with immediate is broken
    return if $(@).find('h1').length
    $table = $ '<table />'
    $tr = $ '<tr />'
      .append $ '<th class="col-1" />'
      .append $('<th class="col-2" />').html '希望方式 / 準備事項'
      .append $('<th class="col-3" />').html '✍ 醫師建議 / 備註'
    $table.append $tr
    $(@).find('section:has(> h3)').each ->
      $(@).css display: 'none'
      $h3 = $(@).find('h3')
      $tr = $ '<tr />'
      $th = $ '<th class="col-1" />' .html $h3.html!
      $td = $ '<td />' .html $(@).html!
      $td.find('h3').remove!
      $tr.append $th, $td, $ '<td />'
      $table.append $tr
    $(@).append $table

  s = """
@media print
	.container > h1,
	.container > h2,
	.footer,
  .editor,
	.hint
	  display: none
	.preview
	  width: 90%
	section
	  page-break-inside: avoid

	
table
  width: 100%
  border-collapse: collapse
  th, td
    border: 1px solid black
  th
    &.col-1
      width: 15%
      text-align: left
      padding-left: 1em
    &.col-2
      width: 65%
    &.col-3
      width: 20%
  td
    padding-right: 1em
    padding-top: 0.5em
    padding-bottom: 0.5em
	ul
	  margin-top: 0
	  margin-bottom: 0
  """

  result = $.html!
  stylus(s).render (err, css) ->
    console.log \zz err, css
    result += ['<style>', css, '</style>'].join "\n"
    
  console.log \done
  return result
