let downloadArray = [],
	errorArray = [];


$('.btn-magic').click(function () {
	let bodyText = document.querySelector('#ContentBox');
	// createTree(bodyText);
	removeGarb(bodyText);
	restructureList(bodyText);
	checkTypes(bodyText);
	restructureTele(bodyText);
	removePWithinLi(bodyText);
	$(this).addClass('hide');
	$('.btn-copy').removeClass('hide');

});

// run through the html and sperate tag types that we need
function checkTypes(element) {
	let allTags = document.querySelectorAll('#ContentBox *');
	let bTag = element.querySelectorAll('b');
	let iTag = element.querySelectorAll('i');
	let styleElm = element.querySelectorAll('*[style]');
	let classElm = element.querySelectorAll('*[class]');
	let linkElm = element.querySelectorAll('a');
	let img = element.querySelectorAll('img');
	let h1Tags = element.querySelectorAll('h1');

	checkH1(h1Tags);
	swapbTag(bTag);
	swapiTag(iTag);
	imgFix(img);
	checkLinks(linkElm);
	removeStyle(styleElm);
	removeClass(classElm);
	downloadAllItems(0);

	allTags = document.querySelectorAll('#ContentBox *');
	allTags.forEach(function (element) {
		createTree(element);
	});
}

function createTree(element) {
	let tree = [];
	tree.unshift(element.localName);
	let parentEl = element.parentElement;
	while (parentEl) {
		tree.unshift(parentEl.localName);
		parentEl = parentEl.parentElement;
	}
	let className = "highlight-c-" + tree.length;
	element.classList.add(className);
	// console.log(tree.join(" > "), ", className: ", className);

}

function removePWithinLi(element) {
	let pWithinLi = element.querySelectorAll("li > p");
	for (let i = 0; i < pWithinLi.length; i++) {
		pWithinLi[i].outerHTML = pWithinLi[i].innerHTML;
	}
}

function checkH1(element) {
	if (element.length > 1) {
		for (let i = 1; i < element.length; i++) {
			let pTag = document.createElement("p");
			pTag.innerHTML = element[i].innerHTML;
			element[i].parentNode.replaceChild(pTag, element[i]);
		}
	}
}

// cycle through all passed <b> tags and replace them with <strong> tags
function swapbTag(elementB) {
	for (let i = 0; i < elementB.length; i++) {
		let strongTag = document.createElement('strong');
		strongTag.innerHTML = elementB[i].innerHTML;
		elementB[i].parentNode.replaceChild(strongTag, elementB[i]);
	}
}

// cycle through all passed <i> tags and replace them with <em> tags
function swapiTag(elementI) {
	for (let i = 0; i < elementI.length; i++) {
		let emTag = document.createElement('em');
		emTag.innerHTML = elementI[i].innerHTML;
		elementI[i].parentNode.replaceChild(emTag, elementI[i]);
	}
}

// cycle through all items with inline styles and remove the styles
function removeStyle(styleAttr) {
	for (let i = 0; i < styleAttr.length; i++) {
		styleAttr[i].removeAttribute('style');
	}
}

// cycle through all items with classes and remove the classes
function removeClass(styleAttr) {
	for (let i = 0; i < styleAttr.length; i++) {
		styleAttr[i].removeAttribute('class');
	}
}

function imgFix(element) {
	for (let i = 0; i < element.length; i++) {
		element[i].removeAttribute('width');
		element[i].removeAttribute('height');
		if (element[i].style.float != -1) {
			if (element[i].style.float == 'left') {
				element[i].classList.add('media-left')
			} else {
				element[i].classList.add('media-right');
			}
		}
		element[i].removeAttribute('style');
		if (!element[i].hasAttribute('alt')) {
			element[i].setAttribute('alt', "");
		}
		downloadElement(element[i].src);
	}
}

// cycle all elements and find instances of those in the list to be removed
function removeGarb(element) {
	let allElms = element.querySelectorAll("#ContentBox *");

	// various categories to check for
	let byOuterHTML = ["<o:p></o:p>"];
	let byClass = ["MsoNormal"];
	let byTag = ["span", "div", "#ContentBox > br"];

	// remove based on OuterHTML comparison
	for (let i = 0; i < allElms.length; i++) {
		for (let j = 0; j < byOuterHTML.length; j++) {
			if (allElms[i].outerHTML == byOuterHTML[j]) {
				allElms[i].remove();
			}
		}
	}

	// remove based on Tag
	for (let i = 0; i < byTag.length; i++) {
		// generate list of all of specified Tag
		let tagList = element.querySelectorAll(byTag[i]);
		// iterate through list
		for (let j = 0; j < tagList.length; j++) {
			// get match list of words/numbers that are not spaces/carriage returns/tabs/new lines
			let temp = tagList[j].innerText.match(/[^\s\r\t\n]+/g);
			// if no matches exist
			if (temp === null) {
				tagList[j].remove();
			}
			// if only one match exists
			else if (temp.length == 1) {
				// is it only 1 character
				if (temp[0].length == 1) {
					tagList[j].remove();
				}
				// it is more than 1 character long
				else {
					checkNReplace(tagList[j]);
				}
			}
			else {
				checkNReplace(tagList[j]);
			}
		}
	}

	// remove based on Class comparison
	allElms = element.querySelectorAll("#ContentBox *");
	for (let i = 0; i < allElms.length; i++) {
		allElms[i].innerHTML = allElms[i].innerHTML.replace(/<!--.*?-->/g, "");
		allElms[i].innerHTML = allElms[i].innerHTML.replace(/&nbsp;/g, " ");
		for (let k = 0; k < byClass.length; k++) {
			if (allElms[i].className == byClass[k] && allElms[i].innerHTML === "") {
				allElms[i].remove();
			}
		}
	}

	allElms = element.querySelectorAll("#ContentBox *");

}

