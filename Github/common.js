const IconCopy = '<svg height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>'

function createButton (iconHtml = null, label = null) {
  const button = document.createElement('a')
  button.classList.add('Button--secondary', 'Button--small', 'Button')

  const buttonContent = document.createElement('span')
  buttonContent.classList.add('Button-content')
  button.append(buttonContent)

  if (iconHtml) {
    const buttonVisual = document.createElement('span')
    buttonVisual.classList.add('Button-visual')
    buttonVisual.innerHTML = iconHtml
    buttonContent.append(buttonVisual)
  }

  if (label) {
    const buttonLabel = document.createElement('span')
    buttonLabel.classList.add('Button-label')
    buttonLabel.innerHTML = label
    buttonContent.append(buttonLabel)
  }

  return button
}