let downloadArray = [],
	errorArray = [];


$('.btn-magic').click(function () {
	let bodyText = document.querySelector('#ContentBox');
	// createTree(bodyText);
	removeGarb(bodyText);
	checkTypes(bodyText);
	restructureTele(bodyText);

});

// run through the html and seperate tag types that we need
function checkTypes(element) {
	let parentN = element.parentNode;
	
	let bTag = parentN.querySelectorAll('b');
	let iTag = parentN.querySelectorAll('i');
	let styleElm = parentN.querySelectorAll('*[style]');
	let classElm = parentN.querySelectorAll('*[class]');
	let linkElm = parentN.querySelectorAll('a');
	let img = parentN.querySelectorAll('img');
	let h1Tags = parentN.querySelectorAll('h1');

	checkH1(h1Tags);
	swapbTag(bTag);
	swapiTag(iTag);
	
	checkLinks(linkElm);
	removeStyle(styleElm);
	removeClass(classElm);
	downloadAllItems(0);

	let allTags = parentN.querySelectorAll('*');
	restructureTele(allTags);
	switchStatements(allTags);
	removeExtraNodes(allTags);

}
function switchStatements(nodeList){
	for (let i = 0; i < nodeList.length; i++){
		let nodeType = element[i].nodeName;
		switch(nodeType)
		{
			case "SPAN": 
				let parentN = element.parentNode;
				let removeSpanIf = ["UL", "OL", "LI", "P"];
				if (removeSpanIf.includes(parentN.nodeName)){
					element.outerHTML = element.innerHTML;
				}
				else{
					// do nothing
				}
				break;
			case "BR":
				let parentN = element.parentNode;
				let reformatBrIf = ["P"];
				if (reformatBrIf.includes(parentN.nodeName)){
					let newPTagList = parentN.innerHTML.split("<br>");
					newPTagList = newPTagList.map(createNewP);
					let pTagsConcat = newPTagList.join();
					parentN.outerHTML = pTagsConcat;
				}
				else{
					// do nothing
				}
				break;
			case "IMG":
				imgFix(element[i]);
				break;
			case "A":
				
		}
	}
	
}

// creates '<p>' tag with innerHTML equal to 'string'
function createNewP(string) {
	let newP = document.createElement("p");
	newP.innerHTML = string;
	return newP;
}

// checks/handles element to make sure there is only one H1 header
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
function removeExtraNodes(nodeList) {
	for (let i = 0; i < element.length; i++) {
		// remove HTML comments
		allTags[i].innerHTML = allTags[i].innerHTML.replace(/<!--.*?-->/g, "");
		// replace non-breaking spaces with spaces
		allTags[i].innerHTML = allTags[i].innerHTML.replace(/&nbsp;/g, " ");
		// get match list of words/numbers that are not spaces/carriage returns/tabs/new lines
		let temp = tagList[i].innerText.match(/[^\s\r\t\n]+/g);
		
		// if no matches (no 'words') exist
		if (temp === null || (temp.length == 1 && temp[0].length == 1)) {
			tagList[i].remove();
		}
	}
}

function restructureTele(nodeList) {
	// list of telephone number 'nodes' that need "tel: " links
	let teleList = [];
	for (let i = 0; i < nodeList.length; i++) {
		// searches for phone number with various formats
		if ((/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g).exec(nodeList[i].innerHTML)) {
			// add node to teleList if innerHTMl doesn't have "tel:" link in it
			if (nodeList[i].innerHTML.search("tel:") == -1 && nodeList[i].outerHTML.search("tel:") == -1) {
				teleList.push(nodeList[i]);
			}
		}
	}
	// takes teleList, strips each number of special characters, then creates a link for that node
	for (let i = 0; i < teleList.length; i++) {
		let foundTele = [];
		foundTele = teleList[i].innerHTML.match(/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g);
		for (let j = 0; j < foundTele.length; j++) {
			// create anchor/link tag
			let a = document.createElement("a");
			a.href = "tel:" + foundTele[j].replace(/[\.\(\)\-]/g, "");
			// populate anchor tag link area with new cleaned up number
			a.innerHTML = foundTele[j];
			// replace old node with newly made node with link
			teleList[i].innerHTML = teleList[i].innerHTML.replace(foundTele[j], a.outerHTML);
		}
	}

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