// checks Node's parentNode and replaces Tag respectively
function checkNReplace(node) {
	let parentN = node.parentNode;
	// node's parentNode is 'ContentBox'
	if (parentN.id == "ContentBox") {
		// create and populate 'p' tag
		let p = document.createElement("p");
		p.innerText = node.innerText;
		// replace old 'node' tag with new 'p' tag
		parentN.replaceChild(p, node);
	}
	else {
		// remove outer HTML tag
		node.outerHTML = node.innerText;
	}
}



function restructureTele(element) {
	let allElms = element.querySelectorAll("#ContentBox *");
	let teleList = [];
	for (let i = 0; i < allElms.length; i++) {
		if ((/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g).exec(allElms[i].innerHTML)) {

			// add to teleList if innerHTMl doesn't have 'tel:' in it'
			if (allElms[i].innerHTML.search("tel:") == -1 && allElms[i].outerHTML.search("tel:") == -1) {
				teleList.push(allElms[i]);
			}
		}
	}
	for (let i = 0; i < teleList.length; i++) {
		let foundTele = [];
		foundTele = teleList[i].innerHTML.match(/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g);
		for (let j = 0; j < foundTele.length; j++) {
			let a = document.createElement("a");
			a.href = "tel:" + foundTele[j].replace(/[\.\(\)\-]/g, "");
			a.innerHTML = foundTele[j];
			teleList[i].innerHTML = teleList[i].innerHTML.replace(foundTele[j], a.outerHTML);
		}
	}

}

function restructureList(element) {
	let allElms = element.querySelectorAll("#ContentBox *"),
		newUl;
	for (let i = 0; i < allElms.length; i++) {
		if (allElms[i].className == "MsoListParagraphCxSpFirst") {
			newUl = document.createElement("ul");
			newUl.appendChild(createNewLi(allElms[i]));
			allElms[i].remove();
		}
		if (allElms[i].className == "MsoListParagraphCxSpMiddle") {
			newUl.appendChild(createNewLi(allElms[i]));
			allElms[i].remove();
		}
		if (allElms[i].className == "MsoListParagraphCxSpLast") {
			var parentN = allElms[i].parentNode;
			newUl.appendChild(createNewLi(allElms[i]));
			parentN.replaceChild(newUl, allElms[i]);
		}
		if (allElms[i].className == "MsoListParagraph") {
			newUl = document.createElement("ul");
			newUl.appendChild(createNewLi(allElms[i]));
			parentN.replaceChild(newUl, allElms[i]);
		}
	}
}

function createNewLi(element) {
	let newLi = document.createElement("li");
	newLi.innerHTML = element.innerHTML;
	return newLi;
}

function checkLinks(elArray) {
	for (let i = 0; i < elArray.length; i++) {
		let href = elArray[i].getAttribute('href');
		if (href != 'javascript:void(0)' && href != null) {
			checkExtensions(href);
		}
	}
}

function checkExtensions(src) {
	let acceptedExtns = [['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['jpg', 'image/jpeg'], ['pdf', 'application/pdf'], ['xls', '/application/vnd.ms-excel'], ['doc', 'application/msword'], ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], ['csv', '	text/csv']]
	for (let j = 0; j < acceptedExtns.length; j++) {
		if (src.includes(acceptedExtns[j][0])) {
			downloadArray.push([src, acceptedExtns[j][1]])
			break;
		}
	}
}

// download elements
function downloadElement(el) {
	let fullPath = (el[0].includes('?') ? el.split('?')[0] : el[0]),
		fileName = fullPath.replace(/^.*[\\\/]/, ''),
		fileParts = fileName.split('.');
	try {
		download(fileParts[0], fileName, el[1]);
	}
	catch (error) {
		errorArray.push(error);
	}
}


// download all items from array
function downloadAllItems(i) {
	if (i < downloadArray.length) {
		setTimeout(function () {
			downloadElement(downloadArray[i]);
			i++;
			downloadAllItems(i);
		}, 100);
	}
}

//
function printErrors() {
	for (let i = 0; i < errorArray.length; i++) {
		let p = document.createElement('p');
		p.textContent = errorArray[i];
		$('#ContentBox').appendChild(p);
	}
}