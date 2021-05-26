$(function() {
	let fieldsetCount = $('#formElem').children().length
	let current = 1
	let stepsWidth = 0
	let width = new Array()
	$('.step').each(function(index) {
		let step = $(this)
		width[index] = stepsWidth
		stepsWidth += step.width()
	})
	$('#steps').width(stepsWidth)
	$('#formElem').children(':first').find(':input:first').focus()
	$('#navigation a').bind('click', function(e) {
		let $this = $(this)
		let prev = current
		$this.closest('ul').find('li').removeClass('selected')
		$this.parent().addClass('selected')
		current =$this.parent().index() + 1

		$('#steps').stop().animate({
			marginLeft: '-' + width[current - 1] + 'px'
		}, 500, function() {
			if (current === fieldsetCount) {
				validateSteps()
			}
			else
				validateStep(prev)

			$('#formElem').children(`:nth-child(${current})`).find(':input:first').focus()
		})
		e.preventDefault()
	})
	$('#formElem > fieldset').each(function() {
		let $fieldset = $(this)
		$fieldset.children(':last').find(':input').keydown(
			function(e) {
				if (e.which == 9) {
					$(`#navigation li:nth-child(${current + 1}) a`).click()
					$(this).blur()
					e.preventDefault()
				}
			})
	})

	function validateSteps() {
		let formError = false
		for (var i = 1; i < fieldsetCount.length; ++i) {
			let error = validateStep(i)
			if (error === -1) {
				formError = true
			}
		}
		$('#formElem').data('errors', formElem)
	}

	function validateStep(step) {
		if (step === fieldsetCount) {
			return
		}

		let error = 1
		let hasError = false

		$('#formElem').children(`:nth-child(${step})`).find(':input:not(button)').each(function() {
			let $this = $(this)
			let valueLength = jQuery.trim($this.val()).length

			if (valueLength == '') {
				hasError = true
				$this.css('background-color', '#ffedef')
			}
			else {
				$this.css('background-color', '#fff')
			}
		})

		let $link = $(`#navigation li:nth-child(${step}) a`)
		$link.parent().find('.error, checked').remove()

		let valClass = 'checked'
		if (hasError) {
			error = -1
			valClass = 'error'
		}

		$(`<span class="${valClass}"></span`).insertAfter($link)
		return error
	}

	$('#registerButton').bind('click', function() {
		if ($('#formElem').data('errors')) {
			alert('Please correct the errors in the Form')
			return false
		}
	})
})