randomize = (arr) ->
  curIndex = arr.length

  while 0 != curIndex
    randIndex = Math.floor Math.random() * curIndex
    curIndex -= 1;
    tempVal = arr[curIndex]
    arr[curIndex] = arr[randIndex]
    arr[randIndex] = tempVal

format = (time) ->
  if time < 10 then '0' + time else time

getDate = (d) -> format d.getDate()

getMonth = (d) -> format d.getMonth() + 1

truncate = (string) ->
  if string.length > 30 then string.substring(0,30) + '...' else string

startTime = ->
  d = new Date()
  h = format d.getHours()
  m = format d.getMinutes()
  s = format d.getSeconds()
  $('#time').text h + ' ' + m + ' ' + s
  setTimeout (-> startTime()), 500

defaultRanking = 'Daily'
workmode = "off"

loadOptions = ->
  ranking = localStorage['rankingType']
  if not ranking? then ranking = defaultRanking
  $('input[name=pgata]:radio').each ->
    if $(@)[0].value == ranking then $(@)[0].checked = true
  workmode = localStorage['workMode']
  console.log(localStorage['workMode'])
  if not workmode? then workmode = "off"
  if workmode == "on" then $('input[name="wmode"]').prop("checked", true)

saveOptions = ->
  $('input[name=pgata]:radio').each ->
    if $(@)[0].checked then localStorage['rankingType'] = $(@)[0].value
  localStorage['workMode'] = workmode;
  console.log(localStorage['workMode'])

loadImages = (ranking) ->
  switch ranking
    when 'Daily' then rurl = '/pixiv_daily.json'
    when 'Weekly' then rurl = '/pixiv_weekly.json'
    when 'Monthly' then rurl = '/pixiv_monthly.json'
    when 'Rookie' then rurl = '/pixiv_rookie.json'
    when 'Original' then rurl = '/pixiv_original.json'
    else rurl = '/pixiv_daily.json'

  d = new Date()
  date = getDate(d)
  if date is 1 then date is 29

  timestamp = d.getFullYear().toString() + getMonth(d) + format(date - 1)
  json = 'http://cdn-pixiv.lolita.tw/rankings/' + timestamp + rurl

  items = []

  if workmode is "off"
    req = $.getJSON json, (response) ->
      i = 0
      randomize(response)
      while i < 30
        val = response[i]
        items.push(
          "<div style='display: none' class='pxvimg'><a href='" +
          val['url'] + "'><img src='" + val['img_url'] + "'></a></div>")
        i++

    $('#loader').fadeIn 400
    $('#content').fadeOut 400, ->
      $('#content').empty()
      $('#content').show()

      req.complete ->
        d = $('<div/>', {'id': 'img-list', 'html': items.join('')})
        d.appendTo('#content').each ->
          $('#img-list').waitForImages ->
            $('#loader').fadeOut 400
            $('#img-list').isotope {'itemSelector' : '.pxvimg'}
            $('.pxvimg').each (index) ->
              $(@).delay(100 * index).fadeIn 400
  else $('#loader').fadeOut 400

populateTabList = ->
  chrome.sessions.getRecentlyClosed (sessions) ->
    $('#nodev').hide()
    i = 0
    tabs = []
    while i < 10
      session = sessions[i]
      if session.tab? and session.tab.url.substring(0,9) != 'chrome://'
      then tabs.push(
        "<div class='rc-link'><a href='" +
        session.tab.url + "'>" +
        truncate(session.tab.title) +
        "</a></div>"
      )
      i++

    $('<div/>', {'id': 'rc-list', 'html': tabs.join('')}).appendTo '#rc-panel'

days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
months = [
  'January', 'February', 'March'
  'April', 'May', 'June'
  'July', 'August', 'September'
  'October', 'November', 'December'
]

$(document).ready ->
  startTime()
  loadOptions()

  d = new Date()
  $('#date').text(
    days[d.getDay()] + ", " +
    months[d.getMonth()] + " " +
    d.getDate()
  )

  loadImages localStorage['rankingType']

  debounce = null

  $('#settings').click ->
    $('#sp-wrapper').fadeIn 400
    $('#blackout').fadeIn 400

  $('#dismiss').click ->
    $('#sp-wrapper').fadeOut 400
    $('#blackout').fadeOut 400

  $('#rc-panel, #rc-button').mouseleave ->
    debounce = setTimeout closeMenu, 400

  $('#rc-button, #rc-panel').mouseenter ->
    $('#rc-panel').fadeIn 400
    clearTimeout debounce

  closeMenu = ->
    $('#rc-panel').fadeOut 400
    clearTimeout debounce

  $('input[type="radio"]').click ->
    saveOptions()
    loadImages localStorage['rankingType']

  $('input[name="wmode"]').change ->
    if this.checked
      $('#content').fadeOut 400
      workmode = "on"
    else
      $('#content').fadeIn 400
      workmode = "off"
      loadImages localStorage['rankingType']
    saveOptions()

  populateTabList()
